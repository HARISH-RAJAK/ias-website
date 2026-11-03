<?php
/**
 * Authentication & Authorization Middleware
 * Verifies Bearer tokens using secure HMAC-SHA256 signatures
 */

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';

class AuthMiddleware {
    private static string $secretKey = 'upsc_sankalp_secret_token_key_2026';

    /**
     * Generate secure signed token for user
     */
    public static function generateToken(array $user): string {
        $payload = [
            'id'    => $user['id'],
            'email' => $user['email'],
            'role'  => $user['role'] ?? 'student',
            'exp'   => time() + (86400 * 7), // 7 days expiration
        ];
        $encodedPayload = base64_encode(json_encode($payload));
        $signature = hash_hmac('sha256', $encodedPayload, self::$secretKey);

        return $encodedPayload . '.' . $signature;
    }

    /**
     * Authenticate request and return user object
     */
    public static function authenticate(): ?array {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            errorResponse('Access denied. Authentication token is required.', 401);
            return null;
        }

        $token = $matches[1];
        $parts = explode('.', $token);

        if (count($parts) !== 2) {
            errorResponse('Malformed authentication token.', 401);
            return null;
        }

        [$encodedPayload, $signature] = $parts;
        $expectedSignature = hash_hmac('sha256', $encodedPayload, self::$secretKey);

        if (!hash_equals($expectedSignature, $signature)) {
            errorResponse('Invalid token signature.', 401);
            return null;
        }

        $payload = json_decode(base64_decode($encodedPayload), true);
        if (!$payload || !isset($payload['id']) || !isset($payload['exp'])) {
            errorResponse('Invalid token payload.', 401);
            return null;
        }

        if (time() > $payload['exp']) {
            errorResponse('Authentication token has expired. Please log in again.', 401);
            return null;
        }

        // Verify user against database if DB is connected
        $userModel = new User();
        $user = $userModel->findById((int)$payload['id']);

        if (!$user) {
            // If offline fallback demo account
            return [
                'id'    => $payload['id'],
                'name'  => $payload['name'] ?? 'Aspirant',
                'email' => $payload['email'],
                'role'  => $payload['role'] ?? 'student',
            ];
        }

        unset($user['password']);
        return $user;
    }

    /**
     * Enforce Role-Based Access Control (RBAC)
     */
    public static function requireRole(string $requiredRole): array {
        $user = self::authenticate();
        if ($user['role'] !== $requiredRole && $user['role'] !== 'admin') {
            errorResponse("Forbidden: requires {$requiredRole} privileges.", 403);
        }
        return $user;
    }
}


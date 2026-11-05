<?php
/**
 * Auth Controller
 * Handles user registration, login, logout, token session verification, and Google OAuth
 */

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../config/database.php';

class AuthController {
    private User $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function register(): void {
        $data = getRequestBody();

        $name = sanitizeInput($data['name'] ?? '');
        $email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
        $password = $data['password'] ?? '';

        if (!$name || !$email || strlen($password) < 6) {
            errorResponse('Validation failed: valid name, email, and 6+ char password required.', 422);
            return;
        }

        $existing = $this->userModel->findByEmail($email);
        if ($existing) {
            errorResponse('An account with this email address already exists.', 409);
            return;
        }

        $userId = $this->userModel->create([
            'name'     => $name,
            'email'    => $email,
            'password' => $password,
            'role'     => 'student',
        ]);

        $user = [
            'id'    => $userId,
            'name'  => $name,
            'email' => $email,
            'role'  => 'student',
        ];

        $token = AuthMiddleware::generateToken($user);

        jsonResponse([
            'user'  => $user,
            'token' => $token,
        ], 201, 'Registration successful. Welcome to Sankalp IAS!');
    }

    public function login(): void {
        $data = getRequestBody();

        $email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
        $password = $data['password'] ?? '';

        if (!$email || empty($password)) {
            errorResponse('Email and password are required.', 422);
            return;
        }

        $user = $this->userModel->findByEmail($email);
        if (!$user || !password_verify($password, $user['password'])) {
            errorResponse('Invalid email or password credentials.', 401);
            return;
        }

        unset($user['password']);
        $token = AuthMiddleware::generateToken($user);

        jsonResponse([
            'user'  => $user,
            'token' => $token,
        ], 200, 'Login successful.');
    }

    /**
     * Google OAuth 2.0 Sign-In / Sign-Up
     * Verifies Google ID token and returns authenticated session
     */
    public function googleLogin(): void {
        try {
            $data = getRequestBody();
            $idToken = $data['credential'] ?? $data['id_token'] ?? '';

            if (empty($idToken)) {
                errorResponse('Google ID token (credential) is required.', 422);
                return;
            }

            // Verify ID token directly with Google's secure tokeninfo service
            $googleUser = $this->verifyGoogleToken($idToken);
            if (!$googleUser) {
                errorResponse('Google authentication failed: Token could not be verified by Google.', 401);
                return;
            }

            $email = filter_var($googleUser['email'] ?? '', FILTER_VALIDATE_EMAIL);
            if (!$email) {
                errorResponse('Invalid email returned from Google account.', 422);
                return;
            }

            $name = sanitizeInput($googleUser['name'] ?? explode('@', $email)[0]);
            $avatar = $googleUser['picture'] ?? null;

            // Check if user already exists
            $user = $this->userModel->findByEmail($email);

            if ($user) {
                // Existing user: update avatar if missing
                if (!empty($avatar) && empty($user['avatar'])) {
                    $this->userModel->updateAvatar((int)$user['id'], $avatar);
                    $user['avatar'] = $avatar;
                }
                unset($user['password']);
                $token = AuthMiddleware::generateToken($user);

                jsonResponse([
                    'user'  => $user,
                    'token' => $token,
                    'isNew' => false,
                ], 200, 'Welcome back, ' . $user['name'] . '!');
                return;
            }

            // New user: register automatically with Google details
            $randomPassword = bin2hex(random_bytes(16));
            $userId = $this->userModel->create([
                'name'     => $name,
                'email'    => $email,
                'password' => $randomPassword,
                'role'     => 'student',
                'avatar'   => $avatar,
            ]);

            $newUser = [
                'id'     => $userId,
                'name'   => $name,
                'email'  => $email,
                'role'   => 'student',
                'avatar' => $avatar,
            ];

            $token = AuthMiddleware::generateToken($newUser);

            jsonResponse([
                'user'  => $newUser,
                'token' => $token,
                'isNew' => true,
            ], 201, 'Account successfully created with Google. Welcome to Sankalp IAS!');
        } catch (Throwable $e) {
            error_log("Google Login Exception: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
            errorResponse('Google login error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Validate Google ID Token with Google OAuth API
     */
    private function verifyGoogleToken(string $idToken): ?array {
        $expectedClientId = Database::getEnv('GOOGLE_CLIENT_ID', '498419590377-k4087pu2ugns2s9nsvt24bes6kf3696r.apps.googleusercontent.com');
        $url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($idToken);

        $response = null;
        if (function_exists('curl_init')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Prevent cURL error 60 on shared hostings
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_TIMEOUT, 12);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlErr = curl_error($ch);
            curl_close($ch);

            if ($httpCode !== 200 || !$response) {
                error_log("Google Token Verification cURL failed. Code: {$httpCode}, Err: {$curlErr}");
                return null;
            }
        } else {
            $ctx = stream_context_create([
                'ssl'  => ['verify_peer' => false, 'verify_peer_name' => false],
                'http' => ['timeout' => 12, 'ignore_errors' => true]
            ]);
            $response = @file_get_contents($url, false, $ctx);
            if (!$response) {
                error_log("Google Token Verification file_get_contents failed.");
                return null;
            }
        }

        $payload = json_decode($response, true);
        if (!is_array($payload)) {
            return null;
        }

        // Verify audience matches our Google Client ID
        if (isset($payload['aud']) && trim($payload['aud']) !== trim($expectedClientId)) {
            error_log("Google Token Audience mismatch. Expected: {$expectedClientId}, Got: " . ($payload['aud'] ?? 'none'));
            return null;
        }

        // Verify issuer is Google
        $validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
        if (isset($payload['iss']) && !in_array($payload['iss'], $validIssuers, true)) {
            error_log("Google Token Issuer mismatch: " . ($payload['iss'] ?? 'none'));
            return null;
        }

        // Verify token expiration
        if (isset($payload['exp']) && (int)$payload['exp'] < time()) {
            error_log("Google Token Expired.");
            return null;
        }

        // Verify email ownership
        $emailVerified = $payload['email_verified'] ?? false;
        if ($emailVerified !== true && $emailVerified !== 'true') {
            error_log("Google Token Email not verified.");
            return null;
        }

        return $payload;
    }

    public function logout(): void {
        // Stateless JWT token logout or invalidate session
        jsonResponse(null, 200, 'Successfully logged out.');
    }

    public function me(): void {
        $user = AuthMiddleware::authenticate();
        if ($user) {
            jsonResponse(['user' => $user], 200, 'User profile retrieved.');
        }
    }
}

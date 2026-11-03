<?php
/**
 * Auth Controller
 * Handles user registration, login, logout, and token session verification
 */

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

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


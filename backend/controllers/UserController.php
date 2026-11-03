<?php
/**
 * User Controller
 */

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class UserController {
    private User $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function profile(): void {
        $authUser = AuthMiddleware::authenticate();
        $user = $this->userModel->findById((int)$authUser['id']);
        if (!$user) {
            errorResponse('User profile not found.', 404);
            return;
        }
        jsonResponse(['user' => $user], 200, 'Profile loaded.');
    }
}


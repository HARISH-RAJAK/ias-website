<?php
/**
 * API Router for UPSC Education Portal
 */

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/database.php';

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/CurrentAffairsController.php';
require_once __DIR__ . '/../controllers/QuizController.php';
require_once __DIR__ . '/../controllers/MainsController.php';
require_once __DIR__ . '/../controllers/CourseController.php';

class Router {
    public static function dispatch(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Normalize URI: strip trailing slash and base folder if served under subfolder
        $uri = rtrim($uri, '/');
        if (empty($uri)) {
            $uri = '/';
        }

        // Strip prefix if any (e.g. /backend, /public, /index.php)
        $uri = preg_replace('#^/backend#', '', $uri);
        $uri = preg_replace('#^/public#', '', $uri);
        $uri = preg_replace('#^/index\.php#', '', $uri);

        // 1. Health-check endpoint: /api/health
        if ($method === 'GET' && ($uri === '/api/health' || $uri === '/health')) {
            $dbConnected = Database::isConnected();
            jsonResponse([
                'status'    => 'ok',
                'service'   => 'Sankalp IAS REST API',
                'database'  => $dbConnected ? 'connected' : 'disconnected (using offline fallback)',
                'timestamp' => date('Y-m-d H:i:s'),
                'php_version' => PHP_VERSION,
            ], 200, 'Backend API is running smoothly.');
            return;
        }

        // 2. Authentication routes
        $authController = new AuthController();
        if ($method === 'POST' && ($uri === '/api/register' || $uri === '/register')) {
            $authController->register();
            return;
        }
        if ($method === 'POST' && ($uri === '/api/login' || $uri === '/login')) {
            $authController->login();
            return;
        }
        if ($method === 'POST' && ($uri === '/api/auth/google' || $uri === '/api/google-login' || $uri === '/auth/google' || $uri === '/google-login')) {
            $authController->googleLogin();
            return;
        }
        if ($method === 'POST' && ($uri === '/api/logout' || $uri === '/logout')) {
            $authController->logout();
            return;
        }
        if ($method === 'GET' && ($uri === '/api/me' || $uri === '/me')) {
            $authController->me();
            return;
        }

        // 3. User routes
        $userController = new UserController();
        if ($method === 'GET' && ($uri === '/api/user/profile' || $uri === '/user/profile')) {
            $userController->profile();
            return;
        }

        // 4. Current Affairs routes
        $caController = new CurrentAffairsController();
        if ($method === 'GET' && ($uri === '/api/current-affairs' || $uri === '/current-affairs')) {
            $caController->index();
            return;
        }
        if ($method === 'POST' && ($uri === '/api/current-affairs' || $uri === '/current-affairs')) {
            $caController->store();
            return;
        }
        if (preg_match('#^/api/current-affairs/(\d+)$#', $uri, $matches)) {
            $id = (int)$matches[1];
            if ($method === 'GET') {
                $caController->show($id);
                return;
            }
            if ($method === 'PUT') {
                $caController->update($id);
                return;
            }
            if ($method === 'DELETE') {
                $caController->destroy($id);
                return;
            }
        }

        // 5. Prelims Quiz routes
        $quizController = new QuizController();
        if ($method === 'GET' && ($uri === '/api/quizzes' || $uri === '/quizzes')) {
            $quizController->index();
            return;
        }
        if (preg_match('#^/api/quizzes/(\d+)$#', $uri, $matches)) {
            $id = (int)$matches[1];
            if ($method === 'GET') {
                $quizController->show($id);
                return;
            }
        }
        if (preg_match('#^/api/quizzes/(\d+)/submit$#', $uri, $matches) && $method === 'POST') {
            $quizController->submit((int)$matches[1]);
            return;
        }

        // 6. Mains Answer Writing routes
        $mainsController = new MainsController();
        if ($method === 'GET' && ($uri === '/api/mains/questions' || $uri === '/mains/questions')) {
            $mainsController->getQuestions();
            return;
        }
        if (preg_match('#^/api/mains/questions/(\d+)$#', $uri, $matches) && $method === 'GET') {
            $mainsController->showQuestion((int)$matches[1]);
            return;
        }
        if ($method === 'POST' && ($uri === '/api/mains/submit' || $uri === '/mains/submit')) {
            $mainsController->submitAnswer();
            return;
        }
        if (preg_match('#^/api/mains/questions/(\d+)/synopsis$#', $uri, $matches) && $method === 'PUT') {
            $mainsController->publishSynopsis((int)$matches[1]);
            return;
        }

        // 7. Courses routes
        $courseController = new CourseController();
        if ($method === 'GET' && ($uri === '/api/courses' || $uri === '/courses')) {
            $courseController->index();
            return;
        }
        if (preg_match('#^/api/courses/(\d+)$#', $uri, $matches) && $method === 'GET') {
            $courseController->show((int)$matches[1]);
            return;
        }
        if ($method === 'POST' && ($uri === '/api/courses' || $uri === '/courses')) {
            $courseController->store();
            return;
        }

        // Root fallback welcome
        if ($uri === '/' || $uri === '/api') {
            jsonResponse([
                'title' => 'Sankalp IAS Preparation Portal REST API',
                'version' => '1.0.0',
                'documentation' => 'See README.md for endpoint list',
                'health_check' => '/api/health',
            ], 200, 'API root online.');
            return;
        }

        // 404 Route Not Found
        errorResponse("Endpoint '{$method} {$uri}' not found.", 404);
    }
}


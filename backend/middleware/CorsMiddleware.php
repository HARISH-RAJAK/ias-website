<?php
/**
 * CORS Middleware
 * Reads allowed frontend origin dynamically from backend/.env
 * Handles OPTIONS preflight requests cleanly
 */

require_once __DIR__ . '/../config/database.php';

class CorsMiddleware {
    public static function handle(): void {
        $frontendUrl = Database::getEnv('FRONTEND_URL', 'http://localhost:5173');
        $httpOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

        // If origin matches configured FRONTEND_URL or local Vite dev server
        if (!empty($httpOrigin)) {
            // Check allowed origins
            $allowedOrigins = [
                rtrim($frontendUrl, '/'),
                'https://ias.clickncult.com',
                'http://localhost:5173',
                'http://127.0.0.1:5173',
            ];

            if (in_array(rtrim($httpOrigin, '/'), $allowedOrigins, true)) {
                header("Access-Control-Allow-Origin: {$httpOrigin}");
            } else {
                header("Access-Control-Allow-Origin: {$frontendUrl}");
            }
        } else {
            header("Access-Control-Allow-Origin: {$frontendUrl}");
        }

        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400'); // Cache preflight for 24 hours
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');

        // Respond immediately to OPTIONS preflight
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit(0);
        }
    }
}


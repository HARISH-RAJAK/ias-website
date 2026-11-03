<?php
/**
 * Application Entry Point - Public Front Controller
 * Handles all REST API requests for UPSC Education Portal
 */

// Error reporting settings: log errors, don't display raw errors to browser in production
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Autoload Composer dependencies if available
$composerAutoload = dirname(__DIR__) . '/vendor/autoload.php';
if (file_exists($composerAutoload)) {
    require_once $composerAutoload;
}

// Load Core Helpers & Config
require_once dirname(__DIR__) . '/helpers/response.php';
require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/middleware/CorsMiddleware.php';
require_once dirname(__DIR__) . '/routes/api.php';

// Handle CORS before anything else
CorsMiddleware::handle();

// Dispatch API Router with global error catching
try {
    Router::dispatch();
} catch (Throwable $e) {
    error_log("Unhandled Exception: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
    errorResponse("Internal Server Error. Please try again later.", 500);
}


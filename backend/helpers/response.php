<?php
/**
 * Standard JSON Response Helper for UPSC Portal REST APIs
 */

if (!function_exists('jsonResponse')) {
    function jsonResponse($data = null, int $statusCode = 200, string $message = '', bool $success = true) {
        // Clear any previous output buffers
        if (ob_get_length()) {
            ob_clean();
        }

        http_response_code($statusCode);
        header('Content-Type: application/json; charset=UTF-8');

        $response = [
            'success' => $success,
            'message' => $message,
            'status'  => $statusCode,
            'data'    => $data,
        ];

        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

if (!function_exists('errorResponse')) {
    function errorResponse(string $message, int $statusCode = 400, $errors = null) {
        // Clear any previous output buffers
        if (ob_get_length()) {
            ob_clean();
        }

        http_response_code($statusCode);
        header('Content-Type: application/json; charset=UTF-8');

        $response = [
            'success' => false,
            'message' => $message,
            'status'  => $statusCode,
            'errors'  => $errors,
        ];

        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

if (!function_exists('sanitizeInput')) {
    function sanitizeInput($data) {
        if (is_array($data)) {
            return array_map('sanitizeInput', $data);
        }
        return is_string($data) ? htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8') : $data;
    }
}

if (!function_exists('getRequestBody')) {
    function getRequestBody() {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            return $_POST;
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : $_POST;
    }
}


<?php
/**
 * Course Controller
 */

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../models/Course.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class CourseController {
    private Course $courseModel;

    public function __construct() {
        $this->courseModel = new Course();
    }

    public function index(): void {
        $courses = $this->courseModel->getAll();
        jsonResponse($courses, 200, 'Courses loaded.');
    }

    public function show(int $id): void {
        $course = $this->courseModel->getById($id);
        if (!$course) {
            errorResponse('Course not found.', 404);
            return;
        }
        jsonResponse($course, 200, 'Course details.');
    }

    public function store(): void {
        AuthMiddleware::requireRole('admin');
        $data = getRequestBody();

        if (empty($data['title'])) {
            errorResponse('Course title is required.', 422);
            return;
        }

        $id = $this->courseModel->create($data);
        jsonResponse(['id' => $id], 201, 'Course created.');
    }
}


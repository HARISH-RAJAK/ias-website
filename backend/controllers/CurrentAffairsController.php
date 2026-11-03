<?php
/**
 * Current Affairs Controller
 */

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../models/CurrentAffair.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class CurrentAffairsController {
    private CurrentAffair $caModel;

    public function __construct() {
        $this->caModel = new CurrentAffair();
    }

    public function index(): void {
        $category = $_GET['category'] ?? null;
        $date = $_GET['date'] ?? null;
        $search = $_GET['search'] ?? null;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;

        $articles = $this->caModel->getAll($category, $date, $search, $limit);
        jsonResponse($articles, 200, 'Current affairs loaded.');
    }

    public function show(int $id): void {
        $article = $this->caModel->getById($id);
        if (!$article) {
            errorResponse('Current affairs article not found.', 404);
            return;
        }
        jsonResponse($article, 200, 'Article details.');
    }

    public function store(): void {
        AuthMiddleware::requireRole('admin');
        $data = getRequestBody();

        if (empty($data['title']) || empty($data['summary'])) {
            errorResponse('Article title and summary are mandatory.', 422);
            return;
        }

        $id = $this->caModel->create($data);
        jsonResponse(['id' => $id], 201, 'Current affairs article published.');
    }

    public function update(int $id): void {
        AuthMiddleware::requireRole('admin');
        $data = getRequestBody();
        $this->caModel->update($id, $data);
        jsonResponse(null, 200, 'Article updated.');
    }

    public function destroy(int $id): void {
        AuthMiddleware::requireRole('admin');
        $this->caModel->delete($id);
        jsonResponse(null, 200, 'Article deleted.');
    }
}


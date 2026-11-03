<?php
/**
 * Mains Answer Writing Controller
 */

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class MainsController {
    private ?PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getQuestions(): void {
        if (!$this->db) {
            jsonResponse($this->getFallbackQuestions(), 200, 'Questions loaded.');
            return;
        }

        $stmt = $this->db->query("SELECT * FROM mains_questions ORDER BY published_date DESC, id DESC");
        $questions = $stmt->fetchAll();
        jsonResponse(!empty($questions) ? $questions : $this->getFallbackQuestions(), 200, 'Questions loaded.');
    }

    public function showQuestion(int $id): void {
        if (!$this->db) {
            $questions = $this->getFallbackQuestions();
            foreach ($questions as $q) {
                if ($q['id'] === $id) {
                    jsonResponse($q, 200, 'Question found.');
                    return;
                }
            }
            errorResponse('Question not found.', 404);
            return;
        }

        $stmt = $this->db->prepare("SELECT * FROM mains_questions WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();

        if (!$row) {
            errorResponse('Question not found.', 404);
            return;
        }
        jsonResponse($row, 200, 'Question details.');
    }

    public function submitAnswer(): void {
        $data = getRequestBody();

        $questionId = (int)($data['question_id'] ?? 0);
        $answerText = sanitizeInput($data['answer_text'] ?? '');
        $wordCount = (int)($data['word_count'] ?? 0);

        if (!$questionId || empty($answerText)) {
            errorResponse('Question ID and Answer text are required.', 422);
            return;
        }

        if ($this->db) {
            $sql = "INSERT INTO mains_submissions (user_id, question_id, answer_text, word_count, status, submitted_at)
                    VALUES (:user_id, :question_id, :answer_text, :word_count, 'submitted', NOW())";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':user_id'     => $data['user_id'] ?? null,
                ':question_id' => $questionId,
                ':answer_text' => $answerText,
                ':word_count'  => $wordCount,
            ]);
        }

        jsonResponse([
            'submitted'  => true,
            'word_count' => $wordCount,
        ], 201, 'Mains answer submitted successfully.');
    }

    public function publishSynopsis(int $id): void {
        AuthMiddleware::requireRole('admin');
        $data = getRequestBody();

        if ($this->db) {
            $sql = "UPDATE mains_questions 
                    SET model_answer = :model_answer, synopsis = :synopsis, updated_at = NOW() 
                    WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':model_answer' => $data['model_answer'] ?? '',
                ':synopsis'     => $data['synopsis'] ?? '',
                ':id'           => $id,
            ]);
        }

        jsonResponse(null, 200, 'Synopsis published.');
    }

    private function getFallbackQuestions(): array {
        return [
            [
                'id' => 1,
                'paper' => 'GS Paper II',
                'topic' => 'Constitution & Federalism',
                'question_text' => 'Analyze the constitutional tensions arising between elected State Cabinets and the office of the Governor. How can institutional safeguards preserve cooperative federalism in India? (15 Marks, 250 Words)',
                'word_limit' => 250,
                'marks' => 15,
                'published_date' => date('Y-m-d'),
                'model_answer' => "Dual role of Governor...\nSarkaria & Punchhi recommendations on Article 200.\nCooperative federalism requires constitutional morality.",
                'synopsis' => 'Structure: Constitutional baseline -> Friction zones -> Judicial rulings -> Reformation pathway.',
            ],
            [
                'id' => 2,
                'paper' => 'GS Paper III',
                'topic' => 'Economy & Industrial Policy',
                'question_text' => 'Examine whether production-linked incentives (PLI) can transform India from an assembly hub into an indigenous high-tech manufacturing leader. What are the key bottlenecks? (10 Marks, 150 Words)',
                'word_limit' => 150,
                'marks' => 10,
                'published_date' => date('Y-m-d'),
                'model_answer' => "PLI aims to scale 14 manufacturing sectors...\nBottlenecks: Low R&D (0.7% GDP), raw material imports.",
                'synopsis' => 'Key dimensions: PLI objective, value-chain depth vs assembly, tech transfers.',
            ]
        ];
    }
}


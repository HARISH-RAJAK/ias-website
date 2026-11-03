<?php
/**
 * Quiz Model
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/Question.php';

class Quiz {
    private ?PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(): array {
        if (!$this->db) {
            return [$this->getFallbackQuiz()];
        }

        $stmt = $this->db->query("SELECT * FROM quizzes WHERE is_active = 1 ORDER BY id DESC");
        $quizzes = $stmt->fetchAll();
        return !empty($quizzes) ? $quizzes : [$this->getFallbackQuiz()];
    }

    public function getByIdWithQuestions(int $id): ?array {
        if (!$this->db) {
            return $this->getFallbackQuiz();
        }

        $stmt = $this->db->prepare("SELECT * FROM quizzes WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $quiz = $stmt->fetch();

        if (!$quiz) {
            return $this->getFallbackQuiz();
        }

        $qModel = new Question();
        $quiz['questions'] = $qModel->getByQuizId($id);

        return $quiz;
    }

    public function recordAttempt(array $data): int {
        if (!$this->db) return 1;

        $sql = "INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, correct_answers, completed_at, created_at)
                VALUES (:user_id, :quiz_id, :score, :total_questions, :correct_answers, NOW(), NOW())";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':user_id'         => $data['user_id'] ?? null,
            ':quiz_id'         => $data['quiz_id'],
            ':score'           => $data['score'],
            ':total_questions' => $data['total_questions'],
            ':correct_answers' => $data['correct_answers'],
        ]);

        return (int)$this->db->lastInsertId();
    }

    private function getFallbackQuiz(): array {
        $qModel = new Question();
        return [
            'id' => 1,
            'title' => "Daily UPSC Prelims Test: GS Paper I (Polity & Environment)",
            'duration_minutes' => 10,
            'total_marks' => 10,
            'questions' => $qModel->getByQuizId(1),
        ];
    }
}


<?php
/**
 * Quiz Controller
 * Manages daily prelims quizzes, questions, and attempt scoring
 */

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../models/Quiz.php';
require_once __DIR__ . '/../models/Question.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class QuizController {
    private Quiz $quizModel;

    public function __construct() {
        $this->quizModel = new Quiz();
    }

    public function index(): void {
        $quizzes = $this->quizModel->getAll();
        jsonResponse($quizzes, 200, 'Quizzes retrieved.');
    }

    public function show(int $id): void {
        $quiz = $this->quizModel->getByIdWithQuestions($id);
        if (!$quiz) {
            errorResponse('Quiz not found.', 404);
            return;
        }
        jsonResponse($quiz, 200, 'Quiz loaded.');
    }

    public function submit(int $id): void {
        $data = getRequestBody();
        $quiz = $this->quizModel->getByIdWithQuestions($id);

        if (!$quiz) {
            errorResponse('Quiz not found.', 404);
            return;
        }

        $userAnswers = $data['answers'] ?? [];
        $totalQuestions = count($quiz['questions'] ?? []);
        $correctCount = 0;
        $incorrectCount = 0;
        $unattemptedCount = 0;
        $totalScore = 0.0;

        foreach ($quiz['questions'] as $q) {
            $selected = $userAnswers[$q['id']] ?? null;
            if (!$selected) {
                $unattemptedCount++;
            } elseif (strtolower($selected) === strtolower($q['correct_option'])) {
                $correctCount++;
                $totalScore += (float)($q['marks'] ?? 2);
            } else {
                $incorrectCount++;
                $totalScore -= 0.66; // Standard 1/3 penalty in UPSC Prelims
            }
        }

        $finalScore = max(0.0, round($totalScore, 2));

        // Save attempt
        $attemptId = $this->quizModel->recordAttempt([
            'user_id'         => $data['user_id'] ?? null,
            'quiz_id'         => $id,
            'score'           => $finalScore,
            'total_questions' => $totalQuestions,
            'correct_answers' => $correctCount,
        ]);

        jsonResponse([
            'attempt_id'        => $attemptId,
            'final_score'       => $finalScore,
            'correct_count'     => $correctCount,
            'incorrect_count'   => $incorrectCount,
            'unattempted_count' => $unattemptedCount,
            'total_questions'   => $totalQuestions,
        ], 200, 'Quiz evaluated successfully.');
    }
}


<?php
/**
 * Question Model
 */

require_once __DIR__ . '/../config/database.php';

class Question {
    private ?PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getByQuizId(int $quizId): array {
        if (!$this->db) {
            return $this->getFallbackQuestions();
        }

        $stmt = $this->db->prepare("SELECT * FROM questions WHERE quiz_id = :quiz_id ORDER BY id ASC");
        $stmt->execute([':quiz_id' => $quizId]);
        $rows = $stmt->fetchAll();

        return !empty($rows) ? $rows : $this->getFallbackQuestions();
    }

    private function getFallbackQuestions(): array {
        return [
            [
                'id' => 101,
                'quiz_id' => 1,
                'question_text' => "With reference to the Governor's powers under Article 200 of the Indian Constitution, consider the following statements:\n1. The Governor can withhold assent to a Money Bill passed by the State Legislative Assembly.\n2. The Constitution does not prescribe a specific timeframe within which the Governor must declare assent.\n\nWhich of the statements given above is/are correct?",
                'option_a' => "1 only",
                'option_b' => "2 only",
                'option_c' => "Both 1 and 2",
                'option_d' => "Neither 1 nor 2",
                'correct_option' => "b",
                'explanation' => "Statement 1 is incorrect: The Governor can either give assent or reserve a Money Bill, but cannot withhold assent. Statement 2 is correct: Article 200 states 'as soon as possible' without a fixed timeframe.",
                'marks' => 2,
            ],
            [
                'id' => 102,
                'quiz_id' => 1,
                'question_text' => "Consider the following statements regarding the 'Kunming-Montreal Global Biodiversity Framework':\n1. It aims to protect at least 30% of the world's lands and oceans by 2030 (30x30 target).\n2. India is a signatory party to this framework under the Convention on Biological Diversity (CBD).\n\nWhich of the statements given above is/are correct?",
                'option_a' => "1 only",
                'option_b' => "2 only",
                'option_c' => "Both 1 and 2",
                'option_d' => "Neither 1 nor 2",
                'correct_option' => "c",
                'explanation' => "Both statements are correct. The Kunming-Montreal Global Biodiversity Framework was adopted at COP15 in 2022, establishing 23 global targets for 2030.",
                'marks' => 2,
            ],
            [
                'id' => 103,
                'quiz_id' => 1,
                'question_text' => "With reference to the Production Linked Incentive (PLI) Scheme in India, consider the following statements:\n1. It provides financial incentives on incremental sales of goods manufactured in domestic units.\n2. Semiconductor design and fabrication is one of the targeted focus areas under related incentive programs.\n\nWhich of the statements given above is/are correct?",
                'option_a' => "1 only",
                'option_b' => "2 only",
                'option_c' => "Both 1 and 2",
                'option_d' => "Neither 1 nor 2",
                'correct_option' => "c",
                'explanation' => "Both statements are correct. PLI schemes provide 4% to 6% incentives on incremental sales over a base year to scale domestic manufacturing capacity.",
                'marks' => 2,
            ]
        ];
    }
}


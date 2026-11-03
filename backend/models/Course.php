<?php
/**
 * Course Model
 */

require_once __DIR__ . '/../config/database.php';

class Course {
    private ?PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(): array {
        if (!$this->db) {
            return $this->getFallbackCourses();
        }

        $stmt = $this->db->query("SELECT * FROM courses WHERE is_published = 1 ORDER BY id ASC");
        $courses = $stmt->fetchAll();
        return !empty($courses) ? $courses : $this->getFallbackCourses();
    }

    public function getById(int $id): ?array {
        if (!$this->db) {
            $courses = $this->getFallbackCourses();
            foreach ($courses as $c) {
                if ($c['id'] === $id) return $c;
            }
            return null;
        }

        $stmt = $this->db->prepare("SELECT * FROM courses WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int {
        if (!$this->db) return 1;

        $sql = "INSERT INTO courses (title, subtitle, description, faculty, duration, level, price, created_at, updated_at)
                VALUES (:title, :subtitle, :description, :faculty, :duration, :level, :price, NOW(), NOW())";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':title'       => $data['title'],
            ':subtitle'    => $data['subtitle'] ?? '',
            ':description' => $data['description'] ?? '',
            ':faculty'     => $data['faculty'] ?? '',
            ':duration'    => $data['duration'] ?? '',
            ':level'       => $data['level'] ?? 'All Levels',
            ':price'       => $data['price'] ?? 'Free',
        ]);

        return (int)$this->db->lastInsertId();
    }

    private function getFallbackCourses(): array {
        return [
            [
                'id' => 1,
                'title' => "Sankalp Comprehensive GS Foundation 2026-27",
                'subtitle' => "Integrated Prelims-cum-Mains Guidance Program",
                'level' => "Beginner to Advanced",
                'duration' => "12 Months",
                'faculty' => "Ex-Civil Servants & Senior Domain Faculty",
                'price' => "₹ 48,000",
                'description' => "A complete syllabus coverage program designed for UPSC CSE aspirants targeting 2026 and 2027.",
            ],
            [
                'id' => 2,
                'title' => "Mains Answer Writing & Evaluation Mentorship",
                'subtitle' => "Transform Content into High-Scoring Mains Answers",
                'level' => "Mains Oriented",
                'duration' => "6 Months",
                'faculty' => "Sankalp Core Mains Evaluation Board",
                'price' => "₹ 18,500",
                'description' => "Focus on answer structuring, introduction hook frameworks, diagram insertion, case studies, and time-bound drafting.",
            ]
        ];
    }
}


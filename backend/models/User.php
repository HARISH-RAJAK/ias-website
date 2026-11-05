<?php
/**
 * User Model
 * Manages user authentication, registration, and credentials
 */

require_once __DIR__ . '/../config/database.php';

class User {
    private ?PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findByEmail(string $email): ?array {
        if (!$this->db) {
            // Offline fallback demo accounts
            if ($email === 'admin@sankalpias.in') {
                return [
                    'id' => 1,
                    'name' => 'Dr. Aditya Sharma (Faculty)',
                    'email' => 'admin@sankalpias.in',
                    'password' => password_hash('Admin@123', PASSWORD_BCRYPT),
                    'role' => 'admin',
                    'avatar' => null,
                ];
            }
            if ($email === 'aspirant@sankalpias.in') {
                return [
                    'id' => 2,
                    'name' => 'Priya Verma',
                    'email' => 'aspirant@sankalpias.in',
                    'password' => password_hash('Student@123', PASSWORD_BCRYPT),
                    'role' => 'student',
                    'avatar' => null,
                ];
            }
            return null;
        }

        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function findById(int $id): ?array {
        if (!$this->db) {
            if ($id === 1) {
                return [
                    'id' => 1,
                    'name' => 'Dr. Aditya Sharma (Faculty)',
                    'email' => 'admin@sankalpias.in',
                    'role' => 'admin',
                    'avatar' => null,
                ];
            }
            return [
                'id' => $id,
                'name' => 'UPSC Aspirant',
                'email' => 'aspirant@sankalpias.in',
                'role' => 'student',
                'avatar' => null,
            ];
        }

        $stmt = $this->db->prepare("SELECT id, name, email, role, avatar, created_at FROM users WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function create(array $data): int {
        if (!$this->db) {
            return rand(100, 999);
        }

        $avatar = $data['avatar'] ?? null;
        $sql = "INSERT INTO users (name, email, password, role, avatar, created_at, updated_at) 
                VALUES (:name, :email, :password, :role, :avatar, NOW(), NOW())";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':name'     => $data['name'],
            ':email'    => $data['email'],
            ':password' => password_hash($data['password'], PASSWORD_BCRYPT),
            ':role'     => $data['role'] ?? 'student',
            ':avatar'   => $avatar,
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function updateAvatar(int $id, string $avatar): bool {
        if (!$this->db) {
            return true;
        }

        $stmt = $this->db->prepare("UPDATE users SET avatar = :avatar, updated_at = NOW() WHERE id = :id");
        return $stmt->execute([
            ':avatar' => $avatar,
            ':id'     => $id,
        ]);
    }
}

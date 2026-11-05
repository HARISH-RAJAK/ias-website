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

        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch();
            return $user ?: null;
        } catch (Throwable $e) {
            error_log("findByEmail error: " . $e->getMessage());
            return null;
        }
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

        try {
            // Try selecting with avatar
            $stmt = $this->db->prepare("SELECT id, name, email, role, avatar, created_at FROM users WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $user = $stmt->fetch();
            return $user ?: null;
        } catch (Throwable $e) {
            // Fallback without avatar column if not present in schema
            try {
                $stmt = $this->db->prepare("SELECT id, name, email, role, created_at FROM users WHERE id = :id LIMIT 1");
                $stmt->execute([':id' => $id]);
                $user = $stmt->fetch();
                if ($user) {
                    $user['avatar'] = null;
                }
                return $user ?: null;
            } catch (Throwable $e2) {
                return null;
            }
        }
    }

    public function create(array $data): int {
        if (!$this->db) {
            return rand(100, 999);
        }

        $avatar = $data['avatar'] ?? null;
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
        $role = $data['role'] ?? 'student';

        // 1. Try insert with avatar column
        try {
            $sql = "INSERT INTO users (name, email, password, role, avatar, created_at, updated_at) 
                    VALUES (:name, :email, :password, :role, :avatar, NOW(), NOW())";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':name'     => $data['name'],
                ':email'    => $data['email'],
                ':password' => $hashedPassword,
                ':role'     => $role,
                ':avatar'   => $avatar,
            ]);
            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            // If avatar column is missing in users table (SQLSTATE 42S22 or 1054)
            if ($e->getCode() == '42S22' || str_contains($e->getMessage(), 'Unknown column') || str_contains($e->getMessage(), '1054')) {
                // Try adding column automatically
                try {
                    $this->db->exec("ALTER TABLE users ADD COLUMN avatar VARCHAR(500) NULL AFTER role");
                    $sql = "INSERT INTO users (name, email, password, role, avatar, created_at, updated_at) 
                            VALUES (:name, :email, :password, :role, :avatar, NOW(), NOW())";
                    $stmt = $this->db->prepare($sql);
                    $stmt->execute([
                        ':name'     => $data['name'],
                        ':email'    => $data['email'],
                        ':password' => $hashedPassword,
                        ':role'     => $role,
                        ':avatar'   => $avatar,
                    ]);
                    return (int)$this->db->lastInsertId();
                } catch (Throwable $alterEx) {
                    // Fallback: insert without avatar column
                    $sql = "INSERT INTO users (name, email, password, role, created_at, updated_at) 
                            VALUES (:name, :email, :password, :role, NOW(), NOW())";
                    $stmt = $this->db->prepare($sql);
                    $stmt->execute([
                        ':name'     => $data['name'],
                        ':email'    => $data['email'],
                        ':password' => $hashedPassword,
                        ':role'     => $role,
                    ]);
                    return (int)$this->db->lastInsertId();
                }
            }
            throw $e;
        }
    }

    public function updateAvatar(int $id, string $avatar): bool {
        if (!$this->db) {
            return true;
        }

        try {
            $stmt = $this->db->prepare("UPDATE users SET avatar = :avatar, updated_at = NOW() WHERE id = :id");
            return $stmt->execute([
                ':avatar' => $avatar,
                ':id'     => $id,
            ]);
        } catch (Throwable $e) {
            // If column does not exist, try creating it once
            try {
                $this->db->exec("ALTER TABLE users ADD COLUMN avatar VARCHAR(500) NULL AFTER role");
                $stmt = $this->db->prepare("UPDATE users SET avatar = :avatar, updated_at = NOW() WHERE id = :id");
                return $stmt->execute([
                    ':avatar' => $avatar,
                    ':id'     => $id,
                ]);
            } catch (Throwable $e2) {
                return false;
            }
        }
    }
}

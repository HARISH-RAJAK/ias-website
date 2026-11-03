<?php
/**
 * Database Configuration & PDO Connection Handler
 * Reads credentials securely from backend/.env
 */

class Database {
    private static ?PDO $instance = null;
    private static array $env = [];

    /**
     * Parse .env file if Dotenv library has not already loaded environment variables
     */
    private static function loadEnv(): void {
        if (!empty(self::$env)) {
            return;
        }

        $envFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';

        // Check if vlucas/phpdotenv is loaded
        if (class_exists('Dotenv\Dotenv') && file_exists($envFile)) {
            $dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
            $dotenv->safeLoad();
        }

        // Native fallback parser to guarantee zero failure if vendor/autoload.php is not yet built
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || str_starts_with($line, '#')) {
                    continue;
                }
                if (strpos($line, '=') !== false) {
                    [$key, $value] = explode('=', $line, 2);
                    $key = trim($key);
                    $value = trim($value, " \t\n\r\0\x0B\"'");
                    self::$env[$key] = $value;
                    if (!isset($_ENV[$key])) {
                        $_ENV[$key] = $value;
                    }
                }
            }
        }
    }

    /**
     * Get environment variable with fallback
     */
    public static function getEnv(string $key, $default = null) {
        self::loadEnv();
        return $_ENV[$key] ?? self::$env[$key] ?? getenv($key) ?: $default;
    }

    /**
     * Get Singleton PDO connection instance
     */
    public static function getConnection(): ?PDO {
        if (self::$instance === null) {
            self::loadEnv();

            $host = self::getEnv('DB_HOST', 'localhost');
            $dbName = self::getEnv('DB_NAME', 'upsc_portal');
            $user = self::getEnv('DB_USER', 'root');
            $pass = self::getEnv('DB_PASS', '');
            $charset = self::getEnv('DB_CHARSET', 'utf8mb4');

            $dsn = "mysql:host={$host};dbname={$dbName};charset={$charset}";

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                // Return null on failure and log securely without leaking credentials in output
                error_log("Database Connection Failed: " . $e->getMessage());
                return null;
            }
        }

        return self::$instance;
    }

    /**
     * Test if database connection is alive
     */
    public static function isConnected(): bool {
        return self::getConnection() !== null;
    }
}


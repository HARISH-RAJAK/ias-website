<?php
/**
 * Current Affairs Model
 */

require_once __DIR__ . '/../config/database.php';

class CurrentAffair {
    private ?PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(?string $category = null, ?string $date = null, ?string $search = null, int $limit = 20): array {
        if (!$this->db) {
            return $this->getFallbackArticles();
        }

        $sql = "SELECT ca.*, c.name as category_name 
                FROM current_affairs ca 
                LEFT JOIN categories c ON ca.category_id = c.id 
                WHERE 1=1";
        $params = [];

        if (!empty($category) && $category !== 'all') {
            $sql .= " AND (c.name LIKE :cat OR ca.category LIKE :cat2)";
            $params[':cat'] = "%{$category}%";
            $params[':cat2'] = "%{$category}%";
        }

        if (!empty($date)) {
            $sql .= " AND ca.published_date = :date";
            $params[':date'] = $date;
        }

        if (!empty($search)) {
            $sql .= " AND (ca.title LIKE :search OR ca.summary LIKE :search2 OR ca.content LIKE :search3)";
            $params[':search'] = "%{$search}%";
            $params[':search2'] = "%{$search}%";
            $params[':search3'] = "%{$search}%";
        }

        $sql .= " ORDER BY ca.published_date DESC, ca.id DESC LIMIT :limit";

        $stmt = $this->db->prepare($sql);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll();
        return $rows ?: $this->getFallbackArticles();
    }

    public function getById(int $id): ?array {
        if (!$this->db) {
            $fallbacks = $this->getFallbackArticles();
            foreach ($fallbacks as $item) {
                if ($item['id'] === $id) return $item;
            }
            return null;
        }

        $stmt = $this->db->prepare("SELECT ca.*, c.name as category_name FROM current_affairs ca LEFT JOIN categories c ON ca.category_id = c.id WHERE ca.id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int {
        if (!$this->db) return 1;

        $sql = "INSERT INTO current_affairs (category_id, category, title, summary, content, source, tags, published_date, created_at, updated_at)
                VALUES (:category_id, :category, :title, :summary, :content, :source, :tags, :published_date, NOW(), NOW())";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':category_id'     => $data['category_id'] ?? null,
            ':category'        => $data['category'] ?? 'General Studies',
            ':title'           => $data['title'],
            ':summary'         => $data['summary'],
            ':content'         => $data['content'],
            ':source'          => $data['source'] ?? 'The Hindu',
            ':tags'            => $data['tags'] ?? '',
            ':published_date'  => $data['published_date'] ?? date('Y-m-d'),
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        if (!$this->db) return true;

        $sql = "UPDATE current_affairs 
                SET title = :title, summary = :summary, content = :content, source = :source, tags = :tags, updated_at = NOW() 
                WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':title'   => $data['title'],
            ':summary' => $data['summary'],
            ':content' => $data['content'],
            ':source'  => $data['source'],
            ':tags'    => $data['tags'],
            ':id'      => $id,
        ]);
    }

    public function delete(int $id): bool {
        if (!$this->db) return true;
        $stmt = $this->db->prepare("DELETE FROM current_affairs WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    private function getFallbackArticles(): array {
        return [
            [
                'id' => 1,
                'title' => "India's Semiconductor Mission: Challenges and Strategic Opportunities",
                'category' => "GS Paper III – Economy & Tech",
                'summary' => "An analysis of the PLI schemes, geopolitical shifts in silicon supply chains, and domestic talent hurdles facing India's fab ecosystem.",
                'content' => "The India Semiconductor Mission (ISM) aims to establish a trusted electronics supply chain.\n\nKey Pointers:\n- Silicon Carbide and Gallium Nitride for EV inverters.\n- Micron's ATMP facility in Sanand, Gujarat.",
                'source' => "The Hindu & PIB",
                'tags' => "Economy, Science & Technology, GS-3",
                'published_date' => date('Y-m-d'),
            ],
            [
                'id' => 2,
                'title' => "Supreme Court Ruling on Federalism and Governor's Assent to Bills",
                'category' => "GS Paper II – Polity & Governance",
                'summary' => "Constitutional review of Article 200, federal friction between state governments and Raj Bhavans.",
                'content' => "The Supreme Court reiterated that Governors must act expeditiously upon legislative bills passed by State Assemblies.",
                'source' => "Indian Express",
                'tags' => "Polity, Constitution, Federalism, GS-2",
                'published_date' => date('Y-m-d'),
            ],
            [
                'id' => 3,
                'title' => "Kunming-Montreal Global Biodiversity Framework: India's Progress",
                'category' => "GS Paper III – Environment & Ecology",
                'summary' => "Evaluation of the 30x30 conservation targets, community forest rights, and biodiversity management committees.",
                'content' => "India has expanded Ramsar wetland sites and tiger corridors aligning with COP15 targets.",
                'source' => "Down to Earth",
                'tags' => "Environment, Ecology, Biodiversity, GS-3",
                'published_date' => date('Y-m-d', strtotime('-1 day')),
            ]
        ];
    }
}


-- =====================================================================
-- DATABASE SCHEMA: Sankalp IAS - UPSC Education Portal
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB / Hostinger
-- =====================================================================

-- Disable foreign key checks for clean re-creation
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `quiz_answers`;
DROP TABLE IF EXISTS `quiz_attempts`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `quizzes`;
DROP TABLE IF EXISTS `mains_submissions`;
DROP TABLE IF EXISTS `mains_questions`;
DROP TABLE IF EXISTS `current_affairs`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. USERS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(191) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('student', 'faculty', 'admin') NOT NULL DEFAULT 'student',
    `avatar` VARCHAR(500) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. CATEGORIES TABLE (GS Papers & Optional)
-- ---------------------------------------------------------------------
CREATE TABLE `categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(191) NOT NULL UNIQUE,
    `description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. CURRENT AFFAIRS & EDITORIALS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE `current_affairs` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT UNSIGNED NULL,
    `category` VARCHAR(100) NOT NULL DEFAULT 'General Studies',
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `summary` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `source` VARCHAR(150) DEFAULT 'The Hindu / PIB',
    `tags` VARCHAR(255) NULL,
    `published_date` DATE NOT NULL,
    `created_by` INT UNSIGNED NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_ca_published_date` (`published_date`),
    INDEX `idx_ca_category_id` (`category_id`),
    CONSTRAINT `fk_ca_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_ca_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. PRELIMS QUIZZES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE `quizzes` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `category_id` INT UNSIGNED NULL,
    `total_marks` DECIMAL(5,2) DEFAULT 10.00,
    `duration_minutes` INT UNSIGNED DEFAULT 10,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_quizzes_active` (`is_active`),
    CONSTRAINT `fk_quiz_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. PRELIMS QUESTIONS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE `questions` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `quiz_id` INT UNSIGNED NOT NULL,
    `question_text` TEXT NOT NULL,
    `option_a` TEXT NOT NULL,
    `option_b` TEXT NOT NULL,
    `option_c` TEXT NOT NULL,
    `option_d` TEXT NOT NULL,
    `correct_option` ENUM('a', 'b', 'c', 'd') NOT NULL,
    `explanation` TEXT NOT NULL,
    `marks` DECIMAL(4,2) DEFAULT 2.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_questions_quiz_id` (`quiz_id`),
    CONSTRAINT `fk_questions_quiz` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. QUIZ ATTEMPTS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE `quiz_attempts` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NULL,
    `quiz_id` INT UNSIGNED NOT NULL,
    `score` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `total_questions` INT UNSIGNED NOT NULL DEFAULT 0,
    `correct_answers` INT UNSIGNED NOT NULL DEFAULT 0,
    `time_taken_seconds` INT UNSIGNED DEFAULT 0,
    `completed_at` DATETIME NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_attempts_user_id` (`user_id`),
    INDEX `idx_attempts_quiz_id` (`quiz_id`),
    CONSTRAINT `fk_attempts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_attempts_quiz` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. QUIZ INDIVIDUAL ANSWERS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE `quiz_answers` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `attempt_id` INT UNSIGNED NOT NULL,
    `question_id` INT UNSIGNED NOT NULL,
    `selected_option` ENUM('a', 'b', 'c', 'd') NULL,
    `is_correct` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_answers_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_answers_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. MAINS QUESTIONS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE `mains_questions` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `paper` VARCHAR(50) NOT NULL DEFAULT 'GS Paper II',
    `topic` VARCHAR(150) NOT NULL,
    `question_text` TEXT NOT NULL,
    `word_limit` INT UNSIGNED DEFAULT 250,
    `marks` INT UNSIGNED DEFAULT 15,
    `published_date` DATE NOT NULL,
    `model_answer` LONGTEXT NULL,
    `synopsis` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_mains_date` (`published_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. MAINS SUBMISSIONS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE `mains_submissions` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NULL,
    `question_id` INT UNSIGNED NOT NULL,
    `answer_text` LONGTEXT NOT NULL,
    `word_count` INT UNSIGNED DEFAULT 0,
    `status` ENUM('submitted', 'reviewed', 'featured') DEFAULT 'submitted',
    `score` DECIMAL(4,2) NULL,
    `feedback` TEXT NULL,
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `reviewed_at` DATETIME NULL,
    INDEX `idx_submissions_user` (`user_id`),
    INDEX `idx_submissions_question` (`question_id`),
    CONSTRAINT `fk_sub_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_sub_question` FOREIGN KEY (`question_id`) REFERENCES `mains_questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. COURSES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE `courses` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `subtitle` VARCHAR(255) NULL,
    `description` TEXT NOT NULL,
    `faculty` VARCHAR(150) NULL,
    `duration` VARCHAR(50) NULL,
    `level` VARCHAR(50) DEFAULT 'All Levels',
    `price` VARCHAR(50) DEFAULT 'Free',
    `thumbnail` VARCHAR(255) NULL,
    `syllabus` TEXT NULL,
    `is_published` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- SEED SAMPLE DATA FOR IMMEDIATE TESTING & DEMO
-- =====================================================================

-- 1. Demo Users (Admin: Admin@123, Student: Student@123)
-- Password hashes generated via PHP password_hash(..., PASSWORD_BCRYPT)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Dr. Aditya Sharma (Faculty)', 'admin@sankalpias.in', '$2y$10$wE9hP3F8B3eKzL6b9pL3ue2Z6uM.n5gPfq1YtF8/5LqT8O4s8j5jK', 'admin'),
(2, 'Priya Verma', 'aspirant@sankalpias.in', '$2y$10$tZ2R8M8gL2fN1zK4wP9a0.8Q9j7dE5yH3bT7wN5rL8gK6pD2mX6qW', 'student');

-- 2. General Studies Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`) VALUES
(1, 'GS Paper I', 'gs-paper-1', 'Indian Heritage and Culture, History and Geography of the World and Society'),
(2, 'GS Paper II', 'gs-paper-2', 'Governance, Constitution, Polity, Social Justice and International Relations'),
(3, 'GS Paper III', 'gs-paper-3', 'Technology, Economic Development, Bio-diversity, Environment, Security & Disaster'),
(4, 'GS Paper IV', 'gs-paper-4', 'Ethics, Integrity and Aptitude');

-- 3. Current Affairs Articles
INSERT INTO `current_affairs` (`id`, `category_id`, `category`, `title`, `summary`, `content`, `source`, `tags`, `published_date`) VALUES
(1, 3, 'GS Paper III – Economy & Tech', 'India\'s Semiconductor Mission: Challenges and Strategic Opportunities', 'An analysis of the PLI schemes, geopolitical shifts in silicon supply chains, and domestic talent hurdles facing India\'s fab ecosystem.', 'The India Semiconductor Mission (ISM) aims to establish a trusted and resilient electronics supply chain. While capital incentives have attracted global memory and assembly players, wafer fabrication still faces infrastructure constraints like uninterrupted power and ultrapure water supplies.\n\nKey Prelims Pointers:\n- Silicon Carbide and Gallium Nitride applications in EVs.\n- Micron\'s ATMP facility in Sanand, Gujarat.\n\nMains Practice Dimension:\n"Examine the strategic importance of semiconductor self-reliance for India\'s digital sovereignty and economic resilience."', 'The Hindu & PIB', 'Economy, Science & Technology, GS-3', CURDATE()),
(2, 2, 'GS Paper II – Polity & Governance', 'Supreme Court Ruling on Federalism and Governor\'s Assent to Bills', 'Constitutional review of Article 200, federal friction between state governments and Raj Bhavans, and guidelines issued by the apex court.', 'The Supreme Court reiterated that Governors must act expeditiously upon legislative bills passed by State Assemblies. Discretion under Article 200 cannot be exercised to indefinitely withhold assent or stall democratic processes.\n\nConstitutional Provisions:\n- Article 200: Assent to Bills by Governor.\n- Article 201: Bills reserved for consideration of the President.\n- Sarkaria and Punchhi Commission recommendations on gubernatorial roles.', 'Indian Express', 'Polity, Constitution, Federalism, GS-2', CURDATE()),
(3, 3, 'GS Paper III – Environment & Ecology', 'Kunming-Montreal Global Biodiversity Framework: India\'s Progress', 'Evaluation of the 30x30 conservation targets, community forest rights, and biodiversity management committees across Indian states.', 'India has expanded its Ramsar wetland sites and tiger reserves, aligning with Target 3 of the Kunming-Montreal Global Biodiversity Framework. Focus is turning towards eco-sensitive zones and integrating indigenous communities into conservation.', 'Down to Earth', 'Environment, Ecology, Biodiversity, GS-3', DATE_SUB(CURDATE(), INTERVAL 1 DAY));

-- 4. Prelims Quiz & Questions
INSERT INTO `quizzes` (`id`, `title`, `description`, `category_id`, `total_marks`, `duration_minutes`, `is_active`) VALUES
(1, 'Daily UPSC Prelims Test: GS Paper I (Polity & Environment)', 'High-yield statement questions based on today\'s news and statutory bodies', 2, 10.00, 10, 1);

INSERT INTO `questions` (`id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`, `marks`) VALUES
(1, 1, 'With reference to the Governor\'s powers under Article 200 of the Indian Constitution, consider the following statements:\n1. The Governor can withhold assent to a Money Bill passed by the State Legislative Assembly.\n2. The Constitution does not prescribe a specific timeframe within which the Governor must declare assent.\n\nWhich of the statements given above is/are correct?', '1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2', 'b', 'Statement 1 is incorrect: The Governor cannot withhold assent to a Money Bill. Statement 2 is correct: Article 200 states "as soon as possible", with no fixed timeframe.', 2.00),
(2, 1, 'Consider the following statements regarding the "Kunming-Montreal Global Biodiversity Framework":\n1. It aims to protect at least 30% of the world\'s lands and oceans by 2030 (30x30 target).\n2. India is a signatory party to this framework under the Convention on Biological Diversity (CBD).\n\nWhich of the statements given above is/are correct?', '1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2', 'c', 'Both statements are correct. COP15 adopted 23 global targets for 2030, notably Target 3 (protect 30% of land and marine ecosystems).', 2.00),
(3, 1, 'With reference to the Production Linked Incentive (PLI) Scheme in India, consider the following statements:\n1. It provides financial incentives on incremental sales of goods manufactured in domestic units.\n2. Semiconductor design and fabrication is one of the targeted focus areas under related incentive programs.\n\nWhich of the statements given above is/are correct?', '1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2', 'c', 'Both statements are correct. PLI schemes provide 4% to 6% incentives on incremental sales over a base year.', 2.00);

-- 5. Mains Practice Questions
INSERT INTO `mains_questions` (`id`, `paper`, `topic`, `question_text`, `word_limit`, `marks`, `published_date`, `model_answer`, `synopsis`) VALUES
(1, 'GS Paper II', 'Constitution & Federalism', 'Analyze the constitutional tensions arising between elected State Cabinets and the office of the Governor. How can institutional safeguards preserve cooperative federalism in India? (15 Marks, 250 Words)', 250, 15, CURDATE(), 'The Governor occupies a dual capacity in India\'s constitutional setup. Friction points include Article 200 bill reservation delays. Sarkaria and Punchhi Commission recommendations emphasize appointment consultation and adherence to constitutional morality.', 'Dimensions: Constitutional text (Art 153, 163, 200), Sarkaria & Punchhi recommendations, SC precedents, and path toward cooperative federalism.'),
(2, 'GS Paper III', 'Economy & Industrial Policy', 'Examine whether production-linked incentives (PLI) can transform India from an assembly hub into an indigenous high-tech manufacturing leader. What are the key bottlenecks? (10 Marks, 150 Words)', 150, 10, CURDATE(), 'India\'s PLI schemes across 14 sectors aim to boost manufacturing competitiveness. Bottlenecks include low domestic R&D expenditure (0.7% GDP) and high dependence on imported components.', 'Structure: Objective of PLI -> Domestic value addition vs screw-driver assembly -> Critical bottlenecks -> Policy recommendations.');

-- 6. Courses
INSERT INTO `courses` (`id`, `title`, `subtitle`, `description`, `faculty`, `duration`, `level`, `price`, `is_published`) VALUES
(1, 'Sankalp Comprehensive GS Foundation 2026-27', 'Integrated Prelims-cum-Mains Guidance Program', 'A complete syllabus coverage program designed for UPSC CSE aspirants targeting 2026 and 2027. Covers GS Papers I to IV, Essay, Weekly Mock Tests, and Personal Mentorship.', 'Ex-Civil Servants & Senior Domain Faculty', '12 Months', 'Beginner to Advanced', '₹ 48,000', 1),
(2, 'Mains Answer Writing & Evaluation Mentorship', 'Transform Content into High-Scoring Mains Answers', 'Focus on answer structuring, introduction hook frameworks, diagram insertion, case studies, and time-bound drafting with 48-hour faculty turnaround.', 'Sankalp Core Mains Evaluation Board', '6 Months', 'Mains Oriented', '₹ 18,500', 1),
(3, 'Prelims High-Yield Test Series & CSAT Engine', 'Statement-Based Simulation & Elimination Techniques', 'Engineered to counter UPSC Prelims pattern shifts with multi-statement questions, negative marking optimization, and CSAT Paper II confidence booster.', 'Prelims Research Group', '4 Months', 'Prelims Intensive', '₹ 9,500', 1);


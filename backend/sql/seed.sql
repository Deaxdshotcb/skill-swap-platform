-- This command tells MySQL to use your database.
USE skill_swap;

-- Use TRUNCATE TABLE to completely reset the tables and their auto-increment counters.
-- We must disable foreign key checks temporarily to truncate in any order.
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `messages`;
TRUNCATE TABLE `blocked_users`;
TRUNCATE TABLE `reports`;
TRUNCATE TABLE `matches`;
TRUNCATE TABLE `skill_requests`;
TRUNCATE TABLE `skill_offers`;
TRUNCATE TABLE `skills`;
TRUNCATE TABLE `admins`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;


-- =================================================================
--          ADMIN DATA
-- =================================================================
-- Insert a test administrator. Password: 'admin123'
-- This will now reliably have an ID of 1.
INSERT INTO `admins` (`username`, `email`, `password`) VALUES
('admin_christy', 'admin@skillswap.com', '$2a$10$fQZ4.q8.B2Z5b5c9v8v/d.i/oA.u.uU5c6c.wW2g.gG7h.hH8i.i');


-- =================================================================
--          DUMMY USER & SKILL DATA
-- =================================================================
-- Insert sample users. Password for all is 'password123'.
-- These will now reliably have IDs 1, 2, 3, 4, 5.
INSERT INTO `users` (`username`, `email`, `password`, `bio`) VALUES
('alice_photo', 'alice@example.com', '$2a$10$f.TjL7YRNt2a/T8sC1C52..Cvq2s.Cg3i4hT9rT.rU8E6wE6tO8.K', 'Professional photographer from Kochi. Love to capture moments.'),
('bob_dev', 'bob@example.com', '$2a$10$f.TjL7YRNt2a/T8sC1C52..Cvq2s.Cg3i4hT9rT.rU8E6wE6tO8.K', 'Web developer by day, guitarist by night. Based in Thrissur.'),
('charlie_cooks', 'charlie@example.com', '$2a$10$f.TjL7YRNt2a/T8sC1C52..Cvq2s.Cg3i4hT9rT.rU8E6wE6tO8.K', 'Data scientist with a passion for cooking. I can teach you how to make amazing Kerala sadhya.'),
('diana_digital', 'diana@example.com', '$2a$10$f.TjL7YRNt2a/T8sC1C52..Cvq2s.Cg3i4hT9rT.rU8E6wE6tO8.K', 'Digital marketing expert. I can help you grow your online presence.'),
('evan_sql', 'evan@example.com', '$2a$10$f.TjL7YRNt2a/T8sC1C52..Cvq2s.Cg3i4hT9rT.rU8E6wE6tO8.K', 'Database administrator. SQL is my favorite language.');

-- Insert a master list of skills.
INSERT INTO `skills` (`id`, `name`) VALUES
(1, 'JavaScript'), (2, 'Python'), (3, 'Photography'), (4, 'Guitar'), (5, 'Cooking'),
(6, 'Data Analysis'), (7, 'React'), (8, 'Node.js'), (9, 'SQL'), (10, 'Digital Marketing');

-- Insert what skills each user can offer.
INSERT INTO `skill_offers` (`user_id`, `skill_id`, `experience_level`) VALUES
(1, 3, 'Expert'), (2, 4, 'Intermediate'), (2, 1, 'Advanced'), (3, 5, 'Advanced'),
(3, 6, 'Expert'), (4, 10, 'Expert'), (5, 9, 'Expert');

-- Insert what skills each user wants to learn.
INSERT INTO `skill_requests` (`user_id`, `skill_id`) VALUES
(1, 4), (2, 3), (3, 1), (4, 2), (1, 10);


-- =================================================================
--          DUMMY REPORT & BLOCK DATA
-- =================================================================
-- Insert a sample report for the admin to see.
INSERT INTO `reports` (`reporter_id`, `reported_id`, `reason`, `status`) VALUES
(4, 3, 'This user was matched with me but is not responding to any messages in the chat.', 'pending');

-- Insert a sample blocked user record.
-- This will now work because admin_id=1 and user_id=5 are guaranteed to exist.
INSERT INTO `blocked_users` (`user_id`, `admin_id`, `reason`) VALUES
(5, 1, 'This user was reported multiple times for spamming in the chat.');
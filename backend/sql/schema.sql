-- This query creates the database if it doesn't already exist.
CREATE DATABASE IF NOT EXISTS skill_swap;

-- This command tells MySQL to use this database for all the following commands.
USE skill_swap;

-- These DROP TABLE commands are for safety. If you run this file again,
-- it will delete the old tables before creating new ones to prevent errors.
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `blocked_users`;
DROP TABLE IF EXISTS `reports`;
DROP TABLE IF EXISTS `matches`;
DROP TABLE IF EXISTS `skill_requests`;
DROP TABLE IF EXISTS `skill_offers`;
DROP TABLE IF EXISTS `skills`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `users`;

-- 'users' table: Stores login and profile information for all regular users.
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `bio` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 'admins' table: Stores login info for platform administrators.
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL
);

-- 'skills' table: A master list of all skills available on the platform.
CREATE TABLE `skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE
);

-- 'skill_offers' table: Connects a user to a skill they are willing to teach.
CREATE TABLE `skill_offers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `skill_id` INT NOT NULL,
  `experience_level` ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE CASCADE,
  -- NEW: Prevents a user from offering the same skill twice
  UNIQUE KEY `unique_user_skill_offer` (`user_id`, `skill_id`)
);

-- 'skill_requests' table: Connects a user to a skill they want to learn.
CREATE TABLE `skill_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `skill_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE CASCADE,
  -- NEW: Prevents a user from requesting the same skill twice
  UNIQUE KEY `unique_user_skill_request` (`user_id`, `skill_id`)
);

-- 'matches' table: Stores a successful two-way match between two users.
CREATE TABLE `matches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user1_id` INT NOT NULL,
  `user2_id` INT NOT NULL,
  `user1_offer_id` INT NOT NULL,
  `user2_offer_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user1_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user2_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user1_offer_id`) REFERENCES `skill_offers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user2_offer_id`) REFERENCES `skill_offers`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_match_pair` (`user1_id`, `user2_id`)
);

-- 'reports' table: Logs user-submitted reports against other users.
CREATE TABLE `reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reporter_id` INT NOT NULL,
  `reported_id` INT NOT NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('pending', 'resolved', 'dismissed') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reported_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- 'blocked_users' table: A list of users who have been blocked by an admin.
CREATE TABLE `blocked_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `admin_id` INT NOT NULL,
  `reason` TEXT,
  `block_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `unblock_date` TIMESTAMP NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`)
);

-- 'messages' table: Stores every chat message sent between matched users.
CREATE TABLE `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `match_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
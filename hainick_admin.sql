-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2026 at 03:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hainick_admin`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `logo` varchar(255) NOT NULL,
  `instagram_account` varchar(255) NOT NULL,
  `gmail_account` varchar(255) NOT NULL,
  `phone_number1` varchar(50) NOT NULL,
  `phone_number2` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `creators`
--

CREATE TABLE `creators` (
  `id` int(11) NOT NULL,
  `profile_image` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `followers_ig` int(11) NOT NULL,
  `followers_tiktok` int(11) NOT NULL,
  `followers_x` int(11) NOT NULL,
  `roles` set('Actor','Host','MC','Content Creator','Model','Momfluencer','test') NOT NULL,
  `url_instagram` varchar(255) DEFAULT NULL,
  `url_tiktok` varchar(255) DEFAULT NULL,
  `url_x` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `creators`
--

INSERT INTO `creators` (`id`, `profile_image`, `name`, `followers_ig`, `followers_tiktok`, `followers_x`, `roles`, `url_instagram`, `url_tiktok`, `url_x`) VALUES
(2, '/uploads/1779281364289.jpeg', 'Christopher Justine Wijaya', 100, 100, 100, 'Content Creator', 'https://www.instagram.com/justine.wijaya/', 'https://www.tiktok.com/@justinewijaya?lang=en-GB', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`username`, `password`) VALUES
('admin', 'admin123');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `profile_image` varchar(255) NOT NULL,
  `testimonial` text NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `updates_section`
--

CREATE TABLE `updates_section` (
  `image_type` enum('update_image_left','update_image_center','update_image_right','update_image_bottom_left','update_image_bottom_right') NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `website_assets`
--

CREATE TABLE `website_assets` (
  `image_type` enum('hero_banner','talent_showcase') NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `website_assets`
--

INSERT INTO `website_assets` (`image_type`, `image_url`) VALUES
('hero_banner', '/uploads/1779125022897.jpg'),
('talent_showcase', '/uploads/1779280607233.mov');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `creators`
--
ALTER TABLE `creators`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `updates_section`
--
ALTER TABLE `updates_section`
  ADD PRIMARY KEY (`image_type`);

--
-- Indexes for table `website_assets`
--
ALTER TABLE `website_assets`
  ADD PRIMARY KEY (`image_type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `creators`
--
ALTER TABLE `creators`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

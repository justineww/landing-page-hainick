-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2026 at 05:27 PM
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
  `instagram` varchar(255) DEFAULT NULL,
  `gmail` varchar(255) DEFAULT NULL,
  `phone_number1` varchar(50) NOT NULL,
  `phone_number2` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`logo`, `instagram`, `gmail`, `phone_number1`, `phone_number2`) VALUES
('', '@hainickkreatif', 'hainick.creativemanagement@gmail.com', '+62 878-8791-0333 - Angga', '+62 821-363-58570 - Nikitaa');

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
(2, '/uploads/1779281364289.jpeg', 'Christopher Justine Wijaya', 100, 100, 100, 'Host,MC,Content Creator', 'https://www.instagram.com/justine.wijaya/', 'https://www.tiktok.com/@justinewijaya?lang=en-GB', NULL),
(3, '/uploads/1779283641769.jpg', 'Aditya Adit', 13500, 102304, 29319, 'Content Creator', 'https://www.instagram.com/justine.wijaya/', 'https://www.instagram.com/justine.wijaya/', 'https://www.tiktok.com/@justinewijaya?lang=en-GB'),
(4, '/uploads/1779292831323.webp', 'Don Dodondon', 305010, 3949294, 39203548, 'Actor,Host,MC,Content Creator,Model,Momfluencer', 'https://www.instagram.com/justine.wijaya/', 'https://www.tiktok.com/@justinewijaya?lang=en-GB', '');

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

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `profile_image`, `testimonial`, `name`) VALUES
(2, '/uploads/1779294640466.webp', 'QWD qwdQWDqdawe fawfafa fafafa fagfa gaeharthratharthre gaerg aerg aegaefg adfgargaergag erg', 'Halam'),
(3, '/uploads/1779294889781.webp', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', 'asegawe fawefaw ef'),
(4, '/uploads/1779294907128.webp', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', 'wd W'),
(5, '/uploads/1779294997443.webp', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', 'ergsrg'),
(6, '/uploads/1779295011360.webp', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', 'fwefwf');

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
('hero_banner', '/uploads/1779293205491.webp'),
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

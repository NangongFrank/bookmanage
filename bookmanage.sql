-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2019 at 06:36 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bookmanage`
--

-- --------------------------------------------------------

--
-- Table structure for table `author`
--

CREATE TABLE `author` (
  `id` int(11) NOT NULL,
  `authorName` varchar(16) NOT NULL,
  `authorAdage` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `author`
--

INSERT INTO `author` (`id`, `authorName`, `authorAdage`) VALUES
(1, '张风', '人为什么要活着，只因为有幸福的事'),
(2, '李愁', '爱恨情缘就如那苦涩的海风'),
(3, '王老五', '风中火烛随风而逝，潮起潮落，伴己一身'),
(4, '章三', '如影随形'),
(5, '鱼人二代', '鱼人二代，本名林晗，黑龙江人，中国网络作家富豪榜上榜作家'),
(6, '金庸', '金庸（1924年3月10日—2018年10月30日），原名查良镛，生于浙江省嘉兴市海宁市，1948年移居香港。当代武侠小说作家、新闻学家、企业家、政治评论家、社会活动家，“香港四大才子”之一。');

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE `book` (
  `id` int(11) NOT NULL,
  `bookName` varchar(50) NOT NULL,
  `bookTip` text NOT NULL,
  `file` varchar(100) NOT NULL,
  `cover` text NOT NULL,
  `authorId` int(11) NOT NULL,
  `payDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`id`, `bookName`, `bookTip`, `file`, `cover`, `authorId`, `payDate`) VALUES
(1, '人为什么要活着', '我就是要活着', 'files/ren.txt', '', 1, '2018-11-11'),
(2, '幸福的事情', '读书，看电影', 'files/ren.txt', '', 1, '2018-11-11'),
(3, '爱恨情缘', '终究一场梦，一场空', 'files/ren.txt', '', 2, '2018-11-11'),
(4, '苦涩的海风', '曾经沧海桑田', 'files/ren.txt', '', 2, '2018-11-11'),
(5, '风中火烛', '随风摇曳', 'files/ren.txt', '', 3, '2018-11-11'),
(6, '潮起潮落', '月有引力', 'files/ren.txt', '', 3, '2018-11-11'),
(7, '笑话贴身高手', '爽文', 'files/ren.txt', '', 1, '2018-11-11'),
(9, '很纯很暧昧', '杨明是一名普通的学生，某一天，他收到一份礼物，一只神奇的眼镜，从此生活变得丰富多彩。', 'files/ren.txt', '', 5, '2018-11-11'),
(10, '校花的贴身高手', '一个大山里走出来的绝世高手，一块能预知未来的神秘玉佩……', 'files/ren.txt', '', 5, '2018-11-11'),
(11, '极品修真强少', '为父正名，守护女神，一条不寻常的修仙路。', 'files/ren.txt', '', 5, '2018-11-11'),
(12, '总裁校花赖上我', '一段不为人知的事情，难以捉摸', 'files/ren.txt', '', 5, '2018-11-11'),
(13, '穿越时空', '一段不为人知的事情', 'files/ren.txt', '', 1, '2018-11-11'),
(14, '黑道公子', '爽文', 'files/ren.txt', '', 1, '2018-11-11'),
(15, '天龙八部', '主角，段誉，乔峰，虚竹', 'files/ren.txt', '', 6, '2018-11-11'),
(16, '射雕英雄传', '郭靖，黄蓉', 'files/ren.txt', '', 6, '2018-11-11'),
(17, '离愁', '人生', 'files/ren.txt', '', 1, '2019-04-02');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `bookName` varchar(50) NOT NULL,
  `createTime` date NOT NULL,
  `inventory` int(11) NOT NULL,
  `borrowed` int(11) NOT NULL,
  `bookId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `bookName`, `createTime`, `inventory`, `borrowed`, `bookId`) VALUES
(2, '幸福的事情', '2016-12-12', 5, 5, 2),
(3, '爱恨情缘', '2016-12-12', 6, 6, 3),
(4, '苦涩的海风', '2016-12-12', 7, 7, 4),
(5, '风中火烛', '2016-12-12', 8, 3, 5),
(6, '潮起潮落', '2016-12-12', 9, 4, 6),
(7, '人为什么要活着', '2018-12-04', 10, 1, 1),
(9, '黑道公子', '2018-12-04', 10, 0, 8),
(10, '很纯很暧昧', '2018-12-08', 10, 0, 9),
(11, '校花的贴身高手', '2018-12-08', 10, 0, 10),
(12, '极品修真强少', '2018-12-08', 10, 0, 11),
(13, '总裁校花赖上我', '2018-12-08', 0, 0, 12),
(14, '黑道公子', '2018-12-08', 10, 0, 14),
(15, '天龙八部', '2018-12-08', 10, 0, 15),
(16, '射雕英雄传', '2018-12-08', 10, 0, 16),
(17, '测试', '2019-04-02', 10, 1, 18);

-- --------------------------------------------------------

--
-- Table structure for table `borrowedinfo`
--

CREATE TABLE `borrowedinfo` (
  `id` int(11) NOT NULL,
  `borrowedUserName` varchar(50) NOT NULL,
  `bookName` varchar(50) NOT NULL,
  `borrowedDate` date NOT NULL,
  `returnDate` date DEFAULT NULL,
  `booksId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `borrowedinfo`
--

INSERT INTO `borrowedinfo` (`id`, `borrowedUserName`, `bookName`, `borrowedDate`, `returnDate`, `booksId`) VALUES
(2, 'zhang', '爱恨情缘', '2017-12-12', '2017-12-31', 3),
(3, 'zhang', '苦涩的海风', '2017-12-12', '2017-12-31', 4),
(4, 'zhang', '风中火烛', '2017-12-12', '2017-12-31', 5),
(5, 'zhang', '潮起潮落', '2017-12-12', '2017-12-31', 6),
(6, 'li', '幸福的事情', '2017-12-12', '2018-12-01', 2),
(7, 'li', '苦涩的海风', '2017-12-12', '2018-12-01', 4),
(8, 'li', '潮起潮落', '2017-12-12', '0000-00-00', 6),
(9, 'wang', '人为什么要活着', '2017-12-12', '0000-00-00', 1),
(10, 'wang', '风中火烛', '2017-12-12', '2017-12-31', 5),
(11, 'wang', '潮起潮落', '2017-12-12', '2017-12-31', 6),
(12, 'wang', '幸福的事情', '2017-12-12', '2017-12-31', 2),
(13, 'li', '风中火烛', '2018-11-20', '0000-00-00', 5);

-- --------------------------------------------------------

--
-- Table structure for table `userinfo`
--

CREATE TABLE `userinfo` (
  `id` int(11) NOT NULL,
  `userName` varchar(16) NOT NULL,
  `userAllName` varchar(24) DEFAULT NULL,
  `password` varchar(20) NOT NULL,
  `userTypeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `userinfo`
--

INSERT INTO `userinfo` (`id`, `userName`, `userAllName`, `password`, `userTypeId`) VALUES
(1, 'admin', '管理员', '1234', 2),
(2, 'zhang', '张三', '1234', 1),
(3, 'li', '李四', '1234', 1),
(4, 'wang', '王二', '1234', 1),
(5, 'zhao', '赵六', '1234', 1);

-- --------------------------------------------------------

--
-- Table structure for table `usertype`
--

CREATE TABLE `usertype` (
  `id` int(1) NOT NULL,
  `identity` varchar(10) NOT NULL,
  `tast` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `usertype`
--

INSERT INTO `usertype` (`id`, `identity`, `tast`) VALUES
(0, 'freeMan', '游客'),
(1, 'simpleUser', '普通用户'),
(2, 'manager', '管理员');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `author`
--
ALTER TABLE `author`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `borrowedinfo`
--
ALTER TABLE `borrowedinfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userinfo`
--
ALTER TABLE `userinfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usertype`
--
ALTER TABLE `usertype`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `author`
--
ALTER TABLE `author`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `book`
--
ALTER TABLE `book`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `borrowedinfo`
--
ALTER TABLE `borrowedinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `userinfo`
--
ALTER TABLE `userinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

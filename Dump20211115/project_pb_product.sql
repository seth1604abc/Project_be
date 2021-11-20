-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2021 年 11 月 20 日 10:29
-- 伺服器版本： 10.4.20-MariaDB
-- PHP 版本： 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫: `projectpb_be`
--

-- --------------------------------------------------------

--
-- 資料表結構 `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `title` varchar(45) NOT NULL,
  `upload_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  `average_rate` int(11) NOT NULL DEFAULT 0,
  `body_part_id` int(11) NOT NULL,
  `sold` int(11) NOT NULL,
  `remain` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `intro` varchar(200) NOT NULL,
  `detail` varchar(200) NOT NULL,
  `product_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `product`
--

INSERT INTO `product` (`id`, `title`, `upload_time`, `update_time`, `average_rate`, `body_part_id`, `sold`, `remain`, `price`, `intro`, `detail`, `product_type_id`) VALUES
(1, '20公斤啞鈴組', '2021-11-15 14:08:51', '2021-11-15 14:08:51', 3, 1, 11, 50, 1955, '你媽超棒', '很重', 3),
(2, '伏地挺身支架', '2021-11-17 13:56:37', '2021-11-17 13:56:37', 5, 1, 10, 15, 500, '伏地挺身支架', '小小的', 3),
(3, '槓片30KG', '2021-11-17 13:59:45', '2021-11-17 13:59:45', 4, 0, 150, 122, 800, '很重', '圓形的', 3),
(4, '魚油(120份)', '2021-11-17 14:02:14', '2021-11-17 14:02:14', 2, 0, 144, 180, 666, '魚油', '健康好吃', 1),
(5, '禮物卡', '2021-11-17 14:02:14', '2021-11-17 14:02:14', 1, 0, 180, 9999, 500, '30天會籍禮物卡', '10碼序號', 2),
(6, '肩膀熱敷袋', '2021-11-17 15:26:43', '2021-11-17 15:26:43', 4, 2, 1111, 22, 998, '', '', 3),
(7, '背部彈力帶', '2021-11-17 15:26:43', '2021-11-17 15:26:43', 3, 4, 45, 43, 7897, '', '', 3),
(8, '翹臀圈', '2021-11-17 15:26:43', '2021-11-17 15:26:43', 5, 5, 999, 999, 999, '這裡是介紹', '我是可愛的規格', 3);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

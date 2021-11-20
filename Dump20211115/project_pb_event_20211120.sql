-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2021-11-20 10:27:21
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
-- 資料庫: `project-pb`
--

-- --------------------------------------------------------

--
-- 資料表結構 `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `title` varchar(45) NOT NULL,
  `datetime` datetime NOT NULL,
  `deadline` datetime NOT NULL,
  `limit` int(11) NOT NULL,
  `location` varchar(45) NOT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `image` varchar(45) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `event`
--

INSERT INTO `event` (`id`, `title`, `datetime`, `deadline`, `limit`, `location`, `content`, `image`, `user_id`) VALUES
(1, '科學增肌減脂-Dr.史考特來解惑', '2021-11-19 21:58:25', '2021-11-19 21:58:25', 25, '台北市大安區羅斯福路二段33號12樓', 'Dr.史考特認為「肥胖是一種內分泌失調」，也就是飲食選擇失當導致胰島素過度分泌，而使身體累積脂肪的胰島素假說。但隨著數篇最新研究出爐，目光逐漸從胰島素身上移開。\r\n過去寫作中引用的研究仍有參考價值，但隨著科學巨輪的推動，Dr.史考特對它們有了更新的解讀。\r\n　　閱讀最新科學研究，並將其轉化為容易吸收的文字與影音，是「一分鐘健身教室」從第一天就在做的事情。科學改善了人類生活的所有面向，飲食運動也不該例外。\r\n　　健身不只是強健身體，健身更要強健大腦。', 'w644.jpg', 0),
(2, '打破健身舊觀念 運動營養新觀點一次搞懂', '2021-11-20 22:00:26', '2021-11-19 22:00:26', 30, '台北市中山區松江路131號7樓之1', '', 'w644.jpg', 0),
(3, '營養師的獨家外食指南', '2021-11-21 14:00:26', '2021-11-19 23:59:26', 20, '台北市中正區齊東街57號1樓', '', 'w644.jpg', 0);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

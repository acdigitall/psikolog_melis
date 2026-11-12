-- Psikolog sitesi veritabanı şeması (MySQL / MariaDB).
-- Boş bir veritabanına phpMyAdmin > İçe Aktar ile yüklenir. Var olan tablolara dokunmaz.
-- Appointment, SmsSettings ve SmsLog tablolarını panel ilk açılışta kendisi de oluşturur.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `AboutPage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `metaTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDesc` text COLLATE utf8mb4_unicode_ci,
  `metaKeys` text COLLATE utf8mb4_unicode_ci,
  `storyImg` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storyTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storyDesc1` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `storyDesc2` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `visionTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visionText` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `missionTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `missionText` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `bridgeLabel` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bridgeTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bridgeDesc1` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `bridgeDesc2` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `bridgeImg` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brochureLabel` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brochureTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brochureDesc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `brochureUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brochureHighlights` json NOT NULL,
  `materialsTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `materials` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `policyTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `policies` json NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Appointment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clientName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startAt` datetime(3) NOT NULL,
  `endAt` datetime(3) NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Planlandı',
  `smsEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `smsStatus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Bekliyor',
  `smsAttempts` int NOT NULL DEFAULT '0',
  `smsSentAt` datetime(3) DEFAULT NULL,
  `smsError` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Appointment_startAt_idx` (`startAt`),
  KEY `Appointment_smsStatus_endAt_idx` (`smsStatus`,`endAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `BlogPost` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `excerpt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Yayında',
  `views` int NOT NULL DEFAULT '0',
  `metaTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDesc` text COLLATE utf8mb4_unicode_ci,
  `metaKeys` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `BlogPost_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ContactSettings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone1` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone2` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phones` json DEFAULT NULL,
  `emails` json DEFAULT NULL,
  `socialLinks` json NOT NULL,
  `mapIframe` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` text COLLATE utf8mb4_unicode_ci,
  `logoFooter` text COLLATE utf8mb4_unicode_ci,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `GalleryItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metaTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDesc` text COLLATE utf8mb4_unicode_ci,
  `metaKeys` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `img` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `HomePage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `metaTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDesc` text COLLATE utf8mb4_unicode_ci,
  `metaKeys` text COLLATE utf8mb4_unicode_ci,
  `servicesTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `whyUsTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `whyUsItems` json NOT NULL,
  `whyUsImg` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectsTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectsDesc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ctaTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ctaDesc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ctaBtn1Text` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ctaBtn1Link` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ctaBtn2Text` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ctaBtn2Link` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `PageHeader` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pageIdentifier` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PageHeader_pageIdentifier_key` (`pageIdentifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ProductionInfo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metaTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDesc` text COLLATE utf8mb4_unicode_ci,
  `metaKeys` text COLLATE utf8mb4_unicode_ci,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ProductionStep` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Quote` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Yeni',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `longDesc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `features` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `steps` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metaTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDesc` text COLLATE utf8mb4_unicode_ci,
  `metaKeys` text COLLATE utf8mb4_unicode_ci,
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Service_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Slide` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `bg` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `metaTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDesc` text COLLATE utf8mb4_unicode_ci,
  `metaKeys` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `SmsLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointmentId` int DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `success` tinyint(1) NOT NULL DEFAULT '0',
  `response` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `SmsLog_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `SmsSettings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `usercode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `passwordEnc` text COLLATE utf8mb4_unicode_ci,
  `msgheader` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `delayMinutes` int NOT NULL DEFAULT '90',
  `template` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

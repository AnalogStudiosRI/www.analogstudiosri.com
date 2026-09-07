CREATE DATABASE  IF NOT EXISTS `analogstudios` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `analogstudios`;
-- MySQL dump 10.13  Distrib 8.0.32, for macos13 (x86_64)
--
-- Host: aws.connect.psdb.cloud    Database: analogstudios
-- ------------------------------------------------------
-- Server version	8.0.23-PlanetScale

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'cdd44992-8a3b-11ee-8a63-3e6c2237f560:1-39,
ce67fc17-8a3b-11ee-a411-92162f386a9d:1-204';

--
-- Table structure for table `albums`
--

DROP TABLE IF EXISTS `albums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `albums` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `year` int DEFAULT NULL,
  `imageUrl` longtext,
  `downloadUrl` longtext,
  `artistId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `id_idx` (`artistId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `albums`
--

LOCK TABLES `albums` WRITE;
/*!40000 ALTER TABLE `albums` DISABLE KEYS */;
INSERT INTO `albums` VALUES (1,'Debut CD Release Party (live)','<p>The songs were played live at the CD Release party for Analog&#39;s debut album, <em>When the Media Talk About The Media</em>&nbsp;at Captain Nick&#39;s on Block Island. These are songs from both the debut album and Dave Flamand&#39;s previous release, <em>Lost Time</em>.</p>',2008,'http://d34k5cjnk2rcze.cloudfront.net/albums/analog/analog-debut/analog-debut.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/analog/analog-debut/analog-debut.zip',1),(2,'Lost Time','<p>The lead singer of Analog, Dave Flamand is from Rhode Island and we are pleased to offer you exclusive downloads of his demo from this site. These songs provided the framework leading up to the creation of Analog, and as such you may recognize most of the songs from <em>When The Media Talks About The Media</em>&nbsp;from these demos. &nbsp;<em>Lost Time</em>&nbsp;was released early 2008 and <em>Spare Time</em>&nbsp;followed shortly thereafter. &nbsp;<em>Lost Time</em>&nbsp;is Dave&#39;s acoustic debut, showcasing his talent as songwriter and versatile musician. The are all of his own original recordings made on Block Island and recorded by himself. Dave not only wrote all the songs, but also played all the instruments himself.</p>',2008,'http://d34k5cjnk2rcze.cloudfront.net/albums/dave-flamand/lost-time/lost-time.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/dave-flamand/lost-time/lost-time.zip',6),(3,'Spare Time','<p>The seven songs that make up <em>Spare Time</em>&nbsp;are sort of like the companion to <em>Lost Time</em>&nbsp;A nice selection of acoustic <em>b-sides</em>, two of these songs make up the remaing tracks off the debut album by Analog, <em>When The Media Talks About The Media</em>.&nbsp;This is an exclusive download available from this website, you can&#39;t get these songs anywhere else.</p>',2008,'http://d34k5cjnk2rcze.cloudfront.net/albums/dave-flamand/spare-time/spare-time.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/dave-flamand/spare-time/spare-time.zip',6),(4,'Garage Demo','These recordings were done over two sessions form 2008 to 2009 in the Smith\'s garage up in New Hampshire.  They are all live takes from the Garage and feature the original lineup of Zack Smith, Nat MacDonald, and Matt Madison.  I recorded the sessions with different equipment so the quality may vary at times.',2008,'http://d34k5cjnk2rcze.cloudfront.net/albums/electro-calrissian/garage-demo/garage-demo.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/electro-calrissian/garage-demo/garage-demo.zip',2),(5,'RPM Recordings','<p>This recording was done in my apartment up in New Hampshire over a two day period. Rory and I intended this for the 2009 RPM Challenge but in the end is just became a cool, live, impromptu reocrding of Rory at his creative and spontaneous self. I apologize for the lack of title, for the next one I&#39;ll make sure Rory titles his songs, heh. Anyway, we recorded all these songs live, maybe with a couple of takes, and cut the results. Hope you enjoy them.</p>',2009,'http://d34k5cjnk2rcze.cloudfront.net/albums/rory-boyan/rpm-recording-challenge/rpm-recording-challenge.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/rory-boyan/rpm-recording-challenge/rpm-recording-challenge.zip',3),(6,'Music Mansion Series vol2','This recording came from a charity performance Laurent performed in March of 2010.  The performance consisted of 10 classical selections and was accompanied with a brief discussion of each group of pieces as the evening went on.  (although they are not included here).  It was a very nice evening that I was fortunate to be a part of.',2010,'http://d34k5cjnk2rcze.cloudfront.net/albums/laurent-bonetto/music-mansion-series-vol2/music-mansion-series-vol2.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/laurent-bonetto/music-mansion-series-vol2/music-mansion-series-vol2.zip',4),(7,'BI Music Fest : Porch Gigs','This is a compilation album of all the various artists who performed on the porch of Captain Nick\'s on June 11th, 2010 as part of Block Island Music Fest.  The recorded artists were Colby Lasorsa, Glenn Roth, Troubaduo, and Analog.  Hope ya dig.',2010,'http://d34k5cjnk2rcze.cloudfront.net/albums/various-artists/block-island-musicfest-2010/block-island-musicfest-2010.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/various-artists/block-island-musicfest-2010/block-island-musicfest-2010.zip',9),(8,'Brian Lessard Benefit','A night dedicated to Brian Lessard, Audio Kickstand brought out the good vibes to help a great member of the community during a time of need.  One of my first recordings, this was done using all the original gear I hadl pre-digital.  Not too shabby if I do say so myself.  Enjoy some of Audio Kickstands originals, one of the first bands I ever recorded back when I was starting out.',2008,'http://d34k5cjnk2rcze.cloudfront.net/albums/audio-kickstand/brian-lessard-benefit/brian-lessard-benefit.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/audio-kickstand/brian-lessard-benefit/brian-lessard-benefit.zip',7),(9,'Easy','Recorded in the spring of 2005, this basement demo captures a great performance from Jay St.; raw and loose.  With Dave starting to show great command over his song writing chops, he is backed up by his roommates Owen and Neal for a five song demo of things to come.',2005,'http://d34k5cjnk2rcze.cloudfront.net/albums/jay-st/easy/easy.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/jay-st/easy/easy.zip',8),(10,'Live - From The Basement (set 1)','Check out a group of live recordings of Jay St. and Friends jamming in the basement playing some of the crowd favorites.  If you ever came by the house, maybe you\'ll hear your name in the background.  (sorry about the beginning of In My Place, but Neals drumming more than makes up for it)',2005,'http://d34k5cjnk2rcze.cloudfront.net/albums/jay-st/from-the-basement-live-pt1/from-the-basement-live-pt1.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/jay-st/from-the-basement-live-pt1/from-the-basement-live-pt1.zip',8),(11,'Live - From The Basement (set 2)','Check out a group of live recordings of Jay St. and Friends jamming in the basement playing some of the crowd favorites.  If you ever came by the house, maybe you\'ll hear your name in the background.',2005,'http://d34k5cjnk2rcze.cloudfront.net/albums/jay-st/from-the-basement-live-pt2/from-the-basement-live-pt2.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/jay-st/from-the-basement-live-pt2/from-the-basement-live-pt2.zip',8),(12,'Music Mansion Series vol3','In June of 2013, Laurant Bonetto performed his final show at the Music Mansion.  The performance consisted of a number of classical selections from the works of Chopin and was accompanied with a brief discussion of each group of pieces as the show went on.',2013,'http://d34k5cjnk2rcze.cloudfront.net/albums/laurent-bonetto/music-mansion-series-vol3/music-mansion-series-vol3.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/laurent-bonetto/music-mansion-series-vol3/music-mansion-series-vol3.zip',4),(13,'Music Mansion Series vol1','The first in a great series of compelling concerts to come from the partnership of Laurent Bonetto and the Alliance Francaise, we are proud to present Vol. 1 in the Laurent Bonetto Music Mansion Series - Concert \"Suite Francaise\" -- Scaramouche and Company.  Tracks 4 - 9 are 4-hand pieces performed by Laurent Bonetto and Jacqueline Devillers.',2008,'http://d34k5cjnk2rcze.cloudfront.net/albums/laurent-bonetto/music-mansion-series-vol1/music-mansion-series-vol1.jpg','http://d34k5cjnk2rcze.cloudfront.net/albums/laurent-bonetto/music-mansion-series-vol1/music-mansion-series-vol1.zip',4),(14,'Spiritual Warfare','<p>After years of dabbling in producing Ryan Miller of Metal Wings&nbsp;finally committed to making a solo album when he&nbsp;decided to make &quot;Spiritual Warfare&quot;. &nbsp; The&nbsp;idea was to make a Hip Hop album based on the Bhagavad Gita that he had been working on and then&nbsp;one week in August, free time found Ryan Miller and he&nbsp;spent that time&nbsp;entirely making beats and writing verses. &nbsp;It was produced and mixed down at Analog Studios and released on iTunes in 2014.</p>\n',2014,'http://d34k5cjnk2rcze.cloudfront.net/albums/metal-wings/spiritual-warfare/spiritual-warfare.jpg','',10);
/*!40000 ALTER TABLE `albums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `artists`
--

DROP TABLE IF EXISTS `artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `imageUrl` longtext,
  `genre` varchar(45) DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  `label` varchar(45) DEFAULT NULL,
  `contactPhone` int DEFAULT NULL,
  `contactEmail` varchar(100) DEFAULT NULL,
  `bio` longtext NOT NULL,
  `isActive` int DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artists`
--

LOCK TABLES `artists` WRITE;
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
INSERT INTO `artists` VALUES (1,'Analog','http://d34k5cjnk2rcze.cloudfront.net/images/artists/analog.jpg','Rock and Roll','Block Island. RI','Analog Studios',NULL,'dave@analogstudios.net','<p>Analog, a power duo consisting of guitar and drums, formed and has performed on Block Island for over 2 years. &nbsp;Dave Flamand (vocals and guitar) and Eli Sprague (drums) deliver an original, powerful rock sound showcasing Flamand&rsquo;s songwriting. &nbsp;Strong rock beats, smooth vocals, and loud guitar tone meld together to create Analog&rsquo;s unique sound. &nbsp;The band currently has begun recording for its new album where it considers home base; Analog Studios in Newport, RI.</p>\n',1),(2,'Electro Calrissian','http://d34k5cjnk2rcze.cloudfront.net/images/artists/electro-calrissian.jpg','Punk Rock','North Conway, NH','Analog Studios',NULL,'electrocalrissian@gmail.com','A hard rock band from Conway, NH, Electro Calrissian knows how to crank out the tunes. Once a solid three piece, these days the lineup features songwriter Zack Smith on guitars, bass, and vocals and Nat MacDonald also playing guitar, bass, and singing.  Aside from their usual gigs, Zack can often be found playing down at Open Mic on Mondays at the Red Parka Pub or Matty Bs Pizza. Check out their MySpace page for more up to date info, music, and news, maintained by their good friend and manager, Aldon Miller.',1),(3,'Rory Boyan','http://d34k5cjnk2rcze.cloudfront.net/images/artists/rory.jpg','Jam/Instrumental','Lowell, MA','Analog Studios',NULL,'roryboyan@yahoo.com','One of my best friends, Rory plays instrumental music in a genre all to his own. Combining elements of blues, reggae, and percussion into his guitar playing, Rory manages to create something unique to him, and him alone. If you like chilled out and inspiring music, then you found your man.',1),(4,'Laurent Bonetto','http://d34k5cjnk2rcze.cloudfront.net/images/artists/laurent-bonetto.jpg','Classical','Providence. RI','Analog Studios',0,'lbonetto-at-yahoo.com','<p>While pursuing a scientific career, Laurent has always kept playing the piano as one of the main occupations of his life; a passion he has had since the age of 5. Since the age of 15, he has practiced with concert pianist Nathalie Bera-Tagrine, with whom he studies when he returns to France. Laurent has taken numerous masters classes in Europe and the US, participated in many concerts, and competitions, and has recorded two piano CDs.</p>\n',1),(5,'The Silks','http://d34k5cjnk2rcze.cloudfront.net/images/artists/the-silks.jpg','Blues/Rock','Providence, RI',NULL,NULL,'T.J.@email.com','The Silks are cool jazz rock band originating out of the Providence area.',0),(6,'Dave Flamand','http://d34k5cjnk2rcze.cloudfront.net/images/artists/dave-flamand.jpg','Acoustic/Rock','Block Island, RI','Analog Studios',NULL,'dave@analogstudios.net','<p>Dave Flamand, a talented songwriter and lead singer for Analog, has performed on Block Island, RI and Newport, RI for a few years. &nbsp;Original acoustic rock paired with powerful vocals best describes his tailored sound. &nbsp;Dave accompanies himself with either an acoustic guitar or the piano when he sings his dynamic original songs. &nbsp; Dave also has a craft of selecting and performing cover songs that define and truly envelope his own style. &nbsp;New music releases from Dave Flamand can be expected soon. &nbsp;He is currently enjoying the lovely comforts of Analog Studios recording studio in Newport, RI.</p>',1),(7,'Audio Kickstand','http://d34k5cjnk2rcze.cloudfront.net/images/artists/audio-kickstand.jpg','Jam/Rock','Glen, NH',NULL,NULL,NULL,'A great rock and jam band from Glen, NH, Audio Kickstand really knows how to get you out of your seat and dancing! This band is a prominent fixture down at the Red Parka Pub and you can almost always hear them playing Monday nights there for Open Mic. You can visit their myspace page for more news and info.',1),(8,'Jay St','http://d34k5cjnk2rcze.cloudfront.net/images/artists/jay-st.jpg','Rock and Roll','Fitchburg, MA','Analog Studios',NULL,NULL,'Hailing from the basement of the coolest house on the craziest cobblestone hill,  in Fitchburg, MA, Jay St. was the party band of the Fitchburg scene during the years of 2003-2005.  While actively playing out at Hoolingans bar, they were also well known for throwing some of the best parties.  (Even during the winter!)  Even though they are no more, their infamy lives on thanks to their recordings being unearthed and posted for all to enjoy.  So, if the dude abides, then so do we.  Oh yeah, mind if I do a J?',1),(9,'Various Artists','http://d34k5cjnk2rcze.cloudfront.net/images/artists/various-artists.jpg','Rock and Roll',NULL,'Analog Studios',NULL,NULL,'This is a compilation profile for various recordings and musical compilations',1),(10,'Metal Wings','http://d34k5cjnk2rcze.cloudfront.net/images/artists/metal-wings.png','Hip Hop','Boston, MA','',0,'steezsp@yahoo.com','<p>Metal Wings is Ryan Mialler,&nbsp;a Hip Hop producer,&nbsp;MC,&nbsp;and Yoga teacher. &nbsp;He&nbsp;wrote &quot;Another Fall Harvest&quot;&nbsp;in a single week in August 2012. After years of dabbling in producing he&nbsp;finally committed to making a solo album when I decided to make &quot;Spiritual Warfare&quot;&nbsp;and had&nbsp;it produced down at Analog Studios.&nbsp; Ryan is one of our good friends so please check out all his work on iTunes.</p>\n',1),(11,'FAVE','//d34k5cjnk2rcze.cloudfront.net/images/artists/fave-band.png','Rock and Roll','Newport, RI','Analog Studios',NULL,'davef.analog@gmail.com','FAVE is a three piece band featuring Dave Flamand on piano, Bill Bartholomew on drums, and Mason Dubois on bass. The group has a cinematic and orchestral sound that ushers listeners along on a soundscape journey. Their new album \"Nowadays\" was released on 6/20/2021. Check out their singles \"Nowadays\" and \"Zodiac\" where ever you get your music.',1);
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `summary` longtext NOT NULL,
  `createdTime` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'Dave Flamand @ The Newport Newport CYCFM','<p>Details available at the events <a href=\"http://www.analogstudios.net/events/7\">page</a></p>\n',1462924501),(2,'Dave Flamand @ Gather','<p>Come join Dave Flamand at Gather in Newport, this Saturday (the 27th) at 8pm! &nbsp;For more info please see our events <a href=\"http://www.analogstudios.net/events/8\">page</a></p>\n',1471959311),(3,'Silent No More Charity 5K','<p><img src=\"https://www.grouprev.com/system/Project/banners/000/007/776/banner/RegistrationBanner.jpg\"/><br/></p><p>Saturday Sept. 18th at 10am, Analog Studios will Â be leading a team in a 5K walk to help fight Ovarian cancer. Â Please join us or contribute and hope to see you down there!</p><p><a href=\"https://www.grouprev.com/meanjeansfightingmachine\" target=\"\">https://www.grouprev.com/meanjeansfightingmachine</a><br/></p>',1471989627),(4,'Septemberfest 2016!','<p>Septemberfest 2016 is almost here! &nbsp;Join us for two nights on Block Island for art, music, and films!</p>\n\n<p><img alt=\"Septemberfest 2016\" src=\"http://d34k5cjnk2rcze.cloudfront.net/images/events/septemberfest/septemberfest-2016-promo001.png\" style=\"height:800px; width:800px\" /></p>\n',1472091258),(5,'Acoustic Potluck Night','<p>Acoustic Potluck Night at the Newport Community Yoga Center @ 6pm. &nbsp;Check out the <a href=\"http://www.analogstudios.net/events/13\">event</a>&nbsp;page for more details.</p>\n\n<p>&nbsp;</p>\n',1476493496),(7,'Analog @ Jimmy\'s Saloon','Analog will be playing WhaleFest in Providence this Saturday the 14th. &nbsp;Check out the <a href=\"http://www.analogstudios.net/events/14\">events</a> page for more info.</p>\n',1484180854),(8,'Dave Flamand @ Gather','<p>Analog is playing Saturday January 27th at Jimmy&#39;s Saloon in Newport. &nbsp;Check out the <a href=\"https://www.analogstudios.net/events/15\">events</a> page for more info. &nbsp;Hope to see you there!</p>',1484623100),(9,'\"Hollow Tomorrow\" Music Video','<p>Courtesy of our friend and photographer Morgan Macia, comes a music video from the basement for the song &quot;<a href=\"https://www.youtube.com/watch?v=KrMdUzbrOm0\">Hollow Tomorrow</a>&quot;</p>\n\n<p>&nbsp;</p>\n',1486907247),(10,'Tuesday\'s Tunes - The Return!','<p>Tuesday\'s Tunes returns after a long hiatus and we are very excited to be back!  Tune-in <a href=\"https://www.facebook.com/dave.flamand.1426\" target=\"_blank\" rel=\"noopener noreferrer\">every other Tuesday night @ 8pm on Facebook Live</a> to see what we\'re up to next!</p>',1634675520);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-30 19:58:24

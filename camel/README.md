# Camel

KrakenJs 기반의 Web application

## Introduction
최초 Krakenjs with passport 예제를 기반으로 샘플을 만들었다. 
내용은 추후 계속 추가할 예정이다.

This example highlights the following things:

* KrakenJs 기반
* 인증모듈 Passport 사용

## Prerequisites
* MariaDB 또는 MySql 을 설치한다er
```
#!sql
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(16) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) NOT NULL DEFAULT '',
  `user_name` varchar(16) NOT NULL DEFAULT '',
  `phone` varchar(14) DEFAULT NULL,
  `email` varchar(32) NOT NULL DEFAULT '',
  `password` varchar(64) NOT NULL DEFAULT '',
  `action_key` varchar(16) DEFAULT NULL,
  `status` varchar(8) NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT IGNORE INTO `users` (`id`, `user_id`, `user_name`, `password`, `status`)
VALUES
	(0, 'all', '전체사용자', '', 'user'),
	(1, 'user1', 'tester', '1111', 'user'),
	(2, 'admin', 'admin', '1111', 'administrator'),
	(3, 'designer', 'designer1', '1111', 'designer'),
	(4, 'manager', 'manager1', '1111', 'manager');

CREATE TABLE IF NOT EXISTS `users_apikey` (
  `user_id` bigint(20) unsigned NOT NULL,
  `api_key` varchar(16) NOT NULL DEFAULT '',
  `secret_key` varchar(64) NOT NULL DEFAULT '',
  KEY `user_id_fk` (`user_id`),
  CONSTRAINT `user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT IGNORE INTO `users_apikey` (`user_id`, `api_key`, `secret_key`)
VALUES
    (1,'y5Hl081NfDcSJqxw','eCuylJbg4dOtvxQGxKmRVkOIBlOOsvAA'),
    (2,'y5Hl081NfDcSJqdd','eCuylJbg4dOtvxQGxKmRVkOIBlOOsvA1a'),
    (3,'YfTdtiprBuUERw9U','AI3cBDv90ygO18SB8sCykd5xE6zktjl6'),
    (4,'o45eO40uhkKlM6sd','hpB5kxSbMftVmLCXdmMQC2i2qUZonLO2');

CREATE TABLE IF NOT EXISTS `notices` (
  `id` bigint(16) unsigned NOT NULL AUTO_INCREMENT,
  `subject` varchar(512) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  -- `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created` datetime ,
  `creator` bigint(16) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `creator` (`creator`),
  CONSTRAINT `notices_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `subject` varchar(512) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  `status` varchar(8) NOT NULL DEFAULT 'ACTIVE',
  `is_read` tinyint(4) NOT NULL DEFAULT '0', 
  -- `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created` datetime ,
  `creator` bigint(16) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `creator` (`creator`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `messages_receiver` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `message_id` bigint(16) unsigned NOT NULL,
  `receiver_id` bigint(16) unsigned NOT NULL,
  `result` int(11) NOT NULL DEFAULT '0',
  `desc` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `message_fk` (`message_id`),
  KEY `message_receiver_fk` (`receiver_id`),
  CONSTRAINT `message_fk` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`),
  CONSTRAINT `message_receiver_fk` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL DEFAULT '', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT IGNORE INTO `roles` (`id`,`name`) 
VALUES 
	(1,'user'),
	(2,'admin'),
	(3,'operator'),
	(4,'broker'),
	(5,'all');

CREATE TABLE IF NOT EXISTS `role_group` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL DEFAULT '', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT IGNORE INTO `role_group` (`id`,`name`) 
VALUES 
	(1,'주선소');

CREATE TABLE IF NOT EXISTS `group_role` (
  `group_id` int(11) unsigned NOT NULL,
  `role_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (group_id, role_id),
  CONSTRAINT `group_role_fk_1` FOREIGN KEY (`group_id`) REFERENCES `role_group` (`id`),
    CONSTRAINT `group_role_fk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT IGNORE INTO `group_role` (`group_id`,`role_id`) 
VALUES 
	(1,1),
    (1,4);

CREATE TABLE IF NOT EXISTS `files` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `notice_id` bigint(16) unsigned NOT NULL,
  `upload_name` varchar(64) NOT NULL DEFAULT '',
  `origin_name` varchar(128) NOT NULL DEFAULT '',
  `size` int(11) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `files_ffk_1` (`notice_id`),
  CONSTRAINT `files_ffk_1` FOREIGN KEY (`notice_id`) REFERENCES `notices` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `role_group_member` (
  `role_group_id` int(11) unsigned NOT NULL,
  `user_id` bigint(16) unsigned NOT NULL,
    CONSTRAINT `role_group_member_grmfk_1` FOREIGN KEY (`role_group_id`) REFERENCES `role_group` (`id`),
    CONSTRAINT `role_group_member_grmfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT IGNORE INTO `role_group_member` (`role_group_id`,`user_id`) 
VALUES 
	(1,1);

CREATE TABLE IF NOT EXISTS `brokers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `telephone` varchar(14) DEFAULT NULL COMMENT '대표 전화번호',
  `handphone` varchar(14) DEFAULT NULL COMMENT '대표 핸드폰 번호',
  `address` varchar(32) DEFAULT NULL,
  `address_detail` varchar(128) DEFAULT NULL COMMENT '상세 주소',
  `post_code` varchar(6) DEFAULT NULL COMMENT '우편번호',
  `status` varchar(8) NOT NULL DEFAULT 'ACTIVE',
  `creator` bigint(20) unsigned NOT NULL,
  `created` datetime NOT NULL,
  `modifier` bigint(20) unsigned NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `brokers_creator_id_fk` (`creator`),
  KEY `brokers_modifier_id_fk` (`modifier`),
  CONSTRAINT `brokers_creator_id_fk` FOREIGN KEY (`creator`) REFERENCES `users` (`id`),
  CONSTRAINT `brokers_modifier_id_fk` FOREIGN KEY (`modifier`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `brokers_members` (
  `broker_id` bigint(20) unsigned NOT NULL COMMENT '주선소 id',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '유저 id',
  `role` varchar(14) NOT NULL DEFAULT 'TELER' COMMENT 'Role (TELER/MANAGER)',
  `creator` bigint(20) unsigned NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`broker_id`,`user_id`),
  KEY `brokers_members_broker_id_fk` (`broker_id`),
  KEY `brokers_members_user_id_fk` (`user_id`),
  CONSTRAINT `brokers_members_broker_id_fk` FOREIGN KEY (`broker_id`) REFERENCES `brokers` (`id`),
  CONSTRAINT `brokers_members_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `broker_groups` (
  `id` bigint(20) unsigned NOT NULL COMMENT '주선소 그룹 id',
  `name` varchar(14) NOT NULL DEFAULT '' COMMENT '주선소 그룹명',
  `creator` bigint(20) unsigned NOT NULL COMMENT '생성자',
  `created` datetime NOT NULL COMMENT '생성일시',
  `modifier` bigint(20) unsigned NOT NULL COMMENT '수정자',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  KEY `broker_group_modifier_fk` (`modifier`),
  KEY `broker_group_creator_fk` (`creator`),
  CONSTRAINT `broker_group_creator_fk` FOREIGN KEY (`creator`) REFERENCES `users` (`id`),
  CONSTRAINT `broker_group_modifier_fk` FOREIGN KEY (`modifier`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `broker_group_members` (
  `broker_group_id` bigint(20) unsigned NOT NULL COMMENT '주선소 id',
  `broker_id` bigint(20) unsigned NOT NULL COMMENT '유저 id',
  `role` varchar(14) NOT NULL DEFAULT 'SLAVE' COMMENT '권한 (MASTER/SLAVE)',
  `rate` float NOT NULL DEFAULT '0' COMMENT '수수료 %',
  `creator` bigint(20) unsigned NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`broker_group_id`,`broker_id`),
  KEY `broker_group_member_broker_id_fk` (`broker_id`),
  CONSTRAINT `broker_group_member_broker_id_fk` FOREIGN KEY (`broker_id`) REFERENCES `brokers` (`id`),
  CONSTRAINT `broker_group_member_group_id_fk` FOREIGN KEY (`broker_group_id`) REFERENCES `broker_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `trucks` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(16) DEFAULT NULL COMMENT '트럭종류',
  `weight` decimal(2,1) DEFAULT NULL COMMENT '무게 ton',
  `model` varchar(16) NOT NULL DEFAULT '' COMMENT '모델명',
  `car_number` varchar(16) DEFAULT NULL COMMENT '차량번호판',
  `registered_number` varchar(16) DEFAULT NULL COMMENT '차량 등록 번호',
  `owner_id` bigint(20) unsigned DEFAULT NULL COMMENT '차량 소유자 id',
  `broker_id` bigint(20) unsigned DEFAULT NULL COMMENT '주선소 id',
  `status` varchar(8) NOT NULL DEFAULT 'ACTIVE' COMMENT '상태',
  `creator` bigint(20) unsigned NOT NULL COMMENT '생성자',
  `created` datetime NOT NULL COMMENT '생성일시',
  `modifier` bigint(20) unsigned NOT NULL COMMENT '수정자',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  UNIQUE KEY `truck_owner_id_key` (`owner_id`),
  KEY `trucks_broker_id_fk` (`broker_id`),
  KEY `trucks_creator_id_fk` (`creator`),
  KEY `trucks_modifier_id_fk` (`modifier`),
  CONSTRAINT `trucks_broker_id_fk` FOREIGN KEY (`broker_id`) REFERENCES `brokers` (`id`),
  CONSTRAINT `trucks_creator_id_fk` FOREIGN KEY (`creator`) REFERENCES `users` (`id`),
  CONSTRAINT `trucks_modifier_id_fk` FOREIGN KEY (`modifier`) REFERENCES `users` (`id`),
  CONSTRAINT `trucks_owner_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `truck_location` (
  `truck_id` bigint(20) unsigned NOT NULL COMMENT '차량 id',
  `latitude` double DEFAULT NULL COMMENT '위도',
  `longitude` double DEFAULT NULL COMMENT '경도',
  `created` datetime NOT NULL COMMENT '생성일시',
  KEY `truck_location_truck_id_fk` (`truck_id`),
  CONSTRAINT `truck_location_truck_id_fk` FOREIGN KEY (`truck_id`) REFERENCES `trucks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `locations_address` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_num` int(6) unsigned NOT NULL COMMENT '우편번호',
  `post_sn` int(3) unsigned NOT NULL COMMENT '우편일련번호',
  `metro_name` varchar(64) NOT NULL DEFAULT '' COMMENT '시도',
  `metro_name_en` varchar(32) NOT NULL DEFAULT '' COMMENT '시도영문',
  `city_name` varchar(32) NOT NULL DEFAULT '' COMMENT '시군구',
  `city_name_en` varchar(32) NOT NULL DEFAULT '' COMMENT '시군구영문',
  `location_name` varchar(32) NOT NULL DEFAULT '' COMMENT '읍면',
  `location_name_en` varchar(32) NOT NULL DEFAULT '' COMMENT '읍면영문',
  `road_name_code` bigint(12) unsigned NOT NULL COMMENT '도로명코드',
  `road_name` varchar(32) NOT NULL DEFAULT '' COMMENT '도로명',
  `road_name_en` varchar(32) NOT NULL DEFAULT '' COMMENT '도로명영문',
  `underground_yn` int(1) unsigned NOT NULL COMMENT '지하여부',
  `building_num1` int(3) unsigned NOT NULL COMMENT '건물번호본번',
  `building_num2` int(3) unsigned NOT NULL COMMENT '건물번호부번',
  `building_admin_num` varchar(25) NOT NULL DEFAULT '' COMMENT '건물관리번호',
  `building_block` varchar(32) NOT NULL DEFAULT '' COMMENT '다량배달처명',
  `building_name` varchar(32) NOT NULL DEFAULT '' COMMENT '시군구용건물명',
  `village_code` bigint(10) unsigned NOT NULL COMMENT '법정동코드',
  `village_name` varchar(32) NOT NULL DEFAULT '' COMMENT '법정동명',
  `town_name` varchar(32) NOT NULL DEFAULT '' COMMENT '리',
  `mountain_yn` int(1) unsigned NOT NULL COMMENT '산여부',
  `block_num1` int(4) unsigned NOT NULL COMMENT '지번본번',
  `town_sn` int(2) unsigned NOT NULL COMMENT '읍면동일련번호',
  `block_num2` int(3) unsigned NOT NULL COMMENT '지번부번',
  PRIMARY KEY (`id`),
  KEY `locations_addr_idx1` (`metro_name`,`city_name`,`location_name`,`road_name`,`building_block`,`building_name`,`village_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6455198 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `business_type`  (
  id varchar(5) not null,
  name_kr varchar(128),
  name_en varchar(512),
  PRIMARY KEY(id) 
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `user_business` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(16) unsigned NOT NULL,
  `business_number` varchar(16) DEFAULT NULL COMMENT '사업자번호',
  `business_name` varchar(32) DEFAULT NULL COMMENT '상호',
  `owner_name` varchar(32) DEFAULT NULL COMMENT '대표자명',
  `business_condition` varchar(5) NOT NULL DEFAULT '' COMMENT '업태',
  `business_type` varchar(5) NOT NULL DEFAULT '' COMMENT '업종',
  `address_id` bigint(20) unsigned NOT NULL COMMENT '주소',
  `address_detail` varchar(64) NOT NULL DEFAULT '' COMMENT '주소 상세',
  `creator` bigint(20) unsigned NOT NULL COMMENT '생성자',
  `created` datetime NOT NULL COMMENT '생성일시',
  `modifier` bigint(20) unsigned NOT NULL COMMENT '수정자',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  KEY `user_business_address_id_fk` (`address_id`),
  KEY `user_business_creator_fk` (`creator`),
  KEY `user_business_modifier_fk` (`modifier`),
  KEY `user_business_type_condition_fk` (`business_condition`),
  KEY `user_business_type_type_fk` (`business_type`),
  CONSTRAINT `user_business_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_business_address_id_fk` FOREIGN KEY (`address_id`) REFERENCES `locations_address` (`id`),
  CONSTRAINT `user_business_creator_fk` FOREIGN KEY (`creator`) REFERENCES `users` (`id`),
  CONSTRAINT `user_business_modifier_fk` FOREIGN KEY (`modifier`) REFERENCES `users` (`id`),
  CONSTRAINT `user_business_type_condition_fk` FOREIGN KEY (`business_condition`) REFERENCES `business_type` (`id`),
  CONSTRAINT `user_business_type_type_fk` FOREIGN KEY (`business_type`) REFERENCES `business_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `consigner` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '' COMMENT '거래처명',
  `phone` varchar(14) NOT NULL DEFAULT '' COMMENT '대표전화번호',
  `fax` varchar(14) DEFAULT NULL COMMENT 'FAX번호',
  `broker_id` bigint(20) unsigned NOT NULL COMMENT '주선소 ID',
  `status` varchar(8) NOT NULL DEFAULT 'ACTIVE' COMMENT '상태',
  `creator` bigint(20) unsigned NOT NULL COMMENT '생성자',
  `created` datetime NOT NULL COMMENT '생성일시',
  `modifier` bigint(20) unsigned NOT NULL COMMENT '수정자',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  KEY `consigners_creator_id_fk` (`creator`),
  KEY `consigners_modifier_id_fk` (`modifier`),
  KEY `consigners_broker_id_fk` (`broker_id`),
  CONSTRAINT `consigners_broker_id_fk` FOREIGN KEY (`broker_id`) REFERENCES `brokers` (`id`),
  CONSTRAINT `consigners_creator_id_fk` FOREIGN KEY (`creator`) REFERENCES `users` (`id`),
  CONSTRAINT `consigners_modifier_id_fk` FOREIGN KEY (`modifier`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `goods_category` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(32) NOT NULL DEFAULT '',
  `name` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `consigner_business` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `consigner_id` bigint(20) unsigned NOT NULL COMMENT '고객ID',
  `license` varchar(32) NOT NULL DEFAULT '' COMMENT '사업자번호',
  `ceo_name` varchar(32) NOT NULL DEFAULT '' COMMENT '대표자명',
  `taxtype` varchar(1) NOT NULL DEFAULT '' COMMENT '1(간이과세), 2(일반과세)',
  `name` varchar(32) NOT NULL DEFAULT '' COMMENT '상호명',
  `conditions` varchar(16) NOT NULL DEFAULT '' COMMENT '업태',
  `type` varchar(5) NOT NULL DEFAULT '' COMMENT '업종',
  `address_id` bigint(20) unsigned DEFAULT NULL COMMENT '주소 id',
  `address_detail` varchar(128) DEFAULT NULL COMMENT '주소 상세',
  `creator` bigint(20) unsigned NOT NULL COMMENT '생성자',
  `created` datetime NOT NULL COMMENT '생성일시',
  `modifier` bigint(20) unsigned NOT NULL COMMENT '수정자',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  KEY `consigner_business_consigner_id_fk` (`consigner_id`),
  KEY `consigner_business_creator_id_fk` (`creator`),
  KEY `consigner_business_modifier_id_fk` (`modifier`),
  KEY `consigner_business_address_id_fk` (`address_id`),
  CONSTRAINT `consigner_business_address_id_fk` FOREIGN KEY (`address_id`) REFERENCES `locations_address` (`id`),
  CONSTRAINT `consigner_business_consigner_id_fk` FOREIGN KEY (`consigner_id`) REFERENCES `consigner` (`id`),
  CONSTRAINT `consigner_business_creator_id_fk` FOREIGN KEY (`creator`) REFERENCES `users` (`id`),
  CONSTRAINT `consigner_business_modifier_id_fk` FOREIGN KEY (`modifier`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `consigner_member` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `consigner_id` bigint(20) unsigned NOT NULL COMMENT '화주ID',
  `name` varchar(32) NOT NULL DEFAULT '' COMMENT '담당자명',
  `telephone` varchar(14) NOT NULL COMMENT '전화번호',
  `handphone` varchar(14) NOT NULL COMMENT '휴대전화번호',
  `email` varchar(64) NOT NULL DEFAULT '' COMMENT '이메일',
  `description` varchar(128) DEFAULT NULL COMMENT '추가정보',
  `creator` bigint(20) unsigned NOT NULL COMMENT '생성자',
  `created` datetime NOT NULL COMMENT '생성일시',
  `modifier` bigint(20) unsigned NOT NULL COMMENT '수정자',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  KEY `consigners_members_consigner_id_fk` (`consigner_id`),
  KEY `consigners_members_creator_id_fk` (`creator`),
  KEY `consigners_members_modifier_id_fk` (`modifier`),
  CONSTRAINT `consigners_members_consigner_id_fk` FOREIGN KEY (`consigner_id`) REFERENCES `consigner` (`id`),
  CONSTRAINT `consigners_members_creator_id_fk` FOREIGN KEY (`creator`) REFERENCES `users` (`id`),
  CONSTRAINT `consigners_members_modifier_id_fk` FOREIGN KEY (`modifier`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `goods` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `consigner_id` bigint(20) unsigned NOT NULL COMMENT '화주ID',
  `weight` decimal(3,1) DEFAULT NULL COMMENT '무게(ton)',
  `length` decimal(3,1) DEFAULT NULL COMMENT '길이(m)',
  `is_mix` tinyint(4) DEFAULT NULL COMMENT '단일 품목 화물 (0)/ 혼합 화물(1)',
  `goods_category_id` bigint(20) unsigned DEFAULT NULL COMMENT '화물 품목 id',
  `description` varchar(512) NOT NULL,
  `sender_name` varchar(32) DEFAULT NULL COMMENT '화주 이름',
  `sender_telephone` varchar(14) NOT NULL,
  `sender_handphone` varchar(14) NOT NULL,
  `sendee_name` varchar(32) NOT NULL,
  `sendee_telephone` varchar(14) DEFAULT NULL COMMENT '화물 받는 사람 전화번호',
  `sendee_handphone` varchar(14) DEFAULT NULL COMMENT '화물 받는 사람 핸드폰 번호',
  `creator` bigint(20) unsigned NOT NULL COMMENT '등록 유저 아이디',
  `created` datetime NOT NULL,
  `modifier` bigint(20) unsigned NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '변경일시',
  PRIMARY KEY (`id`),
  KEY `goods_consigner_id_fk` (`consigner_id`),
  KEY `goods_category_id_fk` (`goods_category_id`),
  KEY `goods_creator_id_fk` (`creator`),
  KEY `goods_modifier_id_fk` (`modifier`),
  CONSTRAINT `goods_category_id_fk` FOREIGN KEY (`goods_category_id`) REFERENCES `goods_category` (`id`),
  CONSTRAINT `goods_consigner_id_fk` FOREIGN KEY (`consigner_id`) REFERENCES `consigner` (`id`),
  CONSTRAINT `goods_creator_id_fk` FOREIGN KEY (`creator`) REFERENCES `users` (`id`),
  CONSTRAINT `goods_modifier_id_fk` FOREIGN KEY (`modifier`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(16) NOT NULL DEFAULT '' COMMENT '공유(주선소/화주), 일반(주선소/화주)',
  `load_datetime` datetime NOT NULL COMMENT '화물 적재 시간',
  `load_method` varchar(16) NOT NULL DEFAULT '' COMMENT '상차방법 지게차/수작업/호이스트/크레인/컨베이어',
  `unload_datetime` datetime NOT NULL COMMENT '화물 하차 시간',
  `unload_method` varchar(16) DEFAULT '' COMMENT '하차방법 지게차/수작업/호이스트/크레인/컨베이어',
  `is_shuttle` tinyint(4) DEFAULT NULL COMMENT '왕복여부',
  `is_quick` tinyint(4) NOT NULL COMMENT '긴급여부',
  `source_id` bigint(20) unsigned NOT NULL COMMENT '상차지 id',
  `destination_id` bigint(20) unsigned NOT NULL COMMENT '하차지 id',
  `goods_id` bigint(20) unsigned NOT NULL COMMENT '화물아이디',
  `weight` int(11) NOT NULL COMMENT '무게',
  `payment_type` int(11) NOT NULL COMMENT '지불방식',
  `freight` int(11) NOT NULL COMMENT '운송료(운임)',
  `fee` int(11) NOT NULL COMMENT '수수료',
  `broker_id` bigint(20) unsigned NOT NULL COMMENT '주선소 id',
  `status` varchar(16) NOT NULL DEFAULT 'ACTIVE',
  `is_alloc` tinyint(11) NOT NULL DEFAULT '0' COMMENT '배차여부',
  `creator` bigint(20) unsigned NOT NULL COMMENT '등록자 id',
  `created` datetime NOT NULL COMMENT '등록일시',
  `modifier` bigint(20) unsigned NOT NULL COMMENT '변경자 id',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `orders_location_source_id` (`source_id`),
  KEY `orders_location_destination_id` (`destination_id`),
  KEY `orders_goods_id_fk` (`goods_id`),
  KEY `orders_brokers_id_fk` (`broker_id`),
  KEY `orders_creator_id_fk` (`creator`),
  KEY `orders_modifier_id_fk` (`modifier`),
  CONSTRAINT `orders_brokers_id_fk` FOREIGN KEY (`broker_id`) REFERENCES `brokers` (`id`),
  CONSTRAINT `orders_creator_id_fk` FOREIGN KEY (`creator`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_goods_id_fk` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`id`),
  CONSTRAINT `orders_location_destination_id_fk` FOREIGN KEY (`destination_id`) REFERENCES `locations_address` (`id`),
  CONSTRAINT `orders_location_source_id_fk` FOREIGN KEY (`source_id`) REFERENCES `locations_address` (`id`),
  CONSTRAINT `modifier_id_fk` FOREIGN KEY (`modifier`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `offers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `truck_id` bigint(20) unsigned NOT NULL COMMENT '트럭 id',
  `type` varchar(8) NOT NULL DEFAULT '' COMMENT '일반/공차',
  `status` varchar(16) NOT NULL DEFAULT 'ACTIVE' COMMENT '상태',
  `creator` bigint(20) unsigned NOT NULL COMMENT '생성자 id',
  `created` datetime NOT NULL,
  `modifier` bigint(20) unsigned NOT NULL COMMENT '수정자 id',
  `modifed` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `offers_creator_id_fk` (`creator`),
  KEY `offers_modifier_id_fk` (`modifier`),
  KEY `offers_trucks_id_fk` (`truck_id`),
  CONSTRAINT `offers_creator_id_fk` FOREIGN KEY (`creator`) REFERENCES `users` (`id`),
  CONSTRAINT `offers_modifier_id_fk` FOREIGN KEY (`modifier`) REFERENCES `users` (`id`),
  CONSTRAINT `offers_trucks_id_fk` FOREIGN KEY (`truck_id`) REFERENCES `trucks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `allocations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL COMMENT '오더 ID',
  `offer_id` bigint(20) unsigned NOT NULL COMMENT '차량 오퍼 ID',
  `allocator` bigint(20) unsigned NOT NULL COMMENT '배차자 ID',
  `allocated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '배차일시',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`,`offer_id`),
  KEY `allocation_order_id_fk` (`order_id`),
  KEY `allocation_offer_id_fk` (`offer_id`),
  KEY `allocator_id_fk` (`allocator`),
  CONSTRAINT `allocator_id_fk` FOREIGN KEY (`allocator`) REFERENCES `users` (`id`),
  CONSTRAINT `allocation_offer_id_fk` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`),
  CONSTRAINT `allocation_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE VIEW `view_locations_name`
AS SELECT
   `l`.`id` AS `id`,concat(`lm`.`name`,concat(' ',concat(`lc`.`city_name1`,concat(' ',concat(`lc`.`city_name2`,concat(' ',`l`.`name`)))))) AS `name`
FROM ((`locations` `l` join `locations_city` `lc`) join `locations_metro` `lm`) where ((`l`.`city_id` = `lc`.`id`) and (`lc`.`metro_id` = `lm`.`id`));


```
* Node.js 설치
* Npm 설치

## Installation
Clone, install and run.

```shell
$ git clone https://chungsoonpark@bitbucket.org/unoits/camel.git
$ cd camel
$ sudo npm install
$ cd public
$ cd bower install
$ cd ..
$ npm start
```

## Explore the app

Visit [`http://localhost:8000`](http://localhost:8000)


## 단위 테스트 실행 (Running the unit tests) 

* Local mariadb or mysql process must be running
* Run `grunt test` from the base directory of the application

## API Doc 생성  

* Run `grunt doc` from the base directory of the application

## Default   

* Run `grunt` from the base directory of the application


USE backcom100schema;

-- 1. Bảng quản lý thông tin người dùng Telegram
CREATE TABLE IF NOT EXISTS bot_user (
    stt INT AUTO_INCREMENT,
    telegram_id VARCHAR(50) NOT NULL PRIMARY KEY COMMENT 'chuỗi số duy nhất của tele',
    username VARCHAR(100) DEFAULT NULL COMMENT 'username telegram',
    name VARCHAR(255) DEFAULT NULL COMMENT 'tên telegram',
    referral_branch VARCHAR(50) DEFAULT NULL COMMENT 'mã ref của người giới thiệu',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'thời gian tạo',
    INDEX idx_stt (stt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. Bảng quản lý UID của các sàn (Dùng chung cho cả BingX, Vantage,...)
CREATE TABLE IF NOT EXISTS backcom_user (
    id INT AUTO_INCREMENT,
    uid VARCHAR(100) NOT NULL PRIMARY KEY COMMENT 'chuỗi số id duy nhất của tài khoản trên sàn',
    exchange VARCHAR(50) NOT NULL COMMENT 'tên sàn (bingx, vantage...)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'thời gian tạo',
    INDEX idx_id (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 3. Bảng quản lý Số tài khoản giao dịch (Dành riêng cho các sàn có nhiều STK như Vantage)
CREATE TABLE IF NOT EXISTS trading_account (
    id INT AUTO_INCREMENT,
    account_number VARCHAR(100) NOT NULL PRIMARY KEY COMMENT 'số tài khoản giao dịch tại sàn',
    uid VARCHAR(100) NOT NULL COMMENT 'UID sở hữu tài khoản này',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'thời gian tạo',
    INDEX idx_id (id),
    CONSTRAINT fk_account_uid FOREIGN KEY (uid) REFERENCES backcom_user(uid) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. Bảng giao dịch riêng cho sàn BINGX (Liên kết trực tiếp với uid vì BingX không có nhiều STK)
CREATE TABLE IF NOT EXISTS bingx_trade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(100) NOT NULL COMMENT 'UID giao dịch của BingX',
    time DATETIME DEFAULT NULL COMMENT 'thời gian giao dịch từ API sàn',
    volume DECIMAL(18, 4) DEFAULT 0.0000 COMMENT 'khối lượng giao dịch',
    commission DECIMAL(18, 4) DEFAULT 0.0000 COMMENT 'hoa hồng nhận được',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'thời gian tạo',
    INDEX idx_uid (uid),
    CONSTRAINT fk_bingx_uid FOREIGN KEY (uid) REFERENCES backcom_user(uid) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. Bảng giao dịch riêng cho sàn VANTAGE (Liên kết với account_number vì 1 UID có nhiều STK)
CREATE TABLE IF NOT EXISTS vantage_trade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(100) NOT NULL COMMENT 'số tài khoản giao dịch của Vantage',
    time DATETIME DEFAULT NULL COMMENT 'thời gian giao dịch từ API sàn',
    volume DECIMAL(18, 4) DEFAULT 0.0000 COMMENT 'khối lượng giao dịch',
    commission DECIMAL(18, 4) DEFAULT 0.0000 COMMENT 'hoa hồng nhận được',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'thời gian tạo',
    INDEX idx_account_number (account_number),
    CONSTRAINT fk_vantage_account FOREIGN KEY (account_number) REFERENCES trading_account(account_number) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Link bài viết lịch kinh tế trên Telegram channel (bot đọc, bạn tự cập nhật hàng tuần/tháng)
--    type: 'week' = lịch tuần, 'month' = lịch tháng. url rỗng = chưa có link.
CREATE TABLE IF NOT EXISTS calendar_link (
    type VARCHAR(10) NOT NULL PRIMARY KEY COMMENT 'week | month',
    url VARCHAR(500) NOT NULL DEFAULT '' COMMENT 'link bài viết trên telegram channel',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO calendar_link (type, url) VALUES ('week', ''), ('month', '');

-- Cập nhật link (ví dụ):
-- UPDATE calendar_link SET url = 'https://t.me/your_channel/123' WHERE type = 'week';
-- UPDATE calendar_link SET url = 'https://t.me/your_channel/456' WHERE type = 'month';

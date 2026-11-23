CREATE TABLE `checkout_sessions` (
    `checkout_session_id` INTEGER NOT NULL AUTO_INCREMENT,
    `stripe_session_id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(500) NOT NULL,
    `product` JSON NOT NULL,
    `cost` DECIMAL(10, 2) NOT NULL,
    `user_id` INTEGER NULL,
    `guest_id` VARCHAR(100) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'pending',
    `completed_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `checkout_sessions_stripe_session_id_key`(`stripe_session_id`),
    PRIMARY KEY (`checkout_session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

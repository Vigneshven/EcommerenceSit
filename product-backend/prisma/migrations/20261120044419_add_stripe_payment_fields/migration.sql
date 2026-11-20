/*
  Warnings:

  - A unique constraint covering the columns `[stripe_session_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_payment_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `order_status` VARCHAR(30) NOT NULL DEFAULT 'pending',
    ADD COLUMN `payment_status` VARCHAR(30) NOT NULL DEFAULT 'pending',
    ADD COLUMN `stripe_payment_id` VARCHAR(255) NULL,
    ADD COLUMN `stripe_session_id` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `orders_stripe_session_id_key` ON `orders`(`stripe_session_id`);

-- CreateIndex
CREATE UNIQUE INDEX `orders_stripe_payment_id_key` ON `orders`(`stripe_payment_id`);

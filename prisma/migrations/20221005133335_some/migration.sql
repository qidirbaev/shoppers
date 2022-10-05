/*
  Warnings:

  - You are about to drop the column `modified_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `ShopItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `modifie_at` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShopItem" DROP CONSTRAINT "ShopItem_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ShopItem" DROP CONSTRAINT "ShopItem_shopping_cart_id_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "modified_at",
ADD COLUMN     "modifie_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "ShopItem";

/*
  Warnings:

  - Added the required column `total_price` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShoppingCart" ADD COLUMN     "products" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "total_price" DECIMAL(65,30) NOT NULL;

-- CreateIndex
CREATE INDEX "product_name" ON "products"("name");

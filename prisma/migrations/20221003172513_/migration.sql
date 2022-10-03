/*
  Warnings:

  - You are about to drop the column `product_category_id` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_product_category_id_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "product_category_id";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `products` on the `ShoppingCart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShoppingCart" DROP COLUMN "products";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "shopping_cart_id" INTEGER;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_shopping_cart_id_fkey" FOREIGN KEY ("shopping_cart_id") REFERENCES "ShoppingCart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

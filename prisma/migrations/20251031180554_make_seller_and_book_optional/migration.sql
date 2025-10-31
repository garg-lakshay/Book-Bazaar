-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_bookId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_sellerId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "sellerId" DROP NOT NULL,
ALTER COLUMN "bookId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

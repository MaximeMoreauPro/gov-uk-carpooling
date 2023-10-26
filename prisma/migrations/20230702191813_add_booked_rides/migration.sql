-- CreateTable
CREATE TABLE "_booked_rides" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_booked_rides_AB_unique" ON "_booked_rides"("A", "B");

-- CreateIndex
CREATE INDEX "_booked_rides_B_index" ON "_booked_rides"("B");

-- AddForeignKey
ALTER TABLE "_booked_rides" ADD CONSTRAINT "_booked_rides_A_fkey" FOREIGN KEY ("A") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_booked_rides" ADD CONSTRAINT "_booked_rides_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

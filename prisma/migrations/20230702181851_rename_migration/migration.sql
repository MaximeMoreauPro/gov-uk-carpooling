-- rename rides and users tables columns to snake_case

ALTER TABLE "rides" RENAME COLUMN "departurePlace" TO "departure_place";
ALTER TABLE "rides" RENAME COLUMN "departureTime" TO "departure_time";
ALTER TABLE "rides" RENAME COLUMN "destinationPlace" TO "destination_place";
ALTER TABLE "rides" RENAME COLUMN "destinationTime" TO "destination_time";
ALTER TABLE "rides" RENAME COLUMN "driverId" TO "driver_id";
ALTER TABLE "rides" RENAME COLUMN "postedAt" TO "posted_at";


ALTER TABLE "users" RENAME COLUMN "firstName" TO "first_name";
ALTER TABLE "users" RENAME COLUMN "lastName" TO "last_name";



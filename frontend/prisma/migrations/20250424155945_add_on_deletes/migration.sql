-- DropForeignKey
ALTER TABLE "RideRule" DROP CONSTRAINT "RideRule_rideId_fkey";

-- DropForeignKey
ALTER TABLE "RideRule" DROP CONSTRAINT "RideRule_ruleId_fkey";

-- AddForeignKey
ALTER TABLE "RideRule" ADD CONSTRAINT "RideRule_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideRule" ADD CONSTRAINT "RideRule_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE CASCADE ON UPDATE CASCADE;

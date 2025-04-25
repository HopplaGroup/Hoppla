"use server";

import { RIDE_PRICE } from "@/lib/bog/constants";
import refundPayment from "@/lib/bog/refund-payment";
import { sendRideCancellationToDriverEmail } from "@/lib/functions/emails/templates/send-ride-cancellation-to-driver-email";
import { sendRideStatusToPassengerEmail } from "@/lib/functions/emails/templates/send-ride-status-to-passenger-email";
import { getUser } from "@/lib/utils/auth";
import { createServerAction } from "@/lib/utils/createServerAction";
import db from "@/lib/utils/db";
import { z } from "zod";

const cancelRide = createServerAction(
    z.object({
        rideId: z.string(),
    }),
    async ({ rideId }) => {
        await db.$transaction(async (trx) => {
            const user = await getUser();
            if (!user) {
                throw new Error("User not found");
            }
            const ride = await trx.ride.findUnique({
                where: {
                    id: rideId,
                },
                include: {
                    ridePassengerRequests: {
                        include: {
                            passenger: true,
                        },
                    },
                },
            });

            if (!ride) {
                throw new Error("Ride not found");
            }

            await trx.ride.update({
                where: {
                    id: rideId,
                },
                data: {
                    status: "CANCELLED",
                },
            });

            for (const request of ride.ridePassengerRequests) {
                if (
                    request.status === "ACCEPTED" ||
                    request.status === "PENDING"
                ) {
                    await trx.ridePassengerRequest.update({
                        where: {
                            id: request.id,
                        },
                        data: {
                            status: "CANCELLED",
                        },
                    });
                    if (request.bogOrderId) {
                        const res = await refundPayment(request.bogOrderId);
                        if (!res.success) {
                            await trx.user.update({
                                where: {
                                    id: request.passengerId,
                                },
                                data: {
                                    balance: {
                                        increment: RIDE_PRICE,
                                    },
                                },
                            });
                        }
                    } else {
                        await trx.user.update({
                            where: {
                                id: request.passengerId,
                            },
                            data: {
                                balance: {
                                    increment: RIDE_PRICE,
                                },
                            },
                        });
                    }
                }
            }
            try {
                if (user.role === "ADMIN" && user.id !== ride.driverId) {
                    await sendRideCancellationToDriverEmail({
                        to: [ride.driverId],
                    });
                }
            } catch (error) {}

            try {
                await sendRideStatusToPassengerEmail({
                    status: "canceled",
                    to: ride.ridePassengerRequests
                        .filter(
                            (r) =>
                                r.status === "ACCEPTED" ||
                                r.status === "PENDING"
                        )
                        .map((r) => r.passenger.id),
                });
            } catch (error) {}
        });
    }
);

export default cancelRide;

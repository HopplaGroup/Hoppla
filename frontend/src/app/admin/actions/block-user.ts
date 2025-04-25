"use server";
import { RIDE_PRICE } from "@/lib/bog/constants";
import refundPayment from "@/lib/bog/refund-payment";
import { sendBanNotificationToUserEmail } from "@/lib/functions/emails/templates/send-ban-notification-to-user-email";
import { getUser } from "@/lib/utils/auth";
import { createServerAction } from "@/lib/utils/createServerAction";
import db from "@/lib/utils/db";
import { z } from "zod";

const blockUser = createServerAction(
    z.object({
        userId: z.string(),
        blocked: z.boolean(),
    }),
    async ({ userId, blocked }) => {
        await db.$transaction(async (trx) => {
            const user = await getUser();

            await trx.user.update({
                where: { id: userId },
                data: { status: blocked ? "BLOCKED" : "ACTIVE" },
            });

            if (!blocked) return;

            await sendBanNotificationToUserEmail({
                to: [userId],
            });

            const rides = await trx.ride.findMany({
                where: {
                    driverId: userId,
                    // FIND ALL RIDES THAT IN PROGRESS BUT NOT STARTED AND WHICH NOT STARTED YET CANCELL THEM
                    startedConfirmations: {
                        none: {},
                    },
                },
                include: {
                    ridePassengerRequests: {
                        include: {
                            passenger: true,
                        },
                    },
                },
            });

            const passengerRequests = await trx.ridePassengerRequest.findMany({
                where: {
                    passengerId: userId,
                    status: {
                        in: ["ACCEPTED", "PENDING"],
                    },
                },
            });

            for (const request of passengerRequests) {
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
                                id: userId,
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
                            id: userId,
                        },
                        data: {
                            balance: {
                                increment: RIDE_PRICE,
                            },
                        },
                    });
                }
            }

            for (const ride of rides) {
                await trx.ride.update({
                    where: {
                        id: ride.id,
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
            }
        });
    }
);

export default blockUser;

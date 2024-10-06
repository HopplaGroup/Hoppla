"use client";
import { Button } from "@/components/ui/button";
import {
  getQueryKey,
  useCreateRidePassengerRequest,
  useCreateRideStartedConfirmation,
  useDeleteRidePassengerRequest,
  useFindManyUserReview,
  useFindUniqueRide,
  useFindUniqueRideStartedConfirmation,
} from "@/lib/hooks";
import {
  Bookmark,
  Calendar,
  CarTaxiFront,
  Check,
  ChevronDown,
  CircleDot,
  Clock,
  DollarSign,
  MapPin,
  PanelTopDashed,
  Type,
  User,
  Users,
  Image,
  FlagTriangleRight,
  CheckCheck,
  Stars,
  Plus,
  X,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { languageTag } from "@/paraglide/runtime";
import PLACES from "@/lib/constants/places";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import { ruleToIcon } from "../../search/_components/rule-icons";
import bookRide from "@/lib/bog/book-ride";
import { cn } from "@/lib/utils/cn";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import cancelRide from "@/lib/bog/cancel-ride";
import db from "@/lib/utils/db";
import acceptPassenger from "@/lib/bog/accept-passenger";
import rejectPassenger from "@/lib/bog/reject-passenger";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { menv } from "@/lib/utils/menv";
import cancelRideDriver from "@/app/admin/actions/cancel-ride";
import * as m from "@/paraglide/messages.js";
const FormSchema = z.object({
  preferredPrice: z.number().int().positive().optional(),
  description: z.string().min(1).max(255).optional(),
  buyImmediately: z.boolean(),
});

export function Ride({
  rideId,
  userId,
}: {
  rideId: string;
  userId: string | undefined;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      buyImmediately: true,
    },
  });
  const [isPreferedStateChecked, setIsPreferedStateChecked] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isCancelingRide, setIsCancelingRide] = useState(false);
  const [isAcceptingPassenger, setIsAcceptingPassenger] = useState(false);
  const [isRejectingPassenger, setIsRejectingPassenger] = useState(false);
  const { data: ride, isPending } = useFindUniqueRide({
    where: {
      id: rideId,
    },
    include: {
      driver: true,
      ridePassengerRequests: {
        include: {
          passenger: true,
        },
      },
      car: true,
      rideRules: {
        include: {
          rule: true,
        },
      },
    },
  });
  const queryClient = useQueryClient();
  const queryKey = getQueryKey("User", "findUnique", {
    where: {
      id: userId,
    },
  });
  const [open, setOpen] = useState(false);

  const bookRideQueryKey = getQueryKey("Ride", "findUnique", {
    where: {
      id: rideId,
    },
  });

  const { data: rideStartedConfirmation } =
    useFindUniqueRideStartedConfirmation(
      {
        where: {
          rideId_userId: {
            rideId,
            userId: userId || "",
          },
        },
      },
      {
        enabled: !!userId,
      }
    );

  console.log({
    rideStartedConfirmation,
  });

  const { data: userReviews } = useFindManyUserReview(
    {
      where: {
        revieweeId: ride?.driverId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    },
    {
      enabled: !!ride?.driverId,
    }
  );

  const averageUserRating = useMemo(() => {
    if (!userReviews || userReviews.length === 0) return 0;

    const totalRating = userReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return totalRating / userReviews.length;
  }, [userReviews]);

  const {
    mutate: createRideStartedConfirmation,
    isPending: isRideStartedConfirming,
  } = useCreateRideStartedConfirmation();

  const {
    mutate: removePassengerRequest,
    isPending: isRemovingPassengerRequest,
  } = useDeleteRidePassengerRequest({});

  const {
    mutate: createPassengerRequest,
    isPending: isCreatingPassengerRequest,
  } = useCreateRidePassengerRequest({});
  const [isCancelingRideDriver, setIsCancelingRideDriver] = useState(false);

  const onCancelRideDriver = () => {
    setIsCancelingRideDriver(true);
    cancelRideDriver({
      rideId,
    }).then((res) => {
      setIsCancelingRideDriver(false);
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: bookRideQueryKey,
        });
        queryClient.invalidateQueries({
          queryKey,
        });
      } else {
        toast.error(m.only_heroic_peacock_cure());
      }
    });
  };

  const onCancelRide = () => {
    setIsCancelingRide(true);
    cancelRide(rideId).then((res) => {
      setIsCancelingRide(false);
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: bookRideQueryKey,
        });
        queryClient.invalidateQueries({
          queryKey,
        });
      } else {
        toast.error(m.only_heroic_peacock_cure());
      }
    });
  };

  function onAcceptPassenger(passengerId: string) {
    setIsAcceptingPassenger(true);
    acceptPassenger(rideId, passengerId).then((res) => {
      setIsAcceptingPassenger(false);
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: bookRideQueryKey,
        });
        queryClient.invalidateQueries({
          queryKey,
        });
      } else {
        toast.error(m.smart_candid_stork_pray());
      }
    });
  }

  function onRejectPassenger(passengerId: string) {
    setIsRejectingPassenger(true);
    rejectPassenger(rideId, passengerId).then((res) => {
      setIsRejectingPassenger(false);
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: bookRideQueryKey,
        });
        queryClient.invalidateQueries({
          queryKey,
        });
      } else {
        toast.error(m.left_noisy_anaconda_link());
      }
    });
  }

  function payForRide() {
    setIsPaying(true);
    bookRide(rideId)
      .then((res) => {
        setIsPaying(false);
        if (res.success) {
          queryClient.invalidateQueries({
            queryKey: bookRideQueryKey,
          });
          queryClient.invalidateQueries({
            queryKey,
          });
        } else {
          toast.error(m.mild_early_carp_sing());
        }
      })
      .catch((error) => {
        console.error(error);
        setIsSendingRequest(false);
      });
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createPassengerRequest(
      {
        data: {
          rideId,
          passengerId: userId,
          preferredPrice: data.preferredPrice,
          description: data.description,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          queryClient.invalidateQueries({
            queryKey: bookRideQueryKey,
          });
          queryClient.invalidateQueries({
            queryKey,
          });
          if (data.buyImmediately) {
            payForRide();
          }
        },
      }
    );
  }

  function formatPhoneNumber(phoneNumber: string): string {
    if (phoneNumber.length === 13) {
      return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(
        4,
        7
      )} ${phoneNumber.slice(7, 9)} ${phoneNumber.slice(
        9,
        11
      )} ${phoneNumber.slice(11, 13)}`;
    }
    return phoneNumber; // Return as is if it doesn't match expected length
  }

  return (
    <>
      {isPending ? (
        <RideSkeleton />
      ) : ride ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 lg:p-10">
          <div className="p-4 md:pl-28 md:pr-28 ">
            <div>
              <div className="flex">
                <Link href={`/users/${ride.driver.id}`}>
                  <img
                    src={ride.driver.profileImg}
                    className="size-24 rounded-3xl object-cover"
                    alt=""
                  />
                </Link>
                <div className="pl-4">
                  <div className="text-xl font-font-semibold">
                    {ride.driver.name}
                  </div>
                  <div className="text-sm">
                    <p className="flex items-center gap-1 font-semibold">
                      <Stars className="text-primary" size={17} />
                      <div>{averageUserRating}</div>
                    </p>
                    <p>
                      Member since{" "}
                      {new Date(ride.driver.createdAt).getFullYear()}
                    </p>
                  </div>
                </div>

                {ride.driver.isUserVerified && (
                  <div className="flex justify-between mt-1">
                    <div className="bg-primary/10 size-6 flex items-center justify-center rounded-full">
                      <Check className="text-primary font-bold" size={18} />
                    </div>
                  </div>
                )}
              </div>

              {((ride.driverId !== userId &&
                ride.ridePassengerRequests.some(
                  (r) => r.passengerId === userId && r.status === "ACCEPTED"
                )) ||
                ride.driverId == userId) && (
                <div className="flex items-center gap-2 pt-2">
                  <Phone className="fill-white stroke-primary" />
                  <span className="text-lg">
                    {ride.driver.mobileNumber
                      ? formatPhoneNumber(ride.driver.mobileNumber)
                      : ""}
                  </span>
                </div>
              )}
            </div>

            <Separator className="mt-4" />
            <h2 className="mt-2 font-semibold text-xl mb-2">
              {format(ride.departure, "d MMMM", {
                // locale: languageTag(),
              })}
            </h2>
            <div className="bg-white shadow-sm rounded-sm ">
              <div className="relative p-2 pl-4 pr-4">
                <div className="absolute right-[24px] top-[24px] ">
                  <div className="p-1  rounded-md text-3xl text-gray-800">
                    {ride.price} ₾
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-10 h-7 flex items-center">
                    <span className="text-sm text-primary font-semibold dark:text-neutral-400">
                      {format(
                        new Date(new Date(ride.departure).getTime()),
                        "HH:mm"
                      )}
                    </span>
                  </div>

                  <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
                    <div className="relative z-10 size-7 flex justify-center items-center">
                      <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
                    </div>
                  </div>

                  <div className="grow pt-0.5 pb-8">
                    <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                      {
                        PLACES.find((p) => p.osm === ride.from)?.name[
                          languageTag()
                        ]
                      }
                    </h3>
                  </div>
                </div>

                <div className="flex gap-x-2">
                  <div className="w-10 h-7 flex items-center">
                    <span className="text-sm text-primary font-semibold dark:text-neutral-400">
                      {format(
                        new Date(
                          new Date(ride.departure).getTime() +
                            ride.duration * 1000
                        ),
                        "HH:mm"
                      )}
                    </span>
                  </div>

                  <div className="relative ">
                    <div className="relative z-10 size-7 flex justify-center items-center">
                      <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
                    </div>
                  </div>

                  <div className="grow pt-0.5">
                    <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                      {
                        PLACES.find((p) => p.osm === ride.to)?.name[
                          languageTag()
                        ]
                      }
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="mt-2 font-semibold text-xl">Ride Rules</h2>

            <div className=" grid grid-cols-2 ">
              {ride.rideRules.length > 0 ? (
                ride.rideRules.map(({ rule }, index) => (
                  <div className="flex " key={index}>
                    <div className="flex items-center">
                      {ruleToIcon[rule.description]}
                    </div>
                    <div className="flex items-center">
                      <div className="text-gray-500  ">{rule.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">
                  Driver skipped filling details
                </div>
              )}
            </div>
            <h2 className="mt-2 font-semibold text-xl">Car Details</h2>

            <div className="mt-2 flex flex-col gap-2 lg:flex-row">
              <div className="lg:w-1/2">
                <img
                  src={ride.car.photos?.[0] || ""}
                  className="w-full h-full rounded-md object-cover"
                  alt=""
                />
              </div>

              <div className="lg:w-1/2 bg-white shadow-sm rounded-md p-4">
                <dl className="divide-y divide-gray-100 text-sm">
                  <div className="flex items-center justify-between py-3">
                    <dt className="font-medium text-gray-900 flex items-center gap-2">
                      <Type size={22} />
                      Type
                    </dt>
                    <dd className="text-gray-700">{ride.car.type}</dd>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <dt className="font-medium text-gray-900 flex items-center gap-2">
                      <PanelTopDashed size={22} />
                      Plate
                    </dt>
                    <dd className="text-gray-700">{ride.car.plate}</dd>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <dt className="font-medium text-gray-900 flex items-center gap-2">
                      <CarTaxiFront size={22} />
                      Mark
                    </dt>
                    <dd className="text-gray-700">{ride.car.mark}</dd>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <dt className="font-medium text-gray-900 flex items-center gap-2">
                      <Users size={22} />
                      Capacity
                    </dt>
                    <dd className="text-gray-700">{ride.car.capacity}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="p-4 md:pl-28 md:pr-28">
            <div className="xl:w-[460px] flex flex-col justify-center ">
              <h2 className="font-semibold text-xl mb-2">Book the ride</h2>
              <div
                className={cn(
                  "border mt-2 w-full shadow-sm bg-white rounded-2xl mb-4 p-0 relative",
                  {
                    "border-primary": ride.status === "CANCELLED",
                  }
                )}
              >
                <div className="pt-5 px-5">
                  <h2 className="text-lg mt-0 mb-1 text-center">
                    {ride.status === "CANCELLED" ? (
                      <div className="text-red-500 font-semibold">
                        Ride is cancelled
                      </div>
                    ) : (
                      <>
                        {ride.availableSeats -
                          ride.ridePassengerRequests.filter(
                            (r) => r.status === "ACCEPTED"
                          ).length ===
                        0
                          ? "Fully Booked"
                          : `${
                              ride.availableSeats -
                              ride.ridePassengerRequests.filter(
                                (r) => r.status === "ACCEPTED"
                              ).length
                            } seats available`}
                      </>
                    )}
                  </h2>
                  <ul className="list-none mb-0">
                    {ride.driverId === userId &&
                      new Array(ride.availableSeats)
                        .fill(null)
                        .map((_, index) => {
                          const acceptedPassenger =
                            ride.ridePassengerRequests.filter(
                              (r) =>
                                r.status === "ACCEPTED" &&
                                r.passengerId !== ride.driverId
                            )[index]; // Exclude driver

                          return (
                            <li
                              key={index}
                              className="py-3 pr-4 flex items-center border-b border-gray-300"
                            >
                              {acceptedPassenger ? (
                                <Link
                                  className="flex items-center"
                                  href={`/users/${acceptedPassenger.passengerId}`}
                                >
                                  <img
                                    src={acceptedPassenger.passenger.profileImg}
                                    className="w-10 h-10 rounded-full mr-3 object-cover"
                                    alt="Passenger"
                                  />
                                  {acceptedPassenger.passenger.name}
                                </Link>
                              ) : (
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                                  <div>{"Available Seat"} </div>
                                </div>
                              )}
                            </li>
                          );
                        })}

                    {ride.driverId !== userId &&
                      new Array(ride.availableSeats)
                        .fill(null)
                        .map((_, index) => {
                          const acceptedPassenger =
                            ride.ridePassengerRequests.filter(
                              (r) => r.status === "ACCEPTED"
                            )[index]; // Get the passenger at the current index if available

                          return (
                            <li
                              key={index}
                              className="py-3 pr-4 flex items-center border-b border-gray-300"
                            >
                              {acceptedPassenger ? (
                                <Link
                                  className="flex items-center"
                                  href={`/users/${acceptedPassenger.passengerId}`}
                                >
                                  <img
                                    src={acceptedPassenger.passenger.profileImg}
                                    className="w-10 h-10 rounded-full mr-3 object-cover"
                                    alt="Passenger"
                                  />
                                  {acceptedPassenger.passenger.name}
                                </Link>
                              ) : (
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                                  <div>{"You? "} </div>
                                </div>
                              )}
                            </li>
                          );
                        })}

                    <div className="mb-4 mt-4 flex">
                      <div className="flex-grow flex items-center">
                        {`Driver's price for one seat`}
                      </div>
                      <div>
                        <span className="text-2xl font-bold">
                          {ride.price}{" "}
                        </span>
                        <span className="text-gray-400">₾</span>{" "}
                      </div>
                    </div>
                    {!userId && (
                      <RegisterLink
                        authUrlParams={{
                          connection_id:
                            menv.NEXT_PUBLIC_KINDE_CONNECTION_GOOGLE,
                        }}
                      >
                        <Button className="flex w-full justify-center items-center gap-2 bg-primary text-white p-3 rounded-lg">
                          Sign In To Book
                        </Button>
                      </RegisterLink>
                    )}

                    {ride.driverId === userId &&
                      ride.status !== "CANCELLED" && (
                        <div className="flex justify-end">
                          <AlertDialog open={open} onOpenChange={setOpen}>
                            <AlertDialogTrigger className="w-full">
                              <div className="flex justify-center items-center gap-2 hover:bg-primary bg-gray-400 text-white p-3 rounded-lg">
                                Cancel Ride
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure, you want to cancel the ride?
                                </AlertDialogTitle>
                              </AlertDialogHeader>
                              <Separator />

                              <div>
                                <div className="text-2xl"></div>
                                <p>
                                  <strong>Note: </strong>
                                  Canceling will inform future passengers and
                                  may affect your rating.
                                </p>
                              </div>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <Button
                                  disabled={isCancelingRideDriver}
                                  onClick={onCancelRideDriver}
                                >
                                  Cancel
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}

                    {ride.driverId === userId &&
                      ride.ridePassengerRequests.some(
                        (r) => r.status !== "ACCEPTED"
                      ) &&
                      ride.status == "ACTIVE" && (
                        <div className="mt-6">
                          <Separator />
                          <div className="text-center">Requests</div>
                        </div>
                      )}

                    {ride.driverId === userId &&
                      ride.ridePassengerRequests
                        .filter(
                          (r) =>
                            r.status === "PENDING" || r.status === "REJECTED"
                        )
                        .sort((a, b) => {
                          const statusOrder = [
                            "PENDING",
                            "ACCEPTED",
                            "REJECTED",
                          ];
                          return (
                            statusOrder.indexOf(a.status) -
                            statusOrder.indexOf(b.status)
                          );
                        })
                        .map(
                          ({
                            passenger,
                            status,
                            preferredPrice,
                            description,
                          }) => (
                            <li
                              key={passenger.id}
                              className={cn(
                                "py-3 mt-2 bg-white rounded-md pl-4 pr-4 flex flex-col items-center justify-between border",
                                {
                                  "border-orange-300": status === "UNPAID",
                                  "border-green-300": status === "ACCEPTED",
                                  "border-red-300": status === "REJECTED",
                                  "border-yellow-300": status === "PENDING",
                                }
                              )}
                            >
                              <div className="flex items-center justify-between w-full">
                                <Link
                                  href={`/users/${passenger.id}`}
                                  className="text-primary font-semibold flex items-center"
                                >
                                  <img
                                    src={passenger.profileImg}
                                    className="w-10 h-10 rounded-full mr-3 object-cover "
                                    alt=""
                                  />
                                  <div>{passenger.name}</div>
                                </Link>

                                {ride.status === "ACTIVE" &&
                                  status === "PENDING" && (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        disabled={isAcceptingPassenger}
                                        onClick={() =>
                                          onAcceptPassenger(passenger.id)
                                        }
                                        className="ml-auto bg-green-500 hover:bg-gray-400 text-white py-2 px-4 rounded-md"
                                      >
                                        <Check />
                                      </Button>
                                      <Button
                                        disabled={isRejectingPassenger}
                                        onClick={() =>
                                          onRejectPassenger(passenger.id)
                                        }
                                        className="ml-auto bg-red-500 hover:bg-gray-400 text-white py-2 px-4 rounded-md"
                                      >
                                        <X />
                                      </Button>
                                    </div>
                                  )}
                                {ride.status === "ACTIVE" &&
                                  status === "REJECTED" && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-red-500 font-bold">
                                        Rejected
                                      </span>
                                    </div>
                                  )}
                              </div>

                              {description && (
                                <div className="mt-3 w-full">
                                  <Separator />
                                  <p className="mt-1">{description}</p>
                                </div>
                              )}

                              {preferredPrice && preferredPrice > 0 && (
                                <div className="flex items-center justify-end w-full mt-2 gap-2">
                                  <span className="text-gray-500 text-lg">
                                    Asks for {preferredPrice} ₾
                                  </span>
                                </div>
                              )}
                            </li>
                          )
                        )}

                    {ride.driverId !== userId &&
                      ride.ridePassengerRequests.some(
                        (r) =>
                          r.passengerId === userId && r.status !== "ACCEPTED"
                      ) && (
                        <div className="mt-6">
                          <Separator />
                          <div className="text-center">Request</div>
                        </div>
                      )}

                    {ride.driverId !== userId &&
                      ride.ridePassengerRequests
                        .filter(
                          (r) =>
                            r.passengerId === userId && r.status !== "ACCEPTED"
                        )
                        .map(({ passenger, status }) => (
                          <li
                            key={passenger.id}
                            className={cn(
                              "py-3 mt-2 bg-white rounded-md pl-4 pr-4 flex items-center justify-between border",
                              {
                                "border-orange-300": status === "UNPAID",
                                "border-green-300": status === "ACCEPTED",
                                "border-red-300": status === "REJECTED",
                                "border-yellow-300": status === "PENDING",
                              }
                            )}
                          >
                            <div className="flex items-center">
                              <img
                                src={passenger.profileImg}
                                className="w-10 h-10 rounded-full mr-3 object-cover"
                                alt=""
                              />
                              {passenger.name}
                            </div>

                            <div className="">
                              {status === "PENDING" && (
                                <span className="text-yellow-500 font-bold">
                                  Pending
                                </span>
                              )}
                              {status === "REJECTED" && (
                                <span className="text-red-500 font-bold">
                                  Rejected
                                </span>
                              )}
                              {status === "CANCELLED" && (
                                <span className="text-gray-500 font-bold">
                                  Cancelled
                                </span>
                              )}
                            </div>

                            {passenger.id === userId &&
                              new Date(ride.departure) < new Date() &&
                              !rideStartedConfirmation &&
                              ride.status === "ACTIVE" &&
                              status === "ACCEPTED" && (
                                <Button
                                  disabled={isRideStartedConfirming}
                                  onClick={() => {
                                    createRideStartedConfirmation({
                                      data: {
                                        rideId,
                                        userId,
                                      },
                                    });
                                  }}
                                  className="ml-auto bg-red-500 text-white py-2 px-4 rounded-md"
                                >
                                  Confirm Start
                                </Button>
                              )}
                            {passenger.id === userId &&
                              ride.status === "ACTIVE" &&
                              !rideStartedConfirmation &&
                              status === "UNPAID" && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      disabled={isPaying}
                                      onClick={payForRide}
                                      className="ml-auto bg-primary text-white py-2 px-4 rounded-md"
                                    >
                                      Pay
                                    </Button>
                                    <Button
                                      disabled={isRemovingPassengerRequest}
                                      onClick={() =>
                                        removePassengerRequest(
                                          {
                                            where: {
                                              passengerId_rideId: {
                                                passengerId: userId,
                                                rideId,
                                              },
                                            },
                                          },
                                          {
                                            onSuccess: () => {
                                              queryClient.invalidateQueries({
                                                queryKey: bookRideQueryKey,
                                              });
                                              queryClient.invalidateQueries({
                                                queryKey,
                                              });
                                            },
                                          }
                                        )
                                      }
                                      className="ml-auto bg-primary text-white py-2 px-4 rounded-md"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </>
                              )}
                            {/* {passenger.id ===
                                                                userId &&
                                                                ride.status ===
                                                                    "ACTIVE" &&
                                                                !rideStartedConfirmation &&
                                                                !(
                                                                    status ===
                                                                        "REJECTED" ||
                                                                    status ===
                                                                        "CANCELLED" ||
                                                                    status ===
                                                                        "UNPAID"
                                                                ) && (
                                                                    <Button
                                                                        disabled={
                                                                            isCancelingRide
                                                                        }
                                                                        onClick={
                                                                            onCancelRide
                                                                        }
                                                                        className="bg-primary text-white py-2 px-4 rounded-md"
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                )} */}
                          </li>
                        ))}
                  </ul>
                </div>

                <div className="p-4">
                  {ride.status === "ACTIVE" &&
                    new Date(ride.departure) > new Date() &&
                    userId &&
                    ride.driverId !== userId &&
                    !rideStartedConfirmation &&
                    !ride.ridePassengerRequests.find(
                      (r) => r.passengerId === userId
                    ) &&
                    ride.ridePassengerRequests.filter(
                      (r) => r.status === "ACCEPTED"
                    ).length < ride.availableSeats && (
                      <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger className="w-full">
                          <div className="flex justify-center items-center gap-2 bg-primary text-white p-3 rounded-lg">
                            Start Booking
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-md">
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className="space-y-8 overflow-auto"
                            >
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Send booking request
                                </AlertDialogTitle>
                              </AlertDialogHeader>
                              <div className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Request Details</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="You can leave this empty"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        {`Tell the driver if you have any special requests`}
                                      </FormDescription>
                                      <FormMessage errorMessage="Please enter a valid description" />
                                    </FormItem>
                                  )}
                                />

                                <div className="">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={isPreferedStateChecked}
                                      onChange={() =>
                                        setIsPreferedStateChecked((p) => !p)
                                      }
                                    />
                                    <span className="select-none">
                                      Need price negotitation?
                                    </span>
                                  </label>
                                </div>

                                {isPreferedStateChecked && (
                                  <FormField
                                    control={form.control}
                                    name="preferredPrice"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Prefered Price</FormLabel>
                                        <FormControl>
                                          <NumericFormat
                                            className={cn()}
                                            decimalScale={2}
                                            customInput={Input}
                                            value={field.value}
                                            onValueChange={(v) => {
                                              const { floatValue } = v;
                                              let newV: number | undefined =
                                                Number(floatValue);
                                              if (isNaN(newV)) {
                                                newV = undefined;
                                              }

                                              field.onChange(newV);
                                            }}
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          {`If the driver accepts your booking, it might not guarantee the discount, make sure to contact them after`}
                                        </FormDescription>
                                        <FormMessage errorMessage="Please enter a valid price" />
                                      </FormItem>
                                    )}
                                  />
                                )}

                                <Separator />

                                <FormDescription>
                                  <strong>Note:</strong>{" "}
                                  {` You will pay the
                                  booking fee now and get a refund if the driver
                                  declines. If accepted, you'll be able to
                                  contact the driver.`}
                                </FormDescription>
                                {/* <FormField
                                  control={form.control}
                                  name="buyImmediately"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <div className="">
                                          <label className="flex items-center gap-2">
                                            <input
                                              type="checkbox"
                                              checked={field.value}
                                              onChange={field.onChange}
                                            />
                                            <span className="select-none">
                                              Check if you want to buy
                                              immediately
                                            </span>
                                          </label>
                                        </div>
                                      </FormControl>

                                      <FormMessage errorMessage="Please check correctly" />
                                    </FormItem>
                                  )}
                                /> */}
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button
                                  disabled={isCreatingPassengerRequest}
                                  type="submit"
                                >
                                  Submit
                                </Button>
                              </AlertDialogFooter>
                            </form>
                          </Form>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  {ride.status === "ACTIVE" &&
                    userId &&
                    ride.driverId !== userId &&
                    !rideStartedConfirmation &&
                    ride.ridePassengerRequests
                      .filter((r) => r.status === "PENDING") // Filter accepted requests
                      .some((r) => r.passengerId === userId) && (
                      <div className="flex items-center gap-2">
                        <Button
                          disabled={isCancelingRide}
                          onClick={onCancelRide} // Function to cancel the ride
                          className="bg-red-500 w-full text-white py-2 px-4 rounded-md"
                        >
                          Cancel Ride
                        </Button>
                      </div>
                    )}
                  {ride.status === "ACTIVE" &&
                    userId &&
                    ride.driverId !== userId &&
                    !rideStartedConfirmation &&
                    ride.ridePassengerRequests
                      .filter((r) => r.status === "ACCEPTED") // Filter accepted requests
                      .some((r) => r.passengerId === userId) && ( // Check if this user is among the accepted
                      <div className="flex items-center gap-2">
                        <Button
                          disabled={
                            new Date(ride.departure) > new Date() ||
                            isRideStartedConfirming
                          }
                          onClick={() =>
                            createRideStartedConfirmation({
                              data: {
                                rideId,
                                userId,
                              },
                            })
                          }
                          className="bg-green-500 w-1/2 text-white py-2 px-4 rounded-md"
                        >
                          Start Ride
                        </Button>

                        <Button
                          disabled={isCancelingRide}
                          onClick={onCancelRide} // Function to cancel the ride
                          className="bg-red-500 w-1/2 text-white py-2 px-4 rounded-md"
                        >
                          Cancel Ride
                        </Button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        "Ride does not exist"
      )}
    </>
  );
}

function RideSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 w-64 bg-gray-200 rounded mb-4"></div>
      <div className="flex gap-4 mb-6">
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
      </div>
      <div className="h-10 w-full bg-gray-200 rounded mb-6"></div>
      {[...Array(7)].map((_, index) => (
        <div key={index} className="flex gap-4 mb-4">
          <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-6 w-2/3 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

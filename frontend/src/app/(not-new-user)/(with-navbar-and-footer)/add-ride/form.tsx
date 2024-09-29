"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/actions/button";
import { useMask } from "@react-input/mask";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLoading } from "@/lib/providers/loading-provider";
import { NumericFormat } from "react-number-format";
import ReactSelect from "react-select";

import * as m from "@/paraglide/messages.js";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Car, Rule, User } from "@prisma/client";
import { getDirections } from "./actions";
import { Autocomplete } from "@/components/ui/data-input/autocomplete";
import { Circle, MapPin } from "lucide-react";
import PLACES from "@/lib/constants/places";
import { languageTag } from "@/paraglide/runtime";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { RideCreateSchema } from "@zenstackhq/runtime/zod/models";
import { useCreateRide } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const PRICE_RANGE = 5;

const FormSchema = RideCreateSchema.extend({
    ruleIds: z.array(z.string()).optional(),
});

export function CreateRideForm({
    user,
    cars,
    rules,
}: {
    user: User;
    cars: Car[];
    rules: Rule[];
}) {
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            distance: 0,
            duration: 0,
        },
    });

    const [bestPriceValue, setBestPriceValue] = useState<number | null>(null);

    const { mutate, isPending } = useCreateRide();
    const router = useRouter();

    async function onSubmit(input: z.infer<typeof FormSchema>) {
        mutate(
            {
                data: {
                    availableSeats: input.availableSeats,
                    price: input.price,
                    from: input.from,
                    to: input.to,
                    departure: input.departure,
                    duration: input.duration,
                    distance: input.distance,
                    carId: input.carId,
                    rideRules: {
                        create: input.ruleIds
                            ? input.ruleIds.map((id) => ({
                                  ruleId: id,
                              }))
                            : undefined,
                    },
                },
            },
            {
                onSuccess(data) {
                    toast.success("Ride created successfully");
                    if (data) {
                        router.push(`/rides/${data.id}`);
                    }
                },
            }
        );
    }

    const FuelPricePerLitre = 2.5;
    const FuelConsumptionPerKm = 0.1;

    const getPriceByDistance = (distance: number) => {
        return Number(
            (
                FuelPricePerLitre *
                (distance / 1000) *
                FuelConsumptionPerKm
            ).toFixed(2)
        );
    };

    useEffect(() => {
        const { from, to } = form.getValues();
        if (!from || !to) return;
        getDirections({ from, to }).then((res) => {
            setBestPriceValue(
                res.success ? getPriceByDistance(res.data.distance) : 0
            );
            form.setValue("distance", res.success ? res.data.distance : 0);
            form.setValue("duration", res.success ? res.data.duration : 0);
        });
    }, [form.watch("from"), form.watch("to")]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 text-left mx-auto mb-20"
            >
                <div className="grid grid-cols-2 gap-5">
                    <FormField
                        control={form.control}
                        name="from"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>From</FormLabel>
                                <FormControl>
                                    <Autocomplete
                                        startContent={<Circle size={18} />}
                                        items={PLACES}
                                        displayValue={(item) =>
                                            item.name[languageTag()]
                                        }
                                        onChange={(place) =>
                                            field.onChange(place?.osm || "")
                                        }
                                        getKey={(item) => item.osm}
                                        showMax={10}
                                        filterItems={(items, query) =>
                                            items.filter(
                                                (item) =>
                                                    item.name.en
                                                        .toLowerCase()
                                                        .startsWith(
                                                            query.toLowerCase()
                                                        ) ||
                                                    item.name.ka
                                                        .toLowerCase()
                                                        .startsWith(
                                                            query.toLowerCase()
                                                        )
                                            )
                                        }
                                        placeholder="Departure location"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Please enter the departure location
                                </FormDescription>
                                <FormMessage errorMessage="amazing" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="to"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>To</FormLabel>
                                <FormControl>
                                    <Autocomplete
                                        startContent={<MapPin size={18} />}
                                        items={PLACES}
                                        displayValue={(item) =>
                                            item.name[languageTag()]
                                        }
                                        onChange={(place) =>
                                            field.onChange(place?.osm || "")
                                        }
                                        getKey={(item) => item.osm}
                                        showMax={10}
                                        filterItems={(items, query) =>
                                            items.filter(
                                                (item) =>
                                                    item.name.en
                                                        .toLowerCase()
                                                        .startsWith(
                                                            query.toLowerCase()
                                                        ) ||
                                                    item.name.ka
                                                        .toLowerCase()
                                                        .startsWith(
                                                            query.toLowerCase()
                                                        )
                                            )
                                        }
                                        placeholder="Destination location"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Please enter the destination
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="carId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Choose your car</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={(v) => {
                                        setSelectedCar(
                                            cars.find((c) => c.id === v) || null
                                        );
                                        form.resetField("availableSeats");
                                        field.onChange(v);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {cars.map(({ id, name }) => (
                                                <SelectItem key={id} value={id}>
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>
                                Please enter the departure time
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="availableSeats"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Choose aailable seats</FormLabel>
                            <FormControl>
                                <Select
                                    key={selectedCar?.id}
                                    value={field.value?.toString()}
                                    onValueChange={(v) => {
                                        field.onChange(Number(v));
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {Array.from(
                                                {
                                                    length:
                                                        selectedCar?.capacity ||
                                                        0,
                                                },
                                                (_, i) => i + 1
                                            ).map((o) => (
                                                <SelectItem
                                                    key={o}
                                                    value={o.toString()}
                                                >
                                                    {o}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>
                                Please enter the departure time
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="departure"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Departure Time</FormLabel>
                            <FormControl>
                                <DatePicker
                                    startDate={new Date()}
                                    isHour
                                    placeholder={m.last_ornate_lion_dine()}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Please enter the departure time
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <NumericFormat
                                    className={cn({
                                        "border-red-500 border-2":
                                            field.value >
                                            (bestPriceValue || 0) /
                                                (form.watch("availableSeats") ||
                                                    1),
                                    })}
                                    decimalScale={2}
                                    customInput={Input}
                                    value={field.value}
                                    onValueChange={(v) => {
                                        const { floatValue } = v;
                                        // console.log(floatValue);
                                        // if (
                                        //   floatValue === undefined ||
                                        //   !(
                                        //     floatValue <= realPriceValue + PRICE_RANGE &&
                                        //     floatValue >= Math.max(0, realPriceValue - PRICE_RANGE)
                                        //   )
                                        // ) {
                                        //   setIsPriceValidated(false);
                                        // } else {
                                        //   setIsPriceValidated(true);
                                        // }
                                        field.onChange(Number(floatValue));
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Best price is{" "}
                                {(
                                    (bestPriceValue || 0) /
                                    (selectedCar?.capacity || 1)
                                ).toFixed(1)}{" "}
                                GEL, But you can set your own price
                            </FormDescription>
                            <FormMessage errorMessage="Enter valid price" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ruleIds"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rules</FormLabel>
                            <FormControl>
                                <ReactSelect
                                    isMulti
                                    name="rules"
                                    options={rules.map((r) => ({
                                        value: r.id,
                                        label: r.description,
                                    }))}
                                    className="basic-multi-select py-0"
                                    classNamePrefix="select"
                                    onChange={(v) => {
                                        // console.log(v);
                                        field.onChange(v.map((x) => x.value));
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button disabled={isPending} type="submit">
                    {m.kind_gaudy_puma_exhale()}
                </Button>
            </form>
        </Form>
    );
}

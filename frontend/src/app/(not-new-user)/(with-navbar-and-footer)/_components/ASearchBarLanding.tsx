"use client";
import { Button } from "@/components/ui/button";
import { Autocomplete } from "@/components/ui/autocomplete";
import PLACES from "@/lib/constants/places";
import { languageTag } from "@/paraglide/runtime";
import { Circle, MapPin } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    useQueryState,
    parseAsInteger,
    parseAsIsoDateTime,
    parseAsArrayOf,
    parseAsString,
} from "nuqs";
import * as m from "@/paraglide/messages.js";

import { DatePicker } from "@/components/ui/date-picker";
import { useMemo } from "react";

export default function SearchBarLanding() {
    const [fromOsm, setFromOsm] = useQueryState("from");
    const [toOsm, setToOsm] = useQueryState("to");
    const date = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)), []);
    const [departureDate, setDepartureDate] = useQueryState(
        "departure",
        parseAsIsoDateTime.withDefault(date)
    );
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = () => {
        router.push("/search" + "?" + searchParams.toString());
    };

    return (
        <div className="join-md grid md:grid-cols-4">
            <Autocomplete
                startIcon={<Circle size={18} />}
                items={PLACES.filter((place) => place.osm !== toOsm)}
                defaultSelected={PLACES.find((place) => place.osm === fromOsm)}
                displayValue={(item) => item.name[languageTag()]}
                onChange={(place) => setFromOsm(place?.osm || null)}
                getKey={(item) => item.osm}
                // showMax={10}

                filterItems={(items, query) =>
                    items.filter(
                        (item) =>
                            (item.name.en
                                .toLowerCase()
                                .startsWith(query.toLowerCase()) ||
                                item.name.ka
                                    .toLowerCase()
                                    .startsWith(query.toLowerCase())) &&
                            item.osm !== toOsm
                    )
                }
                placeholder={m.sad_livid_octopus_express()}
            />
            <Autocomplete
                startIcon={<MapPin size={18} />}
                items={PLACES.filter((place) => place.osm !== fromOsm)}
                defaultSelected={PLACES.find((place) => place.osm === toOsm)}
                displayValue={(item) => item.name[languageTag()]}
                onChange={(place) => setToOsm(place ? place.osm : null)}
                getKey={(item) => item.osm}
                // showMax={10}
                filterItems={(items, query) =>
                    items.filter(
                        (item) =>
                            (item.name.en
                                .toLowerCase()
                                .startsWith(query.toLowerCase()) ||
                                item.name.ka
                                    .toLowerCase()
                                    .startsWith(query.toLowerCase())) &&
                            item.osm !== fromOsm
                    )
                }
                placeholder={m.early_born_crow_arrive()}
            />
            <DatePicker
                value={departureDate || undefined}
                onChange={(newDate) => setDepartureDate(newDate || null)}
                startDate={new Date()}
                endDate={new Date(2030, 4, 10)}
            />

            <Button onClick={search}>{m.weak_sharp_jan_cry()}</Button>
        </div>
    );
}

"use client";
import { Button } from "@/components/ui/button";
import { Autocomplete } from "@/components/ui/autocomplete";
import PLACES from "@/lib/constants/places";
import { languageTag } from "@/paraglide/runtime";
import { Circle, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryState, parseAsIsoDate, parseAsIsoDateTime } from "nuqs";
import * as m from "@/paraglide/messages.js";
import { DatePicker } from "@/components/ui/date-picker";
import { useEffect, useMemo } from "react";

export default function SearchBarLanding() {
  const [fromOsm, setFromOsm] = useQueryState("from");
  const [toOsm, setToOsm] = useQueryState("to");
  const d = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)), []);
  const [departureDate, setDepartureDate] = useQueryState(
    "departure",
    parseAsIsoDateTime.withDefault(d).withOptions({
      clearOnDefault: false,
    })
  );
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.has("departure")) {
      setDepartureDate(d);
    }
  }, [searchParams, d, setDepartureDate]);

  // if not departure time in url already i want to to be added
  const router = useRouter();
  const search = () => {
    router.push("/new-search" + "?" + searchParams.toString());
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
        filterItems={(items, query) =>
          items.filter(
            (item) =>
              (item.name.en.toLowerCase().startsWith(query.toLowerCase()) ||
                item.name.ka.toLowerCase().startsWith(query.toLowerCase())) &&
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
        filterItems={(items, query) =>
          items.filter(
            (item) =>
              (item.name.en.toLowerCase().startsWith(query.toLowerCase()) ||
                item.name.ka.toLowerCase().startsWith(query.toLowerCase())) &&
              item.osm !== fromOsm
          )
        }
        placeholder={m.early_born_crow_arrive()}
      />
      <DatePicker
        value={departureDate}
        onChange={(newDate) => {
          if (newDate) {
            console.log(
              new Date(
                newDate.getFullYear(),
                newDate.getMonth(),
                newDate.getDate()
              )
            );
            setDepartureDate(
              new Date(
                newDate.getFullYear(),
                newDate.getMonth(),
                newDate.getDate()
              )
            );
          }
        }}
        startDate={new Date()}
        endDate={new Date(2030, 4, 10)}
      />

      <Button onClick={search}>{m.weak_sharp_jan_cry()}</Button>
    </div>
  );
}

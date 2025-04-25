"use server";

import { createServerAction } from "@/lib/utils/createServerAction";
import { z } from "zod";
import PLACES from "@/lib/constants/places";
import { menv } from "@/lib/utils/menv";

export const getDirections = createServerAction(
    z.object({
        from: z.string(),
        to: z.string(),
    }),
    async ({ from, to }) => {
        const ORS_URL = menv.ORS_URL;

        const origin = PLACES.find((place) => place.osm === from);

        if (!origin) {
            throw new Error("Not Found");
        }

        const destination = PLACES.find((place) => place.osm === to);

        if (!destination) {
            throw new Error("Not Found");
        }

        const response = await fetch(
            `${ORS_URL}/ors/v2/directions/driving-car?start=${origin.lon},${origin.lat}&end=${destination.lon},${destination.lat}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // return data;
        return {
            distance: data.features[0].properties.summary.distance as number,
            duration: data.features[0].properties.summary.duration as number,
            path: data.features[0].geometry.coordinates.map(
                (c: [number, number]) => [c[1], c[0]]
            ),
        };
    }
);

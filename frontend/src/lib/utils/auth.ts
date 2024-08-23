import "server-only";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cache } from "react";
import db from "./db";

export const getUser = cache(async () => {
  try {
    const { getUser: _getKindeUser } = getKindeServerSession();
    const kindeUser = await _getKindeUser();
    if (!kindeUser) {
      throw new Error("Kinde user not found");
    }
    const dbUser = await db.user.findUnique({
      where: { email: kindeUser.email || "" },
    });

    return dbUser;
  } catch (error) {
    // console.error(error);
    return null;
  }
});

export const createUser = async () => {
  try {
    const { getUser: _getKindeUser } = getKindeServerSession();

    const kindeUser = await _getKindeUser();

    if (!kindeUser || kindeUser === null || !kindeUser.id) {
      throw new Error("Something went wrong, sorry...");
    }

    let dbUser = await db.user.findUnique({
      where: {
        email: kindeUser.email ?? "",
      },
    });

    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          email: kindeUser.email || "",
          name: `${kindeUser.given_name || ""} ${kindeUser.family_name || ""}`,
          profileImg: kindeUser.picture || "",
          bio: "",
          birthDate: new Date(),
          idNumber: "",
          mobileNumber: "",
          // rating: 0,
          sex: "OTHER",
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

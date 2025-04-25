import { revalidatePath, revalidateTag } from "next/cache";
import { TypeOf, z } from "zod";
import { cookies } from "next/headers";
import * as mm from "@/paraglide/messages"; // Import your paraglide messages
import {
  AvailableLanguageTag,
  availableLanguageTags,
  setLanguageTag,
  isAvailableLanguageTag,
} from "@/paraglide/runtime";
import db from "@/lib/utils/db";
import { PrismaClient, User, UserRole, UserStatus } from "@prisma/client";
import { makeZodI18nMap } from "./zodI18nMap";
import { getUser } from "./auth";

// Define custom error types
export type ServerActionError = {
  message: string; // Default message (fallback)
  field?: string; // Optional field name for form errors
};

// just wrap it dont use new Proxy
export const m = new Proxy(mm, {
  get(target, key) {
    const msgFn = target[key as keyof typeof m];
    if (typeof msgFn !== "function") return msgFn;

    return (params = {}, options = {}) => {
      const NEXT_LOCALE = cookies().get("NEXT_LOCALE")?.value;
      let languageTag: AvailableLanguageTag = availableLanguageTags[0]; // Default to the first available language tag
      if (isAvailableLanguageTag(NEXT_LOCALE)) {
        languageTag = NEXT_LOCALE;
      }
      return msgFn(params, { ...options, languageTag });
    };
  },
});

// Improved result type
export type ServerActionResultSuccess<T> = {
  success: true;
  data: T;
  message?: string; // Optional success message
};
export type ServerActionResult<T> =
  | ServerActionResultSuccess<T>
  | { success: false; errors: ServerActionError[] };

type GetUserFn = typeof getUser;

export function createServerAction<T, U>(
  schema: z.ZodSchema<T>,
  logic: (data: T, db: PrismaClient) => Promise<U>,
  {
    auth,
    roles,
    userShouldBeActive,
    successMessage,
    revalidatePath: _revalidatePath,
    revalidateTag: _revalidateTag,
    errorMap,
  }: {
    auth?: (getUser: GetUserFn) => Promise<boolean>;
    roles?: UserRole[];
    userShouldBeActive?: boolean;
    successMessage?: any; // Optional success message
    revalidatePath?: string;
    revalidateTag?: string;
    errorMap?: (error: any) => ServerActionError[]; // Optional custom error mapping function
  } = {
    userShouldBeActive: true,
  }
) {
  return async (values: T): Promise<ServerActionResult<U>> => {
    try {
      // Add error map on zod
      // const NEXT_LOCALE = cookies().get("NEXT_LOCALE")?.value;
      // if (isAvailableLanguageTag(NEXT_LOCALE)) {
      //   z.setErrorMap(makeZodI18nMap(NEXT_LOCALE));
      // } else {
      //   z.setErrorMap(makeZodI18nMap(availableLanguageTags[0]));
      // }
      // Validate input
      let user: User | null = null;
      let isUserAlreadyFetched = false;
      if (userShouldBeActive) {
        user = await getUser();
        isUserAlreadyFetched = true;
        if (!user || user.status !== UserStatus.ACTIVE) {
          return {
            success: false,
            errors: [{ message: m.wide_wide_zebra_pull() }],
          };
        }
      }
      if (auth) {
        const isAuthenticated = await auth(getUser);
        if (!isAuthenticated) {
          return {
            success: false,
            errors: [{ message: m.wide_wide_zebra_pull() }],
          };
        }
      }
      if (roles) {
        if (!isUserAlreadyFetched) {
          user = await getUser();
        }
        if (!user || !roles.includes(user.role)) {
          return {
            success: false,
            errors: [{ message: m.wide_wide_zebra_pull() }],
          };
        }
      }
      const data = schema.parse(values);
      const result = await logic(data, db);

      // Handle cache revalidation
      if (_revalidatePath) {
        revalidatePath(_revalidatePath);
      }
      if (_revalidateTag) {
        revalidateTag(_revalidateTag);
      }
      return { success: true, data: result, message: successMessage };
    } catch (error) {
      console.error("Server action error:", error);

      // I think i dont need zod error  translations on server side right now
      // if (error instanceof z.ZodError) {
      //   return {
      //     success: false,
      //     errors: error.errors.map((err) => ({
      //       message: err.message,
      //       field: err.path.join("."),
      //     })),
      //   };
      // }

      // Handle Prisma errors
      if (isPrismaError(error)) {
        return {
          success: false,
          errors: handlePrismaError(error),
        };
      }

      if (errorMap) {
        return { success: false, errors: errorMap(error) };
      }

      // Default error handling
      let errorMessage = m.misty_ideal_mink_praise();

      if (error instanceof Error) {
        if (typeof error.message === "string") {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        errors: [{ message: errorMessage }],
      };
    }
  };
}

// // Helper to check if an error is from Prisma
function isPrismaError(error: any): boolean {
  return (
    error?.name === "PrismaClientKnownRequestError" ||
    error?.name === "PrismaClientValidationError" ||
    (error instanceof Error &&
      "code" in error &&
      typeof error.code === "string" &&
      error.code.startsWith("P"))
  );
}

// // Helper to handle Prisma errors with appropriate messages
function handlePrismaError(error: any): ServerActionError[] {
  const errorMappings: Record<string, { message: string }> = {
    P2002: {
      message: m.keen_sleek_salmon_transform(),
    },
    P2003: { message: m.stale_nice_ape_bump() },
    P2025: { message: m.drab_sharp_panther_zoom() },
    unknown: { message: error.message || m.male_quiet_cowfish_amaze() },
  };

  return [errorMappings[error.code || "unknown"]];
}

import { revalidatePath, revalidateTag } from "next/cache";
import { TypeOf, z } from "zod";
import { cookies } from "next/headers";
import * as mm from "@/paraglide/messages";
import {
  AvailableLanguageTag,
  availableLanguageTags,
  isAvailableLanguageTag,
} from "@/paraglide/runtime";
import db from "@/lib/utils/db";
import { PrismaClient, User, UserRole, UserStatus } from "@prisma/client";
import { getUser } from "./auth";
import { makeZodI18nMap } from "./zodI18nMap";

export const m = new Proxy(mm, {
  get(target, key) {
    const msgFn = target[key as keyof typeof m];
    if (typeof msgFn !== "function") return msgFn;

    return (params = {}, options = {}) => {
      const NEXT_LOCALE = cookies().get("NEXT_LOCALE")?.value;
      let languageTag: AvailableLanguageTag = availableLanguageTags[0];
      if (isAvailableLanguageTag(NEXT_LOCALE)) {
        languageTag = NEXT_LOCALE;
      }
      return msgFn(params, { ...options, languageTag });
    };
  },
});

export type ServerActionError = {
  message: string;
  field?: string;
};

export type ServerActionResultSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ServerActionResultFailure = {
  success: false;
  errors: ServerActionError[];
};

export type ServerActionResult<T> =
  | ServerActionResultSuccess<T>
  | ServerActionResultFailure;

type GetUserFn = typeof getUser;

export function createServerAction<T, U>(
  schema: z.ZodSchema<T>,
  logic: (data: T, db: PrismaClient) => Promise<U>,
  {
    auth,
    roles,
    userShouldBeActive,
    errorMessage,
    successMessage,
    revalidatePath: _revalidatePath,
    revalidateTag: _revalidateTag,
    fieldsZodGeneralErrorMap,
    errorMap,
  }: {
    auth?: (getUser: GetUserFn) => Promise<boolean>;
    roles?: UserRole[];
    userShouldBeActive?: boolean;
    errorMessage?: string;
    successMessage?: string;
    revalidatePath?: string;
    revalidateTag?: string;
    fieldsZodGeneralErrorMap?: (m: any) => Partial<Record<keyof T, string>>;
    errorMap?: (error: any) => ServerActionError[];
  } = {}
) {
  return async (values: T): Promise<ServerActionResult<U>> => {
    try {
      const NEXT_LOCALE = cookies().get("NEXT_LOCALE")?.value;
      if (isAvailableLanguageTag(NEXT_LOCALE)) {
        z.setErrorMap(makeZodI18nMap(NEXT_LOCALE));
      } else {
        z.setErrorMap(makeZodI18nMap(availableLanguageTags[0]));
      }

      let user: User | null = null;
      let isUserAlreadyFetched = false;

      if (auth) {
        const isAuthenticated = await auth(getUser);
        if (!isAuthenticated) {
          return {
            success: false,
            errors: [{ message: m.wide_wide_zebra_pull() }],
          };
        }
      }

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

      if (_revalidatePath) {
        revalidatePath(_revalidatePath);
      }
      if (_revalidateTag) {
        revalidateTag(_revalidateTag);
      }
      return { success: true, data: result, message: successMessage };
    } catch (error) {
      // console.error("Server action error:", error);

      if (error instanceof z.ZodError) {
        let fieldsErrors: Partial<Record<keyof T, string>> | null;
        if (fieldsZodGeneralErrorMap) {
          fieldsErrors = fieldsZodGeneralErrorMap(m);
        }
        return {
          success: false,
          errors: error.errors.map((err) => {
            let message = err.message;
            const field = err.path.join(".") as any;
            let val = fieldsErrors && fieldsErrors[field as keyof T];
            if (val) {
              message = val;
            }
            return {
              message,
              field,
            };
          }),
        };
      }

      if (isPrismaError(error)) {
        return {
          success: false,
          errors: handlePrismaError(error),
        };
      }

      if (errorMap) {
        return { success: false, errors: errorMap(error) };
      }

      let errorMsg = errorMessage || m.misty_ideal_mink_praise();

      if (error instanceof Error) {
        if (typeof error.message === "string") {
          errorMsg = error.message;
        }
      }

      return {
        success: false,
        errors: [{ message: errorMsg }],
      };
    }
  };
}

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

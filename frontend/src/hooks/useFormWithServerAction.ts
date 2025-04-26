"use client";
import { useEffect, useState } from "react";
import {
  useForm,
  UseFormProps,
  UseFormReturn,
  FieldValues,
  Path,
  DefaultValues,
} from "react-hook-form";
import * as m from "@/paraglide/messages";
import toast from "react-hot-toast";
import {
  ServerActionError,
  ServerActionResult,
  ServerActionResultSuccess,
} from "@/lib/utils/createServerAction";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeZodI18nMap } from "@/lib/utils/zodI18nMap";
import { languageTag } from "@/paraglide/runtime";

z.setErrorMap(makeZodI18nMap(languageTag()));

export function useFormWithServerAction<T extends FieldValues, U>(
  serverAction: (values: T) => Promise<ServerActionResult<U>>,
  FormSchema: z.ZodSchema<T>,
  generalZodErrorMap: Partial<Record<keyof T, string>>,
  defaultValues: DefaultValues<T>,
  {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = false,
    mapErrorsToForm = true,
  }: {
    onSuccess?: (data: ServerActionResultSuccess<U>) => void;
    onError?: (
      errors: ServerActionError[],
      firstError: ServerActionError
    ) => void;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    mapErrorsToForm?: boolean;
  } = {}
) {
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<ServerActionError[] | null>(
    null
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setLoading(true);
    setServerErrors(null);
    try {
      const result = await serverAction(data);
      if (result.success) {
        if (showSuccessToast && result.message) {
          toast.success(result.message);
        }
        if (onSuccess && result) {
          onSuccess(result);
        }
        return result.data;
      } else {
        const actionErrors = result.errors;
        setServerErrors(actionErrors);

        // Map errors to form fields if enabled // I dont think code will  reach here because its validated same way
        if (mapErrorsToForm && actionErrors) {
          actionErrors.forEach((error) => {
            if (error.field) {
              try {
                form.setError(error.field as any, {
                  type: "server",
                  message: error.message,
                });
              } catch (e) {
                console.warn(`Could not map error to field: ${error.field}`, e);
              }
            }
          });
        }

        if (showErrorToast && actionErrors.length > 0) {
          const errorMessage = actionErrors[0].message;
          toast.error(errorMessage);
        }

        if (onError && actionErrors.length > 0) {
          onError(actionErrors, actionErrors[0]);
        }
        return null;
      }
    } catch (error) {
      console.error("Error executing server action:", error);
      const fallbackError = [
        {
          message: m.tame_late_bobcat_gleam(),
        },
      ];
      setServerErrors(fallbackError);

      if (showErrorToast) {
        toast.error(fallbackError[0].message);
      }

      if (onError) {
        onError(fallbackError, fallbackError[0]);
      }
      return null;
    } finally {
      setLoading(false);
    }
  });

  const {
    formState: { errors },
  } = form;

  const clientErrors = {} as Record<keyof T, string>;

  for (const key in errors) {
    const fieldKey = key as keyof T;
    // @ts-ignore
    clientErrors[fieldKey] =
      generalZodErrorMap[fieldKey] !== undefined
        ? generalZodErrorMap[fieldKey]
        : errors[fieldKey]?.message || "";
  }

  return {
    form,
    clientErrors,
    handleSubmit,
    loading,
    serverErrors,
    firstError: serverErrors ? serverErrors[0] : null,
    hasErrors: serverErrors !== null && serverErrors.length > 0,
    reset: () => {
      form.reset();
      setServerErrors(null);
    },
  };
}

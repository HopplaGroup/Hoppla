import { useState } from "react";
import * as m from "@/paraglide/messages"; // Import your paraglide messages
import toast from "react-hot-toast";
import {
  ServerActionError,
  ServerActionResult,
  ServerActionResultSuccess,
} from "@/lib/utils/createServerAction";

export function useServerAction<T, U>(
  serverAction: (values: T) => Promise<ServerActionResult<U>>,
  {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = false,
  }: {
    onSuccess?: (data: ServerActionResultSuccess<U>) => void;
    onError?: (
      errors: ServerActionError[],
      firstError: ServerActionError
    ) => void;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
  } = {}
) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ServerActionError[] | null>(null);

  const execute = async (data: T) => {
    setLoading(true);
    setErrors(null);

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
        setErrors(actionErrors);

        // Show error toast with first error message
        if (showErrorToast && actionErrors.length > 0) {
          const errorMessage = actionErrors[0].message;
          toast.error(errorMessage);
        }

        if (onError) {
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
      setErrors(fallbackError);

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
  };

  return {
    execute,
    loading,
    errors,
    firstError: errors ? errors[0] : null,
    hasErrors: errors !== null && errors.length > 0,
    reset: () => setErrors(null),
  };
}

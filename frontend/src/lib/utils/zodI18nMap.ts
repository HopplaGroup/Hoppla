import { AvailableLanguageTag } from "@/paraglide/runtime";
import { ZodIssueCode, ZodParsedType, defaultErrorMap, ZodErrorMap } from "zod";

const data = {
  errors: {
    invalid_type: "Expected {{expected}}, received {{received}}",
    invalid_type_received_undefined: "Required",
    invalid_type_received_null: "Required",
    invalid_literal: "Invalid literal value, expected {{expected}}",
    unrecognized_keys: "Unrecognized key(s) in object: {{- keys}}",
    invalid_union: "Invalid input",
    invalid_union_discriminator:
      "Invalid discriminator value. Expected {{- options}}",
    invalid_enum_value:
      "Invalid enum value. Expected {{- options}}, received '{{received}}'",
    invalid_arguments: "Invalid function arguments",
    invalid_return_type: "Invalid function return type",
    invalid_date: "Invalid date",
    custom: "Invalid input",
    invalid_intersection_types: "Intersection results could not be merged",
    not_multiple_of: "Number must be a multiple of {{multipleOf}}",
    not_finite: "Number must be finite",
    invalid_string: {
      email: "Invalid {{validation}}",
      url: "Invalid {{validation}}",
      uuid: "Invalid {{validation}}",
      cuid: "Invalid {{validation}}",
      regex: "Invalid",
      datetime: "Invalid {{validation}}",
      startsWith: 'Invalid input: must start with "{{startsWith}}"',
      endsWith: 'Invalid input: must end with "{{endsWith}}"',
    },
    too_small: {
      array: {
        exact: "Array must contain exactly {{minimum}} element(s)",
        inclusive: "Array must contain at least {{minimum}} element(s)",
        not_inclusive: "Array must contain more than {{minimum}} element(s)",
      },
      string: {
        exact: "String must contain exactly {{minimum}} character(s)",
        inclusive: "String must contain at least {{minimum}} character(s)",
        not_inclusive: "String must contain over {{minimum}} character(s)",
      },
      number: {
        exact: "Number must be exactly {{minimum}}",
        inclusive: "Number must be greater than or equal to {{minimum}}",
        not_inclusive: "Number must be greater than {{minimum}}",
      },
      set: {
        exact: "Invalid input",
        inclusive: "Invalid input",
        not_inclusive: "Invalid input",
      },
      date: {
        exact: "Date must be exactly {{- minimum, datetime}}",
        inclusive:
          "Date must be greater than or equal to {{- minimum, datetime}}",
        not_inclusive: "Date must be greater than {{- minimum, datetime}}",
      },
    },
    too_big: {
      array: {
        exact: "Array must contain exactly {{maximum}} element(s)",
        inclusive: "Array must contain at most {{maximum}} element(s)",
        not_inclusive: "Array must contain less than {{maximum}} element(s)",
      },
      string: {
        exact: "String must contain exactly {{maximum}} character(s)",
        inclusive: "String must contain at most {{maximum}} character(s)",
        not_inclusive: "String must contain under {{maximum}} character(s)",
      },
      number: {
        exact: "Number must be exactly {{maximum}}",
        inclusive: "Number must be less than or equal to {{maximum}}",
        not_inclusive: "Number must be less than {{maximum}}",
      },
      set: {
        exact: "Invalid input",
        inclusive: "Invalid input",
        not_inclusive: "Invalid input",
      },
      date: {
        exact: "Date must be exactly {{- maximum, datetime}}",
        inclusive:
          "Date must be smaller than or equal to {{- maximum, datetime}}",
        not_inclusive: "Date must be smaller than {{- maximum, datetime}}",
      },
    },
  },
  validations: {
    email: "email",
    url: "url",
    uuid: "uuid",
    cuid: "cuid",
    regex: "regex",
    datetime: "datetime",
  },
  types: {
    function: "function",
    number: "number",
    string: "string",
    nan: "nan",
    integer: "integer",
    float: "float",
    boolean: "boolean",
    date: "date",
    bigint: "bigint",
    undefined: "undefined",
    symbol: "symbol",
    null: "null",
    array: "array",
    object: "object",
    unknown: "unknown",
    promise: "promise",
    void: "void",
    never: "never",
    map: "map",
    set: "set",
  },
};

const dataKa = {
  errors: {
    invalid_type: "მოსალოდნელი იყო {{expected}}, მიღებულია {{received}}",
    invalid_type_received_undefined: "სავალდებულოა",
    invalid_type_received_null: "სავალდებულოა",
    invalid_literal:
      "არასწორი ლიტერალური მნიშვნელობა, მოსალოდნელი იყო {{expected}}",
    unrecognized_keys: "ობიექტში ამოუცნობი გასაღებ(ებ)ი: {{- keys}}",
    invalid_union: "არასწორი შეყვანა",
    invalid_union_discriminator:
      "არასწორი დისკრიმინატორის მნიშვნელობა. მოსალოდნელი იყო {{- options}}",
    invalid_enum_value:
      "არასწორი ჩამონათვალის მნიშვნელობა. მოსალოდნელი იყო {{- options}}, მიღებულია '{{received}}'",
    invalid_arguments: "არასწორი ფუნქციის არგუმენტები",
    invalid_return_type: "ფუნქციის დაბრუნების არასწორი ტიპი",
    invalid_date: "არასწორი თარიღი",
    custom: "არასწორი შეყვანა",
    invalid_intersection_types: "გადაკვეთის შედეგები ვერ გაერთიანდა",
    not_multiple_of: "რიცხვი უნდა იყოს {{multipleOf}}-ის ჯერადი",
    not_finite: "რიცხვი უნდა იყოს სასრული",
    invalid_string: {
      email: "არასწორი {{validation}}",
      url: "არასწორი {{validation}}",
      uuid: "არასწორი {{validation}}",
      cuid: "არასწორი {{validation}}",
      regex: "არასწორი",
      datetime: "არასწორი {{validation}}",
      startsWith: 'არასწორი შეყვანა: უნდა იწყებოდეს "{{startsWith}}"-ით',
      endsWith: 'არასწორი შეყვანა: უნდა მთავრდებოდეს "{{endsWith}}"-ით',
    },
    too_small: {
      array: {
        exact: "მასივი უნდა შეიცავდეს ზუსტად {{minimum}} ელემენტ(ებ)ს",
        inclusive: "მასივი უნდა შეიცავდეს მინიმუმ {{minimum}} ელემენტ(ებ)ს",
        not_inclusive: "მასივი უნდა შეიცავდეს {{minimum}}-ზე მეტ ელემენტ(ებ)ს",
      },
      string: {
        exact: "სტრიქონი უნდა შეიცავდეს ზუსტად {{minimum}} სიმბოლო(ებ)ს",
        inclusive: "სტრიქონი უნდა შეიცავდეს მინიმუმ {{minimum}} სიმბოლო(ებ)ს",
        not_inclusive:
          "სტრიქონი უნდა შეიცავდეს {{minimum}}-ზე მეტ სიმბოლო(ებ)ს",
      },
      number: {
        exact: "რიცხვი უნდა იყოს ზუსტად {{minimum}}",
        inclusive: "რიცხვი უნდა იყოს {{minimum}}-ზე მეტი ან ტოლი",
        not_inclusive: "რიცხვი უნდა იყოს {{minimum}}-ზე მეტი",
      },
      set: {
        exact: "არასწორი შეყვანა",
        inclusive: "არასწორი შეყვანა",
        not_inclusive: "არასწორი შეყვანა",
      },
      date: {
        exact: "თარიღი უნდა იყოს ზუსტად {{- minimum, datetime}}",
        inclusive: "თარიღი უნდა იყოს {{- minimum, datetime}}-ზე მეტი ან ტოლი",
        not_inclusive: "თარიღი უნდა იყოს {{- minimum, datetime}}-ზე მეტი",
      },
    },
    too_big: {
      array: {
        exact: "მასივი უნდა შეიცავდეს ზუსტად {{maximum}} ელემენტ(ებ)ს",
        inclusive: "მასივი უნდა შეიცავდეს მაქსიმუმ {{maximum}} ელემენტ(ებ)ს",
        not_inclusive:
          "მასივი უნდა შეიცავდეს {{maximum}}-ზე ნაკლებ ელემენტ(ებ)ს",
      },
      string: {
        exact: "სტრიქონი უნდა შეიცავდეს ზუსტად {{maximum}} სიმბოლო(ებ)ს",
        inclusive: "სტრიქონი უნდა შეიცავდეს მაქსიმუმ {{maximum}} სიმბოლო(ებ)ს",
        not_inclusive:
          "სტრიქონი უნდა შეიცავდეს {{maximum}}-ზე ნაკლებ სიმბოლო(ებ)ს",
      },
      number: {
        exact: "რიცხვი უნდა იყოს ზუსტად {{maximum}}",
        inclusive: "რიცხვი უნდა იყოს {{maximum}}-ზე ნაკლები ან ტოლი",
        not_inclusive: "რიცხვი უნდა იყოს {{maximum}}-ზე ნაკლები",
      },
      set: {
        exact: "არასწორი შეყვანა",
        inclusive: "არასწორი შეყვანა",
        not_inclusive: "არასწორი შეყვანა",
      },
      date: {
        exact: "თარიღი უნდა იყოს ზუსტად {{- maximum, datetime}}",
        inclusive:
          "თარიღი უნდა იყოს {{- maximum, datetime}}-ზე ნაკლები ან ტოლი",
        not_inclusive: "თარიღი უნდა იყოს {{- maximum, datetime}}-ზე ნაკლები",
      },
    },
  },
  validations: {
    email: "ელ-ფოსტა",
    url: "ბმული",
    uuid: "uuid",
    cuid: "cuid",
    regex: "რეგულარული გამოსახულება",
    datetime: "თარიღი და დრო",
  },
  types: {
    function: "ფუნქცია",
    number: "რიცხვი",
    string: "სტრიქონი",
    nan: "არა-რიცხვი",
    integer: "მთელი რიცხვი",
    float: "წილადი რიცხვი",
    boolean: "ლოგიკური",
    date: "თარიღი",
    bigint: "დიდი მთელი რიცხვი",
    undefined: "განუსაზღვრელი",
    symbol: "სიმბოლო",
    null: "ნალი",
    array: "მასივი",
    object: "ობიექტი",
    unknown: "უცნობი",
    promise: "დაპირება",
    void: "ცარიელი",
    never: "არასდროს",
    map: "რუკა",
    set: "სიმრავლე",
  },
};

const dataMap: Record<AvailableLanguageTag, typeof data> = {
  en: data,
  ka: dataKa,
};

const t = (
  locale: AvailableLanguageTag,
  key: string,
  options?: {
    defaultValue?: string;
    [key: string]: any;
  }
): string => {
  // get based on locale maybe dunno
  let result = dataMap[locale];

  const parts = key.split(".");

  // Navigate through the nested object structure
  for (const part of parts) {
    if (result && typeof result === "object" && part in result) {
      // @ts-ignore
      result = result[part];
    } else {
      // Key not found in data, return default value or key itself
      return options?.defaultValue || key;
    }
  }

  // If we found a string value, process any variable replacements
  if (typeof result === "string" && options) {
    return Object.entries(options).reduce<string>((acc, [k, value]) => {
      // Skip special options
      if (k === "defaultValue") return acc;

      // Handle standard variables like {{variable}}
      const standardPattern = new RegExp(`{{\\s*${k}\\s*}}`, "g");

      // Handle variables with dash prefix like {{- variable}}
      const dashPattern = new RegExp(`{{-\\s*${k}\\s*}}`, "g");

      // Handle complex expressions like {{- variable, datetime}}
      const complexPattern = new RegExp(`{{-\\s*${k}(,\\s*[\\w]+)?\\s*}}`, "g");

      acc = acc.replace(standardPattern, String(value));
      acc = acc.replace(dashPattern, String(value));
      acc = acc.replace(complexPattern, String(value));

      return acc;
    }, result);
  }

  // Return the result or fallback
  return typeof result === "string" ? result : options?.defaultValue || key;
};

const jsonStringifyReplacer = (_: string, value: any): any => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
};

function joinValues<T extends any[]>(array: T, separator = " | "): string {
  return array
    .map((val) => (typeof val === "string" ? `'${val}'` : val))
    .join(separator);
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) return false;

  for (const key in value) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) return false;
  }

  return true;
};

const getKeyAndValues = (
  param: unknown,
  defaultKey: string
): {
  values: Record<string, unknown>;
  key: string;
} => {
  if (typeof param === "string") return { key: param, values: {} };

  if (isRecord(param)) {
    const key =
      "key" in param && typeof param.key === "string" ? param.key : defaultKey;
    const values =
      "values" in param && isRecord(param.values) ? param.values : {};
    return { key, values };
  }

  return { key: defaultKey, values: {} };
};

export const makeZodI18nMap: (locale: AvailableLanguageTag) => ZodErrorMap =
  (locale) => (issue, ctx) => {
    let message: string;
    message = defaultErrorMap(issue, ctx).message;

    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        if (issue.received === ZodParsedType.undefined) {
          message = t(locale, "errors.invalid_type_received_undefined", {
            defaultValue: message,
          });
        } else if (issue.received === ZodParsedType.null) {
          message = t(locale, "errors.invalid_type_received_null", {
            defaultValue: message,
          });
        } else {
          message = t(locale, "errors.invalid_type", {
            expected: t(locale, `types.${issue.expected}`, {
              defaultValue: issue.expected,
            }),
            received: t(locale, `types.${issue.received}`, {
              defaultValue: issue.received,
            }),
            defaultValue: message,
          });
        }
        break;
      case ZodIssueCode.invalid_literal:
        message = t(locale, "errors.invalid_literal", {
          expected: JSON.stringify(issue.expected, jsonStringifyReplacer),
          defaultValue: message,
        });
        break;
      case ZodIssueCode.unrecognized_keys:
        message = t(locale, "errors.unrecognized_keys", {
          keys: joinValues(issue.keys, ", "),
          count: issue.keys.length,
          defaultValue: message,
        });
        break;
      case ZodIssueCode.invalid_union:
        message = t(locale, "errors.invalid_union", {
          defaultValue: message,
        });
        break;
      case ZodIssueCode.invalid_union_discriminator:
        message = t(locale, "errors.invalid_union_discriminator", {
          options: joinValues(issue.options),
          defaultValue: message,
        });
        break;
      case ZodIssueCode.invalid_enum_value:
        message = t(locale, "errors.invalid_enum_value", {
          options: joinValues(issue.options),
          received: issue.received,
          defaultValue: message,
        });
        break;
      case ZodIssueCode.invalid_arguments:
        message = t(locale, "errors.invalid_arguments", {
          defaultValue: message,
        });
        break;
      case ZodIssueCode.invalid_return_type:
        message = t(locale, "errors.invalid_return_type", {
          defaultValue: message,
        });
        break;
      case ZodIssueCode.invalid_date:
        message = t(locale, "errors.invalid_date", {
          defaultValue: message,
        });
        break;
      case ZodIssueCode.invalid_string:
        if (typeof issue.validation === "object") {
          if ("startsWith" in issue.validation) {
            message = t(locale, `errors.invalid_string.startsWith`, {
              startsWith: issue.validation.startsWith,
              defaultValue: message,
            });
          } else if ("endsWith" in issue.validation) {
            message = t(locale, `errors.invalid_string.endsWith`, {
              endsWith: issue.validation.endsWith,
              defaultValue: message,
            });
          }
        } else {
          message = t(locale, `errors.invalid_string.${issue.validation}`, {
            validation: t(locale, `validations.${issue.validation}`, {
              defaultValue: issue.validation,
            }),
            defaultValue: message,
          });
        }
        break;
      case ZodIssueCode.too_small:
        const minimum =
          issue.type === "date"
            ? new Date(issue.minimum as number)
            : issue.minimum;
        message = t(
          locale,
          `errors.too_small.${issue.type}.${
            issue.exact
              ? "exact"
              : issue.inclusive
              ? "inclusive"
              : "not_inclusive"
          }`,
          {
            minimum,
            count: typeof minimum === "number" ? minimum : undefined,
            defaultValue: message,
          }
        );
        break;
      case ZodIssueCode.too_big:
        const maximum =
          issue.type === "date"
            ? new Date(issue.maximum as number)
            : issue.maximum;
        message = t(
          locale,
          `errors.too_big.${issue.type}.${
            issue.exact
              ? "exact"
              : issue.inclusive
              ? "inclusive"
              : "not_inclusive"
          }`,
          {
            maximum,
            count: typeof maximum === "number" ? maximum : undefined,
            defaultValue: message,
          }
        );
        break;
      case ZodIssueCode.custom:
        const { key, values } = getKeyAndValues(
          issue.params?.i18n,
          "errors.custom"
        );

        message = t(locale, key, {
          ...values,
          defaultValue: message,
        });
        break;
      case ZodIssueCode.invalid_intersection_types:
        message = t(locale, "errors.invalid_intersection_types", {
          defaultValue: message,
        });
        break;
      case ZodIssueCode.not_multiple_of:
        message = t(locale, "errors.not_multiple_of", {
          multipleOf: issue.multipleOf,
          defaultValue: message,
        });
        break;
      case ZodIssueCode.not_finite:
        message = t(locale, "errors.not_finite", {
          defaultValue: message,
        });
        break;
      default:
    }

    return { message };
  };

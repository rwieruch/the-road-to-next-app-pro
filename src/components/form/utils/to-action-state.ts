import { ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionState<T = any> =
  | {
      status?: "SUCCESS" | "ERROR";
      message: string;
      payload?: FormData;
      fieldErrors: Record<string, string[] | undefined>;
      data?: T;
    }
  | null
  | undefined;

export const EMPTY_ACTION_STATE: ActionState = null;

export const fromErrorToActionState = (
  error: unknown,
  formData?: FormData
): ActionState => {
  if (error instanceof ZodError) {
    return {
      status: "ERROR",
      message: "",
      payload: formData,
      fieldErrors: error.flatten().fieldErrors,
    };
  } else if (error instanceof Error) {
    return {
      status: "ERROR",
      message: error.message,
      payload: formData,
      fieldErrors: {},
    };
  } else {
    return {
      status: "ERROR",
      message: "An unknown error occurred",
      payload: formData,
      fieldErrors: {},
    };
  }
};

export const toActionState = (
  status: "SUCCESS" | "ERROR",
  message: string,
  formData?: FormData,
  data?: unknown
): ActionState => {
  return {
    status,
    message,
    fieldErrors: {},
    payload: formData,
    data,
  };
};

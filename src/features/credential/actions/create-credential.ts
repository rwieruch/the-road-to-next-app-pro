"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { credentialsPath } from "@/paths";
import { generateCredential } from "../utils/generate-credential";

const createCredentialSchema = z.object({
  name: z.string().min(1, { message: "Is required" }).max(191),
});

export const createCredential = async (
  organizationId: string,
  _actionState: ActionState,
  formData: FormData
) => {
  await getAdminOrRedirect(organizationId);

  let secret;

  try {
    const { name } = createCredentialSchema.parse({
      name: formData.get("name"),
    });

    secret = await generateCredential(organizationId, name);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(credentialsPath(organizationId));

  return toActionState(
    "SUCCESS",
    `Copy the secret, we will not show it again: ${secret}`
  );
};

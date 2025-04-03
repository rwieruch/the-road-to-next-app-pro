"use client";

import { LucidePlus } from "lucide-react";
import { useActionState, useState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCredential } from "../actions/create-credential";

type CredentialCreateButtonProps = {
  organizationId: string;
};

const CredentialCreateButton = ({
  organizationId,
}: CredentialCreateButtonProps) => {
  const [open, setOpen] = useState(false);

  const [actionState, action] = useActionState(
    createCredential.bind(null, organizationId),
    EMPTY_ACTION_STATE
  );

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <LucidePlus className="w-4 h-4" />
          Create Credential
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Credential</DialogTitle>
          <DialogDescription>
            Create a new API secret for your organization
          </DialogDescription>
        </DialogHeader>
        <Form
          action={action}
          actionState={actionState}
          onSuccess={handleClose}
          toastOptions={{
            duration: Infinity,
            closeButton: true,
          }}
        >
          <div className="grid gap-4 py-4">
            <div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input name="name" id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div />
                <div className="col-span-3">
                  <FieldError actionState={actionState} name="name" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton label="Create" />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { CredentialCreateButton };

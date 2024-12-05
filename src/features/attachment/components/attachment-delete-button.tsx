"use client";

import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { deleteAttachment } from "../actions/delete-attachment";

type AttachmentDeleteButtonProps = {
  id: string;
};

const AttachmentDeleteButton = ({ id }: AttachmentDeleteButtonProps) => {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteAttachment.bind(null, id),
    trigger: (isLoading) =>
      isLoading ? (
        <Button variant="ghost" size="xs">
          <LucideLoaderCircle className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button variant="ghost" size="xs">
          <LucideTrash className="w-4 h-4" />
        </Button>
      ),
  });

  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};

export { AttachmentDeleteButton };

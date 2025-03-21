"use client";

import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { deleteAttachment } from "../actions/delete-attachment";

type AttachmentDeleteButtonProps = {
  id: string;
  onDeleteAttachment?: (id: string) => void;
};

const AttachmentDeleteButton = ({
  id,
  onDeleteAttachment,
}: AttachmentDeleteButtonProps) => {
  const router = useRouter();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteAttachment.bind(null, id),
    trigger: (isPending) => (
      <Button variant="ghost" size="xs">
        {isPending ? (
          <LucideLoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <LucideTrash className="w-4 h-4" />
        )}
      </Button>
    ),
    onSuccess: () => {
      onDeleteAttachment?.(id);
      router.refresh();
    },
  });

  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};

export { AttachmentDeleteButton };

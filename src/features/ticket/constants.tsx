import { LucideCheckCircle, LucideFileText, LucidePencil } from "lucide-react";

export const TICKET_ICONS = {
  OPEN: <LucideFileText />,
  DONE: <LucideCheckCircle />,
  IN_PROGRESS: <LucidePencil />,
};

export const TICKET_STATUS_LABELS = {
  OPEN: "Open",
  DONE: "Done",
  IN_PROGRESS: "In Progress",
};

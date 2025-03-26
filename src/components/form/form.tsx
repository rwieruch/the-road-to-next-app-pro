import { ActionState } from "./utils/to-action-state";

type FormProps = {
  action: (payload: FormData) => void;
  actionState: ActionState;
  children: React.ReactNode;
  onSuccess?: (actionState: ActionState) => void;
  onError?: (actionState: ActionState) => void;
};

// TODO: replace <Form ... > everywhere with <form action={action} className="flex flex-col gap-y-2">
// TODO: then use useCallbacks hook on the action instead

const Form = ({ action, children }: FormProps) => {
  return (
    <form action={action} className="flex flex-col gap-y-2">
      {children}
    </form>
  );
};

export { Form };

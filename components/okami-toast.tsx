import { Toast, ToastDescription, ToastStyleProps, ToastTitle, useToast } from "./ui/toast";

export interface OkamiToastProps {
  uniqueToastId: string;
  title: string;
  description?: string;
  action?: ToastStyleProps["action"];
}

export function OkamiToast({ title, uniqueToastId, action = "muted", description = "" }: OkamiToastProps) {
  return (
    <Toast nativeID={uniqueToastId} action={action} variant="outline" className="mt-10">
      <ToastTitle>{title}</ToastTitle>
      {description && <ToastDescription>{description}</ToastDescription>}
    </Toast>
  );
}

export function useOkamiToast() {
  const toast = useToast();

  function addToast(props: Omit<OkamiToastProps, "uniqueToastId">): string {
    const toastId = Date.now().toString();

    toast.show({
      placement: "top",
      duration: 3000,
      render({ id }) {
        return <OkamiToast {...props} uniqueToastId={id} />;
      },
    });

    return toastId;
  }

  return addToast;
}

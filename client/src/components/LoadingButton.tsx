import { ButtonHTMLAttributes } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps {
  text: string;
  loading: boolean;
  loadingText: string;
}

export default function LoadingButton({
  loading,
  loadingText = "Loading...",
  text,
  ...props
}: LoadingButtonProps & ButtonProps) {
  return (
    <Button {...props} disabled={loading} type="submit">
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        text
      )}
    </Button>
  );
}

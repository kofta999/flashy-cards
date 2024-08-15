import { Button } from "./ui/button";
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
}: LoadingButtonProps) {
  return (
    <Button disabled={loading} type="submit">
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

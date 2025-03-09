
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type AuthFormWrapperProps = {
  children: ReactNode;
  submitText: string;
  toggleText: string;
  onToggleForm: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
};

export function AuthFormWrapper({
  children,
  submitText,
  toggleText,
  onToggleForm,
  onSubmit,
  isLoading,
}: AuthFormWrapperProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-5">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onToggleForm}
          className="w-full sm:w-auto order-2 sm:order-1"
          disabled={isLoading}
        >
          {toggleText}
        </Button>
        <Button 
          type="submit" 
          className="w-full sm:w-auto order-1 sm:order-2"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : submitText}
        </Button>
      </div>
    </form>
  );
}

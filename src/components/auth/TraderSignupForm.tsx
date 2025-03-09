
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { Form } from "@/components/ui/form";
import { UsernamePasswordFields } from "./UsernamePasswordFields";
import { AuthFormWrapper } from "./AuthFormWrapper";

const traderSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^@[a-zA-Z0-9_]+$/, "Username must start with @ and only contain letters, numbers, and underscores"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

type TraderSignupFormProps = {
  onToggleForm: () => void;
  onSuccess: () => void;
};

export function TraderSignupForm({ onToggleForm, onSuccess }: TraderSignupFormProps) {
  const { signUp, isLoading } = useAuth();
  
  const form = useForm<z.infer<typeof traderSchema>>({
    resolver: zodResolver(traderSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof traderSchema>) => {
    try {
      await signUp(data.username, data.password, "trader");
      onSuccess();
    } catch (error) {
      console.error("Auth error:", error);
    }
  };
  
  return (
    <Form {...form}>
      <AuthFormWrapper
        submitText="Create account"
        toggleText="Login instead"
        onToggleForm={onToggleForm}
        onSubmit={form.handleSubmit(onSubmit)}
        isLoading={isLoading}
      >
        <UsernamePasswordFields control={form.control} />
      </AuthFormWrapper>
    </Form>
  );
}

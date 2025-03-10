
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { Form } from "@/components/ui/form";
import { UsernamePasswordFields } from "./UsernamePasswordFields";
import { AuthFormWrapper } from "./AuthFormWrapper";

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^@[a-zA-Z0-9_]+$/, "Username must start with @ and only contain letters, numbers, and underscores"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormProps = {
  onToggleForm: () => void;
  onSuccess: () => void;
};

export function LoginForm({ onToggleForm, onSuccess }: LoginFormProps) {
  const { signIn, isLoading } = useAuth();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await signIn(data.username, data.password);
      onSuccess();
    } catch (error) {
      console.error("Auth error:", error);
    }
  };
  
  return (
    <Form {...form}>
      <AuthFormWrapper
        submitText="Sign in"
        toggleText="Create an account"
        onToggleForm={onToggleForm}
        onSubmit={form.handleSubmit(onSubmit)}
        isLoading={isLoading}
      >
        <UsernamePasswordFields control={form.control} />
      </AuthFormWrapper>
    </Form>
  );
}

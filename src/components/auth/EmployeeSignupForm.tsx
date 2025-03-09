
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { Form } from "@/components/ui/form";
import { UsernamePasswordFields } from "./UsernamePasswordFields";
import { BitcoinAddressField } from "./BitcoinAddressField";
import { AuthFormWrapper } from "./AuthFormWrapper";

const employeeSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^@[a-zA-Z0-9_]+$/, "Username must start with @ and only contain letters, numbers, and underscores"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  bitcoinAddress: z
    .string()
    .min(26, "Bitcoin address must be at least 26 characters")
    .max(60, "Bitcoin address must be at most 60 characters")
    .regex(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/, "Invalid Bitcoin address format"),
});

type EmployeeSignupFormProps = {
  onToggleForm: () => void;
  onSuccess: () => void;
};

export function EmployeeSignupForm({ onToggleForm, onSuccess }: EmployeeSignupFormProps) {
  const { signUp, isLoading } = useAuth();
  
  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      username: "",
      password: "",
      bitcoinAddress: "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof employeeSchema>) => {
    try {
      await signUp(data.username, data.password, "employee", data.bitcoinAddress);
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
        <BitcoinAddressField control={form.control} />
      </AuthFormWrapper>
    </Form>
  );
}

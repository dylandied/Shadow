
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="@username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-5">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onToggleForm}
            className="w-full sm:w-auto order-2 sm:order-1"
            disabled={isLoading}
          >
            Create an account
          </Button>
          <Button 
            type="submit" 
            className="w-full sm:w-auto order-1 sm:order-2"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Sign in"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

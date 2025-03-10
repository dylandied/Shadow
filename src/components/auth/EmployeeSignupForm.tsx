
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bitcoin } from "lucide-react";
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
        
        <FormField
          control={form.control}
          name="bitcoinAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Bitcoin Address <Bitcoin className="h-3 w-3" />
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" 
                  {...field} 
                />
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
            Login instead
          </Button>
          <Button 
            type="submit" 
            className="w-full sm:w-auto order-1 sm:order-2"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Create account"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

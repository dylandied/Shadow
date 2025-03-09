
import { useState } from "react";
import { LogIn, UserPlus, Bitcoin } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define schemas for form validation
const userBaseSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^@[a-zA-Z0-9_]+$/, "Username must start with @ and only contain letters, numbers, and underscores"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

const traderSchema = userBaseSchema;

const employeeSchema = userBaseSchema.extend({
  bitcoinAddress: z
    .string()
    .min(26, "Bitcoin address must be at least 26 characters")
    .max(60, "Bitcoin address must be at most 60 characters")
    .regex(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/, "Invalid Bitcoin address format"),
});

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signIn, signUp, isLoading } = useAuth();
  const [userType, setUserType] = useState<"trader" | "employee">("trader");
  const [isLogin, setIsLogin] = useState(true);
  
  // Initialize forms for both user types
  const traderForm = useForm<z.infer<typeof traderSchema>>({
    resolver: zodResolver(traderSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const employeeForm = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      username: "",
      password: "",
      bitcoinAddress: "",
    },
  });
  
  const onSubmit = async (data: any) => {
    try {
      if (isLogin) {
        // Login logic
        await signIn(data.username, data.password);
        onOpenChange(false);
      } else {
        // Signup logic
        if (userType === "trader") {
          await signUp(data.username, data.password, "trader");
        } else {
          await signUp(data.username, data.password, "employee", data.bitcoinAddress);
        }
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      // Error handling is now in the AuthContext
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? "Sign In" : "Create an Account"}
          </DialogTitle>
          <DialogDescription>
            {isLogin 
              ? "Sign in to your account to access your dashboard" 
              : "Join Insider Edge to access exclusive company insights"}
          </DialogDescription>
        </DialogHeader>
        
        {!isLogin && (
          <Tabs 
            defaultValue="trader" 
            value={userType} 
            onValueChange={(v) => setUserType(v as "trader" | "employee")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="trader" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Trader/Investor</span>
              </TabsTrigger>
              <TabsTrigger value="employee" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Employee</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        {userType === "trader" || isLogin ? (
          <Form {...traderForm}>
            <form onSubmit={traderForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={traderForm.control}
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
                control={traderForm.control}
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
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-5">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                  disabled={isLoading}
                >
                  {isLogin ? "Create an account" : "Login instead"}
                </Button>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto order-1 sm:order-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : isLogin ? "Sign in" : "Create account"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...employeeForm}>
            <form onSubmit={employeeForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={employeeForm.control}
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
                control={employeeForm.control}
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
                control={employeeForm.control}
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
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-5">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                  disabled={isLoading}
                >
                  {isLogin ? "Create an account" : "Login instead"}
                </Button>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto order-1 sm:order-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : isLogin ? "Sign in" : "Create account"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

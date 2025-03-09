
import { useState } from "react";
import { User, Bitcoin } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  email: z
    .string()
    .email("Valid email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

const traderSchema = userBaseSchema;

const employeeSchema = userBaseSchema.extend({
  bitcoinAddress: z
    .string()
    .min(26, "Bitcoin address must be at least 26 characters")
    .max(35, "Bitcoin address must be at most 35 characters")
    .regex(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/, "Invalid Bitcoin address format"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { refreshProfile } = useAuth();
  const [userType, setUserType] = useState<"trader" | "employee">("trader");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize forms for both user types
  const traderForm = useForm<z.infer<typeof traderSchema>>({
    resolver: zodResolver(traderSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const employeeForm = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      bitcoinAddress: "",
    },
  });
  
  const handleLogin = async (data: z.infer<typeof traderSchema>) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Successfully logged in",
        description: "Welcome back!",
      });
      
      await refreshProfile();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (data: any) => {
    setIsLoading(true);
    
    try {
      // Prepare metadata based on user type
      const metadata: Record<string, any> = {};
      
      if (userType === "employee") {
        metadata.is_employee = true;
        metadata.bitcoin_address = data.bitcoinAddress;
        metadata.username = data.username;
        metadata.user_type = "employee";
      } else {
        metadata.is_employee = false;
        metadata.user_type = "trader";
      }
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "You've successfully signed up. Welcome to Insider Edge!",
      });
      
      await refreshProfile();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmit = async (data: any) => {
    if (isLogin) {
      await handleLogin(data);
    } else {
      await handleSignup(data);
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
                <User className="h-4 w-4" />
                <span>Trader/Investor</span>
              </TabsTrigger>
              <TabsTrigger value="employee" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Employee</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        {(userType === "trader" || isLogin) ? (
          <Form {...traderForm}>
            <form onSubmit={traderForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={traderForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={employeeForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
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

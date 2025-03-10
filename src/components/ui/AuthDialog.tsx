
import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LoginForm } from "@/components/auth/LoginForm";
import { TraderSignupForm } from "@/components/auth/TraderSignupForm";
import { EmployeeSignupForm } from "@/components/auth/EmployeeSignupForm";

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"trader" | "employee">("trader");
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };
  
  const handleSuccess = () => {
    onOpenChange(false);
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
        
        {isLogin ? (
          <LoginForm
            onToggleForm={toggleAuthMode}
            onSuccess={handleSuccess}
          />
        ) : userType === "trader" ? (
          <TraderSignupForm
            onToggleForm={toggleAuthMode}
            onSuccess={handleSuccess}
          />
        ) : (
          <EmployeeSignupForm
            onToggleForm={toggleAuthMode}
            onSuccess={handleSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

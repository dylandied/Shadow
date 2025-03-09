
import { useState } from "react";
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type UserBanButtonProps = {
  userId: string;
  username: string;
  onUserBanned: () => void;
};

const UserBanButton = ({ userId, username, onUserBanned }: UserBanButtonProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBanning, setIsBanning] = useState(false);

  const handleBanUser = async () => {
    try {
      setIsBanning(true);
      
      // Call the ban_user RPC function
      const { error } = await supabase.rpc('ban_user', {
        user_id_to_ban: userId
      });
      
      if (error) throw error;
      
      toast({
        title: "User Banned",
        description: `User ${username} has been banned and their content removed`,
      });
      
      onUserBanned();
    } catch (error) {
      console.error("Error banning user:", error);
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive",
      });
    } finally {
      setIsBanning(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-500 hover:bg-red-500/10"
        onClick={() => setIsConfirmOpen(true)}
      >
        <UserX className="h-4 w-4 mr-1" />
        <span>Ban User</span>
      </Button>
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to ban {username}? This will remove all of their comments and replies.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBanning}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanUser}
              disabled={isBanning}
              className="bg-red-500 hover:bg-red-600"
            >
              {isBanning ? "Banning..." : "Ban User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserBanButton;


import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

type AdminCommentActionsProps = {
  commentId: string;
  isReply?: boolean;
  onDeleted: () => void;
  className?: string;
};

const AdminCommentActions = ({
  commentId,
  isReply = false,
  onDeleted,
  className,
}: AdminCommentActionsProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const table = isReply ? 'replies' : 'comments';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${isReply ? "Reply" : "Comment"} has been deleted`,
      });
      
      onDeleted();
    } catch (error) {
      console.error(`Error deleting ${isReply ? "reply" : "comment"}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${isReply ? "reply" : "comment"}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-2 text-xs text-destructive hover:bg-destructive/10",
          className
        )}
        onClick={() => setIsConfirmOpen(true)}
      >
        <Trash2 className="h-3 w-3 mr-1" />
        <span>Delete</span>
      </Button>
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {isReply ? "Reply" : "Comment"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {isReply ? "reply" : "comment"}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminCommentActions;


import { useState } from "react";
import { Bitcoin } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const bitcoinAddressSchema = z.object({
  bitcoinAddress: z
    .string()
    .min(26, "Bitcoin address must be at least 26 characters")
    .max(60, "Bitcoin address must be at most 60 characters")
    .regex(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/, "Invalid Bitcoin address format"),
});

type BitcoinAddressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BitcoinAddressDialog({ open, onOpenChange }: BitcoinAddressDialogProps) {
  const { profile, updateBitcoinAddress, isLoading } = useAuth();
  
  const form = useForm<z.infer<typeof bitcoinAddressSchema>>({
    resolver: zodResolver(bitcoinAddressSchema),
    defaultValues: {
      bitcoinAddress: profile?.bitcoin_address || "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof bitcoinAddressSchema>) => {
    try {
      await updateBitcoinAddress(data.bitcoinAddress);
      onOpenChange(false);
    } catch (error) {
      // Error is handled in the auth context
      console.error("Error updating Bitcoin address:", error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Bitcoin Address</DialogTitle>
          <DialogDescription>
            Change the Bitcoin address where you receive tips from traders and investors.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            
            <DialogFooter className="mt-5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Address"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

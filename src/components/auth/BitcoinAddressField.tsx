
import { Bitcoin } from "lucide-react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type BitcoinAddressFieldProps = {
  control: Control<any>;
};

export function BitcoinAddressField({ control }: BitcoinAddressFieldProps) {
  return (
    <FormField
      control={control}
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
  );
}

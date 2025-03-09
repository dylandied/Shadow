
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Building, Plus, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type AddCompanyFormData = {
  name: string;
  ticker: string;
  industry: string;
};

export function AddCompanyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState<AddCompanyFormData>({ 
    name: "", 
    ticker: "",
    industry: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.ticker.trim()) {
      setError("Company name and ticker symbol are required.");
      return;
    }

    if (!user) {
      setError("You must be logged in to submit a company.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);

      // Check if company already exists
      const { data: existingCompany, error: checkError } = await supabase
        .from('companies')
        .select('id')
        .or(`name.ilike.${formData.name},ticker.ilike.${formData.ticker}`)
        .limit(1);

      if (checkError) throw checkError;

      if (existingCompany && existingCompany.length > 0) {
        setError("This company is already in our database.");
        return;
      }

      // Submit new company
      const { error: insertError } = await supabase
        .from('companies')
        .insert({
          name: formData.name,
          ticker: formData.ticker.toUpperCase(),
          industry: formData.industry || null,
          status: 'pending',
          submitted_by: user.id
        });

      if (insertError) throw insertError;
      
      toast({
        title: "Company submitted",
        description: `${formData.name} (${formData.ticker.toUpperCase()}) has been submitted for review.`,
      });
      
      // Reset form and close dialog
      setFormData({ name: "", ticker: "", industry: "" });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error submitting company:", error);
      setError(error.message || "An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Public Company</DialogTitle>
          <DialogDescription>
            Submit a publicly traded company that isn't already in our database.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Company Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Apple Inc."
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="ticker" className="text-sm font-medium">
              Ticker Symbol
            </label>
            <Input
              id="ticker"
              name="ticker"
              placeholder="e.g., AAPL"
              value={formData.ticker}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="industry" className="text-sm font-medium">
              Industry (Optional)
            </label>
            <Input
              id="industry"
              name="industry"
              placeholder="e.g., Technology"
              value={formData.industry}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          {!user && (
            <div className="bg-amber-500/10 text-amber-500 p-3 rounded-md text-sm">
              You need to log in before submitting a company.
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !user}>
              {isSubmitting ? "Submitting..." : "Submit Company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

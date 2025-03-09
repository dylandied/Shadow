
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Building, Plus, AlertCircle } from "lucide-react";
import { mockCompanies } from "@/data/mockData";

type AddCompanyFormData = {
  name: string;
  ticker: string;
};

export function AddCompanyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState<AddCompanyFormData>({ name: "", ticker: "" });
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateCompany = async (): Promise<boolean> => {
    setIsValidating(true);
    setError(null);

    try {
      // Check if company already exists in our mock data
      if (mockCompanies.some(
        company => 
          company.ticker.toLowerCase() === formData.ticker.toLowerCase() ||
          company.name.toLowerCase() === formData.name.toLowerCase()
      )) {
        setError("This company is already in our database.");
        return false;
      }

      // Simulate API check for valid publicly traded company
      // In a real app, this would call an API to validate the ticker
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, reject some fake tickers
      const invalidTickers = ["FAKE", "TEST", "INVALID"];
      if (invalidTickers.includes(formData.ticker.toUpperCase())) {
        setError("This does not appear to be a valid publicly traded company.");
        return false;
      }

      return true;
    } catch (err) {
      setError("An error occurred during validation.");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.ticker.trim()) {
      setError("Company name and ticker symbol are required.");
      return;
    }
    
    const isValid = await validateCompany();
    
    if (isValid) {
      // In a real app, this would add to the database
      toast({
        title: "Company submitted",
        description: `${formData.name} (${formData.ticker.toUpperCase()}) has been submitted for review.`,
      });
      
      // Reset form and close dialog
      setFormData({ name: "", ticker: "" });
      onOpenChange(false);
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
              disabled={isValidating}
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
              disabled={isValidating}
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isValidating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isValidating}>
              {isValidating ? "Validating..." : "Submit Company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

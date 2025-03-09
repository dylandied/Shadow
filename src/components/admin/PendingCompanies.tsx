
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PendingCompany {
  id: string;
  name: string;
  ticker: string;
  industry: string | null;
  submitted_at: string;
  username: string;
}

const PendingCompanies = () => {
  const [pendingCompanies, setPendingCompanies] = useState<PendingCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  const fetchPendingCompanies = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          ticker,
          industry,
          submitted_at,
          profiles:submitted_by (username)
        `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Transform data to flatten the profiles join
      const formattedData = data.map(item => ({
        id: item.id,
        name: item.name,
        ticker: item.ticker,
        industry: item.industry,
        submitted_at: item.submitted_at,
        username: item.profiles?.username || 'Unknown User'
      }));

      setPendingCompanies(formattedData);
    } catch (error) {
      console.error("Error fetching pending companies:", error);
      toast({
        title: "Error",
        description: "Failed to load pending companies",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      setPendingCompanies(prevCompanies => 
        prevCompanies.filter(company => company.id !== id)
      );
      
      toast({
        title: "Company Approved",
        description: "The company has been approved and is now visible to all users",
      });
    } catch (error) {
      console.error("Error approving company:", error);
      toast({
        title: "Error",
        description: "Failed to approve company",
        variant: "destructive",
      });
    }
  };

  const handleDeclineCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      setPendingCompanies(prevCompanies => 
        prevCompanies.filter(company => company.id !== id)
      );
      
      toast({
        title: "Company Declined",
        description: "The company has been declined",
      });
    } catch (error) {
      console.error("Error declining company:", error);
      toast({
        title: "Error",
        description: "Failed to decline company",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse text-center py-12">Loading pending companies...</div>;
  }

  if (pendingCompanies.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No Pending Companies</h3>
        <p className="text-muted-foreground">There are no companies waiting for approval at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Pending Companies ({pendingCompanies.length})</h2>
      
      {pendingCompanies.map((company) => (
        <Card key={company.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="flex justify-between items-center">
              <div>{company.name} ({company.ticker})</div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                  onClick={() => handleApproveCompany(company.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleDeclineCompany(company.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-semibold">Industry:</span> {company.industry || 'Not specified'}
              </div>
              <div>
                <span className="font-semibold">Submitted by:</span> {company.username}
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold">Submitted at:</span> {new Date(company.submitted_at).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PendingCompanies;

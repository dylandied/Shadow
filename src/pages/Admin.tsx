
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import PendingCompanies from "@/components/admin/PendingCompanies";
import UserManagement from "@/components/admin/UserManagement";

const Admin = () => {
  const { isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("pending-companies");

  // Redirect non-admin users to home
  if (!isLoading && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-16">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs 
        defaultValue="pending-companies" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="pending-companies">Pending Companies</TabsTrigger>
          <TabsTrigger value="user-management">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending-companies">
          <PendingCompanies />
        </TabsContent>
        
        <TabsContent value="user-management">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

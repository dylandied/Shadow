
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Ban, Trash2 } from "lucide-react";

const Admin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingCompanies, setPendingCompanies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/');
          return;
        }
        
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error || profileData.role !== 'admin') {
          throw new Error('Not authorized as admin');
        }
        
        setIsAdmin(true);
        fetchPendingCompanies();
        fetchUsers();
        fetchReportedComments();
      } catch (error) {
        console.error("Admin check error:", error);
        toast({
          title: "Access denied",
          description: "You need admin privileges to access this page",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);

  // Fetch pending companies
  const fetchPendingCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('status', 'pending');
      
      if (error) throw error;
      setPendingCompanies(data || []);
    } catch (error) {
      console.error("Error fetching pending companies:", error);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch reported comments (for this demo, we're just fetching all comments)
  const fetchReportedComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (username),
          companies:company_id (name)
        `);
      
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Approve company
  const approveCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ status: 'approved' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Company approved",
        description: "The company has been approved and is now public",
      });
      
      // Refresh the list
      fetchPendingCompanies();
    } catch (error) {
      console.error("Error approving company:", error);
      toast({
        title: "Approval failed",
        description: "There was an error approving the company",
        variant: "destructive",
      });
    }
  };

  // Reject company
  const rejectCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ status: 'rejected' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Company rejected",
        description: "The company has been rejected",
      });
      
      // Refresh the list
      fetchPendingCompanies();
    } catch (error) {
      console.error("Error rejecting company:", error);
      toast({
        title: "Rejection failed",
        description: "There was an error rejecting the company",
        variant: "destructive",
      });
    }
  };

  // Ban user
  const banUser = async (userId: string) => {
    try {
      // Call the ban_user database function
      const { error } = await supabase.rpc('ban_user', {
        user_id_to_ban: userId
      });
      
      if (error) throw error;
      
      toast({
        title: "User banned",
        description: "The user has been banned and their content removed",
      });
      
      // Refresh the lists
      fetchUsers();
      fetchReportedComments();
    } catch (error) {
      console.error("Error banning user:", error);
      toast({
        title: "Ban failed",
        description: "There was an error banning the user",
        variant: "destructive",
      });
    }
  };

  // Delete comment
  const deleteComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Comment deleted",
        description: "The comment has been removed",
      });
      
      // Refresh the list
      fetchReportedComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Deletion failed",
        description: "There was an error deleting the comment",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Navigate will handle redirection
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="companies" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="companies">Pending Companies</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        
        {/* Companies Tab */}
        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>Pending Companies</CardTitle>
              <CardDescription>
                Review and approve or reject company submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingCompanies.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No pending companies to review
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingCompanies.map((company) => (
                    <div 
                      key={company.id} 
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div>
                        <h3 className="font-medium">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {company.ticker} • {company.industry || 'No industry specified'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted on {new Date(company.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => rejectCompany(company.id)}
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => approveCompany(company.id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No users found
                </p>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.username}</h3>
                          {user.role === 'admin' && (
                            <Badge variant="secondary">Admin</Badge>
                          )}
                          {user.is_employee && (
                            <Badge>Employee</Badge>
                          )}
                          {user.banned && (
                            <Badge variant="destructive">Banned</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user.user_type || 'Trader'} 
                          {user.is_employee && user.bitcoin_address && ' • Has BTC address'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined on {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {!user.banned && user.role !== 'admin' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => banUser(user.id)}
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Ban className="h-4 w-4 mr-1" /> Ban User
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Comments Tab */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comment Management</CardTitle>
              <CardDescription>
                Review and manage user comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No comments found
                </p>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className="border-b pb-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium">
                            {comment.profiles?.username || 'Unknown user'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {comment.companies?.name || 'Unknown company'} • 
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteComment(comment.id)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{comment.upvotes || 0} upvotes</span>
                        <span>•</span>
                        <span>{comment.downvotes || 0} downvotes</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Admin;

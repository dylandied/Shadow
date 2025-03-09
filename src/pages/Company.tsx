
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { mockCompanies, mockComments } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Comment, Company as CompanyType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

// Import refactored components
import CompanyHeader from "@/components/company/CompanyHeader";
import InsightsSection from "@/components/company/InsightsSection";
import DiscussionSection from "@/components/company/DiscussionSection";
import LoadingState from "@/components/company/LoadingState";
import NotFoundState from "@/components/company/NotFoundState";

// Available sort options
type SortOption = "recent" | "upvoted" | "tipped";

const Company = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  
  // Use real auth state
  const { isSignedIn, isEmployee } = useAuth();
  
  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      // Find the company
      const foundCompany = mockCompanies.find(c => c.id === id);
      
      if (foundCompany) {
        // Create a copy of the company with the current timestamp
        const companyWithCurrentTimestamp = {
          ...foundCompany,
          lastUpdate: new Date() // Update timestamp to now
        };
        setCompany(companyWithCurrentTimestamp);
      } else {
        setCompany(null);
      }
      
      // Filter comments for this company
      const companyComments = mockComments
        .filter(c => c.companyId === id)
        .map(comment => ({
          ...comment,
          timestamp: new Date(comment.timestamp)
        }));
      
      // Sort comments based on selected option
      const sortedComments = sortCommentArray(companyComments, sortBy);
      setComments(sortedComments);
      
      setLoading(false);
    };
    
    fetchData();
    
    // Set up real-time listener for comments
    if (id) {
      const commentsChannel = supabase
        .channel('comments-changes')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'comments', filter: `company_id=eq.${id}` },
          (payload) => {
            // Add new comment to the list and resort
            const newComment = payload.new as Comment;
            if (newComment) {
              setComments(prevComments => {
                const updatedComments = [...prevComments, {
                  ...newComment,
                  timestamp: new Date(newComment.timestamp)
                }];
                return sortCommentArray(updatedComments, sortBy);
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(commentsChannel);
      };
    }
  }, [id, sortBy]);
  
  // Sort comments based on the selected option
  const sortCommentArray = (commentsToSort: Comment[], sortOption: SortOption): Comment[] => {
    switch (sortOption) {
      case "upvoted":
        return [...commentsToSort].sort((a, b) => b.upvotes - a.upvotes);
      case "recent":
        return [...commentsToSort].sort((a, b) => {
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          return dateB.getTime() - dateA.getTime();
        });
      case "tipped":
        return [...commentsToSort].sort((a, b) => b.tipAmount - a.tipAmount);
      default:
        return commentsToSort;
    }
  };
  
  // Handle sort option change
  const handleSortChange = (option: string) => {
    setSortBy(option as SortOption);
  };
  
  // Handle new comment submission
  const handleSubmitComment = async (content: string) => {
    if (!isSignedIn || !isEmployee) {
      toast({
        title: "Permission denied",
        description: "Only signed-in employees can post comments.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      
      if (!userId || !id) {
        throw new Error("User ID or company ID is missing");
      }
      
      // Insert comment to Supabase
      const { data, error } = await supabase
        .from('comments')
        .insert({
          company_id: id,
          user_id: userId,
          content: content,
          upvotes: 0,
          downvotes: 0
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // For demo purposes, create a client-side comment object
      const newComment: Comment = {
        id: data.id,
        companyId: id,
        username: "Current User", // This would normally come from the profile
        content: content,
        isEmployee: isEmployee,
        upvotes: 0,
        downvotes: 0,
        timestamp: new Date(),
        userReputation: "trusted",
        replies: [],
        tipAmount: 0
      };
      
      // Add the new comment to the list (realtime subscription should handle this too)
      const updatedComments = [newComment, ...comments];
      setComments(sortCommentArray(updatedComments, sortBy));
      
      // Update company meta data (this would be handled by triggers in a real implementation)
      if (company) {
        setCompany(prev => ({
          ...prev!,
          insidersCount: prev!.insidersCount + 1,
          lastUpdate: new Date()
        }));
      }
      
      // Show a toast notification
      toast({
        title: "Comment posted",
        description: "Your comment has been successfully posted.",
      });
      
    } catch (error: any) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to post comment",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (!company) {
    return <NotFoundState />;
  }
  
  return (
    <div className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-16">
      <CompanyHeader company={company} />
      <InsightsSection 
        companyId={company.id}
        isEmployee={isEmployee}
        isSignedIn={isSignedIn}
      />
      <DiscussionSection 
        comments={comments}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onSubmitComment={handleSubmitComment}
        isEmployee={isEmployee}
        isSignedIn={isSignedIn}
      />
    </div>
  );
};

export default Company;

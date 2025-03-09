
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { mockCompanies, mockComments } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Comment, Company as CompanyType } from "@/types";

// Import refactored components
import CompanyHeader from "@/components/company/CompanyHeader";
import InsightsSection from "@/components/company/InsightsSection";
import { DiscussionSection } from "@/components/company/DiscussionSection";
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
  
  // For demo purposes, simulate whether user is an employee
  const [isEmployee, setIsEmployee] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  
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
      
      // Filter comments for this company, ONLY showing employee comments
      const companyComments = mockComments
        .filter(c => c.companyId === id && c.isEmployee === true) // Only show employee comments
        .map(comment => {
          // Add trusted badge for comments with 20+ upvotes
          const userReputation = comment.upvotes >= 20 ? "trusted" : comment.userReputation;
          
          return {
            ...comment,
            timestamp: new Date(comment.timestamp),
            userReputation
          };
        });
      
      // Sort comments based on selected option
      const sortedComments = sortCommentArray(companyComments, sortBy);
      setComments(sortedComments);
      
      // For demo, randomly decide if the user is signed in and an employee
      setIsSignedIn(Math.random() > 0.5);
      setIsEmployee(Math.random() > 0.7);
      
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
            // Add new comment to the list and resort only if it's from an employee
            const newComment = payload.new as Comment;
            if (newComment && newComment.isEmployee) {
              // Add trusted badge if upvotes >= 20
              const userRep = newComment.upvotes >= 20 ? "trusted" : newComment.userReputation;
              
              setComments(prevComments => {
                const updatedComments = [...prevComments, {
                  ...newComment,
                  timestamp: new Date(newComment.timestamp),
                  userReputation: userRep
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
  const handleSubmitComment = (content: string) => {
    // Create a new comment object
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      companyId: id || '',
      username: "Current User",
      content: content,
      isEmployee: true, // All comments are now from employees
      upvotes: 0,
      downvotes: 0,
      timestamp: new Date(),
      userReputation: "new", // New comments start as "new"
      replies: [],
      tipAmount: 0
    };
    
    // Add the new comment to the list
    const updatedComments = [newComment, ...comments];
    setComments(sortCommentArray(updatedComments, sortBy));
    
    // If the user is an employee, update the company's insider count and timestamp
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
        isEmployee={true} // All insights are now visible
        isSignedIn={true} // All users can now see insights
      />
      <DiscussionSection 
        comments={comments}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onSubmitComment={handleSubmitComment}
      />
    </div>
  );
};

export default Company;

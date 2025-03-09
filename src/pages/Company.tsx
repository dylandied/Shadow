
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { mockCompanies, mockComments } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import refactored components
import CompanyHeader from "@/components/company/CompanyHeader";
import InsightsSection from "@/components/company/InsightsSection";
import DiscussionSection from "@/components/company/DiscussionSection";
import LoadingState from "@/components/company/LoadingState";
import NotFoundState from "@/components/company/NotFoundState";

const Company = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  // For demo purposes, simulate whether user is an employee
  const [isEmployee, setIsEmployee] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  
  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
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
      const companyComments = mockComments.filter(c => c.companyId === id);
      
      // Sort comments based on selected option
      sortComments(companyComments, sortBy);
      
      // For demo, randomly decide if the user is signed in and an employee
      setIsSignedIn(Math.random() > 0.5);
      setIsEmployee(Math.random() > 0.7);
      
      setLoading(false);
    }, 500);
    
    // Set up real-time listener for comments
    if (id) {
      const commentsChannel = supabase
        .channel('comments-changes')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'comments', filter: `company_id=eq.${id}` },
          (payload) => {
            // Add new comment to the list and resort
            const newComment = payload.new;
            if (newComment) {
              setComments(prevComments => {
                const updatedComments = [...prevComments, newComment];
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
  
  const sortCommentArray = (commentsToSort: any[], sortOption: string) => {
    let sorted;
    switch (sortOption) {
      case "upvoted":
        sorted = [...commentsToSort].sort((a, b) => b.upvotes - a.upvotes);
        break;
      case "recent":
        sorted = [...commentsToSort].sort((a, b) => {
          const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
          const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case "tipped":
        sorted = [...commentsToSort].sort((a, b) => b.tipAmount - a.tipAmount);
        break;
      default:
        sorted = commentsToSort;
    }
    return sorted;
  };
  
  const sortComments = (commentsToSort: any[], sortOption: string) => {
    const sorted = sortCommentArray(commentsToSort, sortOption);
    setComments(sorted);
  };
  
  const handleSortChange = (option: string) => {
    setSortBy(option);
    sortComments(comments, option);
  };
  
  const handleSubmitComment = (content: string) => {
    // In a real application, this would make an API call to save the comment
    console.log("New comment:", content);
    
    // Create a new comment object
    const newComment = {
      id: `comment-${Date.now()}`,
      companyId: id,
      username: "Current User",
      content: content,
      isEmployee: isEmployee,
      upvotes: 0,
      downvotes: 0,
      timestamp: new Date(),
      userReputation: "trusted"
    };
    
    // Add the new comment to the list
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    
    // If the user is an employee, update the company's insider count and timestamp
    if (isEmployee && company) {
      setCompany(prev => ({
        ...prev,
        insidersCount: prev.insidersCount + 1,
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

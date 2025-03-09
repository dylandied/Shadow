
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
      setCompany(foundCompany || null);
      
      // Filter comments for this company
      const companyComments = mockComments.filter(c => c.companyId === id);
      
      // Sort comments based on selected option
      sortComments(companyComments, sortBy);
      
      // For demo, randomly decide if the user is signed in and an employee
      setIsSignedIn(Math.random() > 0.5);
      setIsEmployee(Math.random() > 0.7);
      
      setLoading(false);
    }, 500);
  }, [id]);
  
  useEffect(() => {
    if (!company || !id) return;
    
    // Subscribe to real-time company updates
    const companyChannel = supabase
      .channel('company-detail-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'companies',
          filter: `id=eq.${id}`
        },
        (payload) => {
          if (payload.new) {
            setCompany(prevCompany => ({
              ...prevCompany,
              ...payload.new,
              lastUpdate: payload.new.last_update ? new Date(payload.new.last_update) : prevCompany.lastUpdate,
            }));
          }
        }
      )
      .subscribe();
      
    // Subscribe to real-time comment updates
    const commentsChannel = supabase
      .channel('company-comments-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `company_id=eq.${id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            // Add new comment to the list
            const newComment = {
              id: payload.new.id,
              companyId: payload.new.company_id,
              content: payload.new.content,
              username: "Employee", // In a real app, you'd get this from payload or a separate query
              isEmployee: true,
              upvotes: payload.new.upvotes || 0,
              downvotes: payload.new.downvotes || 0,
              timestamp: new Date(payload.new.created_at),
              userReputation: "trusted",
              replies: []
            };
            
            setComments(prevComments => {
              const updatedComments = [newComment, ...prevComments];
              sortComments(updatedComments, sortBy);
              return updatedComments;
            });
            
            // Update company metadata
            setCompany(prevCompany => ({
              ...prevCompany,
              insidersCount: prevCompany.insidersCount + 1,
              postsCount: prevCompany.postsCount + 1,
              lastUpdate: new Date()
            }));
          }
        }
      )
      .subscribe();
      
    // Subscribe to real-time vote updates
    const votesChannel = supabase
      .channel('company-votes-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'insight_votes',
          filter: `company_id=eq.${id}`
        },
        () => {
          // Update company insiders count for new votes
          setCompany(prevCompany => ({
            ...prevCompany,
            insidersCount: prevCompany.insidersCount + 1,
            lastUpdate: new Date()
          }));
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(companyChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(votesChannel);
    };
  }, [company, id, sortBy]);
  
  const sortComments = (commentsToSort: any[], sortOption: string) => {
    let sorted;
    switch (sortOption) {
      case "upvoted":
        sorted = [...commentsToSort].sort((a, b) => b.upvotes - a.upvotes);
        break;
      case "recent":
        sorted = [...commentsToSort].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        break;
      case "tipped":
        sorted = [...commentsToSort].sort((a, b) => b.tipAmount - a.tipAmount);
        break;
      default:
        sorted = commentsToSort;
    }
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
      userReputation: "trusted",
      replies: []
    };
    
    // Add the new comment to the list
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    
    // Update company metadata
    setCompany(prevCompany => ({
      ...prevCompany,
      insidersCount: prevCompany.insidersCount + 1,
      postsCount: prevCompany.postsCount + 1,
      lastUpdate: new Date()
    }));
    
    // Show a toast notification
    toast({
      title: "Comment posted",
      description: "Your comment has been successfully posted.",
    });
    
    // In a real app, you would also trigger the database insert here
    // which would then be picked up by the real-time subscription
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

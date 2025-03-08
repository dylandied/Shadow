
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { mockCompanies, mockComments } from "@/data/mockData";

// Import refactored components
import CompanyHeader from "@/components/company/CompanyHeader";
import InsightsSection from "@/components/company/InsightsSection";
import DiscussionSection from "@/components/company/DiscussionSection";
import LoadingState from "@/components/company/LoadingState";
import NotFoundState from "@/components/company/NotFoundState";
import { toast } from "@/hooks/use-toast";

const Company = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  
  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      const foundCompany = mockCompanies.find(c => c.id === id);
      setCompany(foundCompany || null);
      
      // Filter comments for this company
      const companyComments = mockComments.filter(c => c.companyId === id);
      
      // Sort comments based on selected option
      sortComments(companyComments, sortBy);
      
      setLoading(false);
    }, 500);
  }, [id]);
  
  const sortComments = (commentsToSort: any[], sortOption: string) => {
    let sorted;
    switch (sortOption) {
      case "upvoted":
        // First sort by upvotes, then by recency
        sorted = [...commentsToSort].sort((a, b) => {
          const upvoteDiff = b.upvotes - a.upvotes;
          if (upvoteDiff !== 0) return upvoteDiff;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        break;
      case "recent":
        sorted = [...commentsToSort].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case "tipped":
        // First sort by tipAmount, then by recency
        sorted = [...commentsToSort].sort((a, b) => {
          const tipDiff = b.tipAmount - a.tipAmount;
          if (tipDiff !== 0) return tipDiff;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        break;
      default:
        sorted = [...commentsToSort].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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
    
    // Simulate adding a new comment
    const newComment = {
      id: `comment${comments.length + 1}`,
      companyId: id,
      username: "CurrentUser",
      content: content,
      isEmployee: false,
      upvotes: 0,
      downvotes: 0,
      tipAmount: 0,
      timestamp: new Date(),
      replies: [],
    };
    
    // Add the new comment and resort
    const updatedComments = [...comments, newComment];
    sortComments(updatedComments, sortBy);
    
    toast({
      title: "Comment submitted",
      description: "Your comment has been posted.",
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
      {/* Company Header */}
      <CompanyHeader company={company} />
      
      {/* Insight Cards */}
      <InsightsSection />
      
      {/* Comments Section */}
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

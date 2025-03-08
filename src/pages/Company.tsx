
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { mockCompanies, mockComments } from "@/data/mockData";

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

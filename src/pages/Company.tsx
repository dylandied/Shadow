
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InsightCard from "@/components/ui/InsightCard";
import Comment from "@/components/ui/Comment";
import { mockCompanies, mockComments } from "@/data/mockData";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const Company = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
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
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would make an API call to save the comment
    console.log("New comment:", commentText);
    setCommentText("");
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-muted-foreground animate-pulse">Loading company information...</p>
        </div>
      </div>
    );
  }
  
  if (!company) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Company Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The company you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      {/* Company Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          <span>Back to Directory</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-12 h-12 mr-4 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 mr-4 rounded-full bg-accent flex items-center justify-center text-lg font-medium">
                {company.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <p className="text-muted-foreground">{company.ticker} • {company.industry}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground mr-2">
              {company.insidersCount} {company.insidersCount === 1 ? "insider" : "insiders"} •
              Last update: {company.lastUpdate.toLocaleDateString()}
            </div>
            
            {company.isHot && (
              <span className="badge-hot">Hot</span>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Insight Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        <motion.div variants={itemVariants}>
          <InsightCard
            type="sales"
            title="Sales Trends"
            value="Up 10%"
            change="up"
            sourcesCount={5}
            lastUpdated="2 hours ago"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <InsightCard
            type="traffic"
            title="Foot Traffic"
            value="Moderate"
            change="down"
            sourcesCount={3}
            lastUpdated="1 day ago"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <InsightCard
            type="satisfaction"
            title="Employee Satisfaction"
            value="3.8/5"
            change="neutral"
            sourcesCount={8}
            lastUpdated="5 days ago"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <InsightCard
            type="news"
            title="Upcoming News"
            value="Positive"
            change="up"
            sourcesCount={4}
            lastUpdated="3 hours ago"
          />
        </motion.div>
      </motion.div>
      
      {/* Comments Section */}
      <div className="bg-card border border-border rounded-lg shadow-sm p-6">
        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="discussions">
              <MessageSquare className="h-4 w-4 mr-2" />
              Discussions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="discussions">
            {/* Sorting Options */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Insider Insights</h3>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={sortBy === "recent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange("recent")}
                >
                  Recent
                </Button>
                <Button
                  variant={sortBy === "upvoted" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange("upvoted")}
                >
                  Most Upvoted
                </Button>
                <Button
                  variant={sortBy === "tipped" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange("tipped")}
                >
                  Most Tipped
                </Button>
              </div>
            </div>
            
            {/* Add Comment Form */}
            <div className="mb-8">
              <form onSubmit={handleSubmitComment}>
                <div className="border border-border rounded-lg overflow-hidden mb-3">
                  <textarea
                    className="w-full p-4 bg-background resize-none focus:outline-none"
                    placeholder="Share your insights or ask a question..."
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={!commentText.trim()}>
                    Post Comment
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Comments List */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    id={comment.id}
                    username={comment.username}
                    content={comment.content}
                    bitcoinAddress={comment.isEmployee ? comment.bitcoinAddress : undefined}
                    isEmployee={comment.isEmployee}
                    upvotes={comment.upvotes}
                    downvotes={comment.downvotes}
                    timestamp={comment.timestamp}
                    replies={comment.replies}
                    userReputation={comment.userReputation}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No comments yet. Be the first to share an insight!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Company;

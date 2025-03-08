import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { mockCompanies, mockComments } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const generateMockPriceData = (basePrice: number, volatility: number = 0.05) => {
  const today = new Date();
  const data = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    const randomChange = (Math.random() * 2 - 1) * volatility;
    const priceMovement = basePrice * randomChange;
    
    basePrice += priceMovement;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(basePrice.toFixed(2))
    });
  }
  
  return data;
};

const Company = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [priceData, setPriceData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<{ value: number; percentage: number; direction: "up" | "down" | "neutral" }>({
    value: 0,
    percentage: 0,
    direction: "neutral"
  });
  
  useEffect(() => {
    setTimeout(() => {
      const foundCompany = mockCompanies.find(c => c.id === id);
      setCompany(foundCompany || null);
      
      const companyComments = mockComments.filter(c => c.companyId === id);
      sortComments(companyComments, sortBy);
      
      if (foundCompany) {
        const basePrice = (foundCompany.ticker.charCodeAt(0) + 
                          foundCompany.ticker.charCodeAt(1) + 
                          foundCompany.ticker.charCodeAt(2)) / 3 * 10;
        
        const data = generateMockPriceData(basePrice);
        setPriceData(data);
        
        const lastPrice = data[data.length - 1].price;
        const previousPrice = data[data.length - 2].price;
        setCurrentPrice(lastPrice);
        
        const priceChangeValue = lastPrice - previousPrice;
        const priceChangePercentage = (priceChangeValue / previousPrice) * 100;
        
        setPriceChange({
          value: parseFloat(priceChangeValue.toFixed(2)),
          percentage: parseFloat(priceChangePercentage.toFixed(2)),
          direction: priceChangeValue >= 0 ? "up" : "down"
        });
      }
      
      setLoading(false);
    }, 500);
  }, [id]);
  
  const sortComments = (commentsToSort: any[], sortOption: string) => {
    let sorted;
    switch (sortOption) {
      case "upvoted":
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
    console.log("New comment:", content);
    
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
      <CompanyHeader 
        company={company} 
        price={currentPrice} 
        priceChange={priceChange}
      />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>30-Day Price History</span>
            <div className="flex items-center">
              <span className={`text-base ${priceChange.direction === 'up' ? 'text-insight-positive' : 'text-insight-negative'}`}>
                ${currentPrice?.toFixed(2)}
              </span>
              <div className={`ml-2 flex items-center text-sm ${priceChange.direction === 'up' ? 'text-insight-positive' : 'text-insight-negative'}`}>
                {priceChange.direction === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span>${Math.abs(priceChange.value)} ({Math.abs(priceChange.percentage)}%)</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={priceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value}`, 'Price']}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString();
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={priceChange.direction === 'up' ? "#10b981" : "#ef4444"} 
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <InsightsSection priceData={priceData} currentPrice={currentPrice} priceChange={priceChange} />
      
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

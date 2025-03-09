
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SearchBar from "@/components/ui/SearchBar";
import { mockCompanies } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
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

const Home = () => {
  const [filter, setFilter] = useState("all");
  const [companies, setCompanies] = useState(mockCompanies);
  
  // Apply filtering to companies
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    
    if (newFilter === "all") {
      setCompanies(mockCompanies);
    } else if (newFilter === "trending") {
      setCompanies([...mockCompanies].sort((a, b) => b.activityLevel - a.activityLevel));
    } else if (newFilter === "new") {
      setCompanies([...mockCompanies].sort((a, b) => b.lastUpdate.getTime() - a.lastUpdate.getTime()));
    }
  };
  
  useEffect(() => {
    // Subscribe to real-time updates for companies
    const channel = supabase
      .channel('companies-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'companies'
        },
        (payload) => {
          // Update companies when changes occur
          if (payload.new) {
            setCompanies(prevCompanies => {
              // Find if company already exists in our list
              const existingIndex = prevCompanies.findIndex(c => c.id === payload.new.id);
              
              if (existingIndex >= 0) {
                // Update existing company
                const updatedCompanies = [...prevCompanies];
                updatedCompanies[existingIndex] = {
                  ...updatedCompanies[existingIndex],
                  ...payload.new,
                  lastUpdate: payload.new.last_update ? new Date(payload.new.last_update) : new Date(),
                };
                return updatedCompanies;
              } else {
                // Add new company (in real app, you would format the data properly)
                return [...prevCompanies, {
                  ...payload.new,
                  id: payload.new.id,
                  name: payload.new.name,
                  ticker: payload.new.ticker,
                  industry: payload.new.industry || "Unknown",
                  logo: payload.new.logo_url,
                  insidersCount: 0,
                  postsCount: 0,
                  lastUpdate: payload.new.last_update ? new Date(payload.new.last_update) : new Date(),
                  isNew: true,
                  isHot: false,
                  activityLevel: 0
                }];
              }
            });
          }
        }
      )
      .subscribe();
      
    // Subscribe to real-time updates for insiders count (comments)
    const commentsChannel = supabase
      .channel('comments-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments'
        },
        (payload) => {
          if (payload.new && payload.new.company_id) {
            // Update company data when a new comment is added
            setCompanies(prevCompanies => {
              return prevCompanies.map(company => {
                if (company.id === payload.new.company_id) {
                  return {
                    ...company,
                    insidersCount: company.insidersCount + 1,
                    postsCount: company.postsCount + 1,
                    activityLevel: company.activityLevel + 1,
                    lastUpdate: new Date()
                  };
                }
                return company;
              });
            });
          }
        }
      )
      .subscribe();
      
    // Subscribe to real-time updates for insiders count (votes)
    const votesChannel = supabase
      .channel('votes-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'insight_votes'
        },
        (payload) => {
          if (payload.new && payload.new.company_id) {
            // Update company data when a new vote is added
            setCompanies(prevCompanies => {
              return prevCompanies.map(company => {
                if (company.id === payload.new.company_id) {
                  return {
                    ...company,
                    insidersCount: company.insidersCount + 1,
                    activityLevel: company.activityLevel + 1,
                    lastUpdate: new Date()
                  };
                }
                return company;
              });
            });
          }
        }
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(votesChannel);
    };
  }, []);
  
  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Inside Knowledge,{" "}
            <span className="text-insight-neutral">Better Decisions</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect with employees for valuable insights before they become official.
            Anonymous, secure, and ahead of the market.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <SearchBar />
        </motion.div>
      </section>
      
      {/* Company Directory */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">Company Directory</h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "trending" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("trending")}
            >
              Trending
            </Button>
            <Button
              variant={filter === "new" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("new")}
            >
              New Activity
            </Button>
          </div>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {companies.map((company) => (
            <motion.div key={company.id} variants={itemVariants}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-8 h-8 mr-3 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 mr-3 rounded-full bg-accent flex items-center justify-center text-sm font-medium">
                          {company.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                        <CardDescription>{company.ticker}</CardDescription>
                      </div>
                    </div>
                    {company.isHot && (
                      <span className="badge-hot">Hot</span>
                    )}
                    {!company.isHot && company.isNew && (
                      <span className="badge-new">New</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {company.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    {company.insidersCount} {company.insidersCount === 1 ? "insider" : "insiders"}
                    <span className="mx-2">•</span>
                    {company.postsCount} {company.postsCount === 1 ? "post" : "posts"}
                  </div>
                  <Link to={`/company/${company.id}`}>
                    <Button variant="ghost" size="sm" className="hover-lift">
                      <span>View</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;

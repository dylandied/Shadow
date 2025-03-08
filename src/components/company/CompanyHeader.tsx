
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

type CompanyHeaderProps = {
  company: any;
  price?: number | null;
  priceChange?: {
    value: number;
    percentage: number;
    direction: "up" | "down" | "neutral";
  };
};

const CompanyHeader = ({ company, price, priceChange }: CompanyHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 sm:mb-8"
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
              className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full bg-accent flex items-center justify-center text-lg font-medium">
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold">{company.name}</h1>
              {price && priceChange && (
                <div className="ml-4 flex items-center">
                  <span className="font-semibold">${price.toFixed(2)}</span>
                  <div className={`ml-2 flex items-center text-sm ${priceChange.direction === 'up' ? 'text-insight-positive' : 'text-insight-negative'}`}>
                    {priceChange.direction === 'up' ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span>{priceChange.percentage}%</span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{company.ticker} • {company.industry}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs sm:text-sm text-muted-foreground mr-2">
            {company.insidersCount} {company.insidersCount === 1 ? "insider" : "insiders"} •
            Last update: {company.lastUpdate.toLocaleDateString()}
          </div>
          
          {company.isHot && (
            <span className="badge-hot">Hot</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyHeader;

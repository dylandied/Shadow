
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

type CompanyHeaderProps = {
  company: any;
};

const CompanyHeader = ({ company }: CompanyHeaderProps) => {
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
            <h1 className="text-2xl sm:text-3xl font-bold">{company.name}</h1>
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

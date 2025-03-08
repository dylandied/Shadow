
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFoundState = () => {
  return (
    <div className="container mx-auto px-4 pt-24 pb-16 flex items-center justify-center min-h-[50vh]">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>
    </div>
  );
};

export default NotFoundState;


import { motion } from "framer-motion";

const LoadingState = () => {
  return (
    <div className="container mx-auto px-4 pt-24 pb-16 flex items-center justify-center min-h-[50vh]">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-muted-foreground animate-pulse">Loading company information...</p>
      </motion.div>
    </div>
  );
};

export default LoadingState;

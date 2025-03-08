
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-6">How InsiderEdge Works</h1>
        
        <div className="prose prose-lg prose-neutral">
          <p className="text-muted-foreground text-xl mb-8">
            InsiderEdge connects employees with valuable insights to investors seeking an advantage 
            before official reports. Our platform is designed to be anonymous, secure, and 
            user-friendly.
          </p>
          
          <div className="space-y-12 mb-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">For Employees</h2>
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-foreground">
                    <strong>Share Anonymously:</strong> Post insights about your company without revealing your identity.
                  </li>
                  <li className="text-foreground">
                    <strong>Earn Bitcoin Tips:</strong> Receive direct cryptocurrency tips from users who value your insights.
                  </li>
                  <li className="text-foreground">
                    <strong>Build Reputation:</strong> Gain credibility through upvotes and accurate information sharing.
                  </li>
                  <li className="text-foreground">
                    <strong>Minimal Information Required:</strong> Sign up with just a username and Bitcoin address.
                  </li>
                </ul>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">For Investors & Traders</h2>
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-foreground">
                    <strong>No Account Needed:</strong> Access insights without registration.
                  </li>
                  <li className="text-foreground">
                    <strong>Valuable Information:</strong> Get early indicators on sales trends, foot traffic, employee satisfaction, and upcoming news.
                  </li>
                  <li className="text-foreground">
                    <strong>Interactive Platform:</strong> Comment, upvote, and tip valuable contributors.
                  </li>
                  <li className="text-foreground">
                    <strong>Company Directory:</strong> Browse or search for companies of interest.
                  </li>
                </ul>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Approach to Quality</h2>
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-foreground">
                    <strong>Reputation System:</strong> Employee insights are rated by the community, helping to surface the most reliable contributors.
                  </li>
                  <li className="text-foreground">
                    <strong>Community Moderation:</strong> Users can report spam, abuse, or misinformation.
                  </li>
                  <li className="text-foreground">
                    <strong>Aggregated Insights:</strong> Data from multiple sources is combined to provide a more reliable picture.
                  </li>
                </ul>
              </div>
            </section>
          </div>
          
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Important Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              Information shared on InsiderEdge is not financial advice and may be subject to securities laws. 
              Always do your own research before making investment decisions.
            </p>
            <p className="text-muted-foreground">
              Our platform prohibits sharing specific insider trading information (e.g., exact earnings 
              figures before release) and encourages sharing general trends and observations.
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-6">Ready to explore?</h2>
            <Link to="/">
              <Button size="lg" className="hover-lift">
                Browse Companies
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;


import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border mt-12">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-xl font-medium mb-4">
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded">Insider</span>
              <span>Edge</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect with insider knowledge for smarter investment decisions.
            </p>
          </div>
          
          <div className="md:justify-self-end">
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} InsiderEdge. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2 md:mt-0">
            Information shared is not financial advice and may be subject to securities laws.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

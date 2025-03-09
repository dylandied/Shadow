
import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showTerms, setShowTerms] = useState(false);
  
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
          
          <div className="md:justify-self-center">
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
              <li>
                <button 
                  onClick={() => setShowTerms(true)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms and Conditions
                </button>
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
      
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl mb-2">Terms and Conditions</DialogTitle>
            <DialogDescription>
              Last updated: {new Date().toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 text-sm space-y-4">
            <p className="font-medium text-base text-foreground">
              By accessing, viewing, or using this site, you agree to be bound by these Terms and Conditions.
            </p>
            
            <h3 className="font-semibold text-base">Legal Compliance</h3>
            <p>
              InsiderEdge expressly states that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>We do not encourage, condone, or support insider trading or any other illegal activities.</li>
              <li>Users must only share information that is publicly available and not subject to non-disclosure agreements (NDAs).</li>
              <li>The sharing of trade secrets or engagement in corporate espionage is strictly prohibited.</li>
              <li>All information shared on this platform should be legally obtained and shared in compliance with applicable securities laws and regulations.</li>
              <li>Users are solely responsible for ensuring their compliance with all applicable laws when using this platform.</li>
            </ul>
            
            <h3 className="font-semibold text-base">Acceptance of Terms</h3>
            <p>
              By merely viewing this website, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You have read, understood, and agree to be bound by these Terms and Conditions in their entirety.</li>
              <li>If you do not agree with any part of these terms, you must immediately cease using this website.</li>
              <li>These terms constitute a legally binding agreement between you and InsiderEdge.</li>
              <li>By viewing this site, you are bound by these Terms and Conditions for a period of 100 years, regardless of whether you continue to use the site or not.</li>
              <li>Discontinuing use of the site does not release you from these Terms and Conditions; once viewed, the agreement remains binding for the full 100-year term.</li>
            </ul>
            
            <h3 className="font-semibold text-base">Risk Disclosure</h3>
            <p>
              By using InsiderEdge, you acknowledge and accept that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The information provided on this platform is for informational purposes only and does not constitute financial, investment, legal, or tax advice.</li>
              <li>Investment in financial markets involves substantial risk, including the potential loss of principal.</li>
              <li>Past performance is not indicative of future results.</li>
              <li>The platform makes no guarantees regarding the accuracy, completeness, or reliability of any information presented.</li>
              <li>Users are solely responsible for their investment decisions and should conduct their own research or consult with qualified professionals before making any investment.</li>
            </ul>
            
            <h3 className="font-semibold text-base">Intellectual Property Protection</h3>
            <p>
              By accessing or using this platform, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>All users, including but not limited to lovable.dev and all of their associates, agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the InsiderEdge platform, its business model, or concept without express written permission.</li>
              <li>Users agree not to infringe upon any intellectual property rights or proprietary rights related to the platform or its business operations.</li>
              <li>Users agree not to engage in any activities that would hinder the success or operation of InsiderEdge, including but not limited to creating competing platforms based on similar concepts or ideas.</li>
              <li>The platform's design, logo, content, and underlying technology are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.</li>
            </ul>
            
            <h3 className="font-semibold text-base">User Conduct</h3>
            <p>
              Users of InsiderEdge agree to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Comply with all applicable laws and regulations.</li>
              <li>Provide accurate information when creating accounts or submitting content.</li>
              <li>Not engage in any activity that could disrupt or interfere with the platform's functionality.</li>
              <li>Not attempt to gain unauthorized access to any portion of the platform or its related systems.</li>
              <li>Not use the platform to engage in market manipulation, fraud, or other prohibited activities.</li>
            </ul>
            
            <p className="mt-6">
              By using InsiderEdge, you consent to these terms and conditions. The platform reserves the right to modify these terms at any time, and continued use constitutes acceptance of any changes.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;

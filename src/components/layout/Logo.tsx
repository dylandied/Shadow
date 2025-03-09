
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2 text-xl font-medium"
    >
      <span className="bg-primary text-primary-foreground px-2 py-1 rounded">Insider</span>
      <span>Edge</span>
    </Link>
  );
};

export default Logo;

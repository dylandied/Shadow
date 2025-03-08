
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { mockCompanies } from "@/data/mockData";

type SearchResult = {
  id: string;
  name: string;
  ticker: string;
  logo?: string;
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Filter results based on search query
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    
    const filtered = mockCompanies
      .filter(
        company => 
          company.name.toLowerCase().includes(query.toLowerCase()) || 
          company.ticker.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
    
    setResults(filtered);
  }, [query]);
  
  // Handle clicks outside of search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      navigate(`/company/${results[0].id}`);
      setQuery("");
      setIsFocused(false);
    }
  };
  
  const handleResultClick = (companyId: string) => {
    navigate(`/company/${companyId}`);
    setQuery("");
    setIsFocused(false);
  };
  
  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };
  
  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchContainerRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <input
            ref={inputRef}
            type="search"
            className="w-full h-12 pl-10 pr-16 rounded-lg bg-background border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Search company name or ticker symbol..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-12 flex items-center pr-2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          )}
          
          <Button 
            type="submit"
            size="sm"
            variant="ghost"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </form>
      
      <AnimatePresence>
        {isFocused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-2 w-full rounded-lg bg-background border border-border shadow-lg overflow-hidden"
          >
            <ul className="py-1">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleResultClick(result.id)}
                    className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center"
                  >
                    {result.logo ? (
                      <img 
                        src={result.logo} 
                        alt={result.name} 
                        className="w-6 h-6 mr-3 rounded-full" 
                      />
                    ) : (
                      <div className="w-6 h-6 mr-3 rounded-full bg-accent flex items-center justify-center text-xs font-medium">
                        {result.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-xs text-muted-foreground">{result.ticker}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSearchDebounceOptions {

  delay?: number;

  minLength?: number;
  onSearch: (query: string) => void | Promise<void>;

  initialQuery?: string;
}

interface UseSearchDebounceReturn {
  searchQuery: string;
  isSearching: boolean;
  handleSearch: (query: string) => void;

  handleSearchSubmit: () => void;

  clearSearch: () => void;

  isValidQuery: boolean;
}


export function useSearchDebounce({
  delay = 2000,
  minLength = 3,
  onSearch,
  initialQuery = '',
}: UseSearchDebounceOptions): UseSearchDebounceReturn {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isValidQuery = searchQuery.length === 0 || searchQuery.length >= minLength;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.length === 0 || query.length >= minLength) {
      setIsSearching(true);
      debounceTimerRef.current = setTimeout(() => {
        onSearch(query);
        setIsSearching(false);
      }, delay);
    } else {
      setIsSearching(false);
    }
  }, [delay, minLength, onSearch]);

  const handleSearchSubmit = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setIsSearching(false);
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  const clearSearch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    searchQuery,
    isSearching,
    handleSearch,
    handleSearchSubmit,
    clearSearch,
    isValidQuery,
  };
}

# Custom Hooks

This directory contains reusable custom hooks for the application.

## useSearchDebounce

A custom hook that provides search functionality with debounce to avoid excessive API calls while the user is typing.

### Features

- **Debounce**: Configurable delay before executing search
- **Minimum length**: Only search when query meets minimum character requirement
- **Visual feedback**: Loading state during debounce period
- **Immediate search**: Bypass debounce with submit action
- **Cleanup**: Automatic timer cleanup on component unmount

### Usage

```tsx
import { useSearchDebounce } from '@/lib/hooks/useSearchDebounce';

function MyComponent() {
  const fetchData = async (query: string) => {
    // Your API call here
    const response = await api.get('/data', { params: { search: query } });
    return response.data;
  };

  const {
    searchQuery,
    isSearching,
    handleSearch,
    handleSearchSubmit,
    clearSearch,
    isValidQuery,
  } = useSearchDebounce({
    delay: 2000,
    minLength: 3,
    onSearch: fetchData,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(); }}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {isSearching && <div>Searching...</div>}
    </form>
  );
}
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `delay` | `number` | `2000` | Delay in milliseconds before executing search |
| `minLength` | `number` | `3` | Minimum characters required to trigger search |
| `onSearch` | `function` | **required** | Callback function to execute when search should be performed |
| `initialQuery` | `string` | `''` | Initial search query value |

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `searchQuery` | `string` | Current search query |
| `isSearching` | `boolean` | Whether the search is currently in debounce state |
| `handleSearch` | `function` | Function to update the search query (triggers debounce) |
| `handleSearchSubmit` | `function` | Function to execute search immediately (bypasses debounce) |
| `clearSearch` | `function` | Function to clear the search query |
| `isValidQuery` | `boolean` | Whether the current query meets the minimum length requirement |

### Examples

#### Basic Search
```tsx
const { searchQuery, isSearching, handleSearch, handleSearchSubmit } = useSearchDebounce({
  onSearch: async (query) => {
    await fetchData(query);
  }
});
```

#### Custom Configuration
```tsx
const { searchQuery, handleSearch } = useSearchDebounce({
  delay: 1500,
  minLength: 2,
  onSearch: fetchData,
  initialQuery: 'default search',
});
```

#### With Pagination
```tsx
const [currentPage, setCurrentPage] = useState(1);

const handleSearchWithPageReset = (query: string) => {
  setCurrentPage(1); // Reset to first page when searching
  handleSearch(query);
};
```

### Best Practices

1. **Use consistent delay**: Keep the same delay across your application for consistent UX
2. **Set appropriate minLength**: Balance between UX (not too high) and performance (not too low)
3. **Handle loading states**: Use `isSearching` to show visual feedback
4. **Reset pagination**: Reset page to 1 when searching to avoid empty results
5. **Cleanup**: The hook handles cleanup automatically, but ensure your `onSearch` function is stable

### Migration Guide

If you're migrating from manual debounce implementation:

**Before:**
```tsx
const [searchQuery, setSearchQuery] = useState('');
const [isSearching, setIsSearching] = useState(false);
const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

const handleSearch = (query: string) => {
  setSearchQuery(query);
  // Manual debounce logic...
};
```

**After:**
```tsx
const { searchQuery, isSearching, handleSearch, handleSearchSubmit } = useSearchDebounce({
  onSearch: fetchData,
});
```

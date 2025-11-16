# Custom Router

A lightweight, custom React router that follows React Router v6 patterns for easy migration.

## Features

- ✅ React Router v6 compatible API
- ✅ TypeScript support
- ✅ Route parameters (`/user/:id`)
- ✅ Query string support (`useSearchParams`)
- ✅ Programmatic navigation (`useNavigate`)
- ✅ Link component
- ✅ No external dependencies (uses only browser APIs)

## Usage

### Basic Setup

```tsx
import { BrowserRouter, Routes, Route } from './router';
import { Home } from './pages/home';
import { About } from './pages/about';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
};
```

### Navigation with Link

```tsx
import { Link } from './router';

export const Navbar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/user/123">Profile</Link>
    </nav>
  );
};
```

### Programmatic Navigation

```tsx
import { useNavigate } from './router';

export const LoginButton = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Do login logic...
    navigate('/dashboard');
  };

  return <button onClick={handleLogin}>Login</button>;
};
```

### Route Parameters

```tsx
import { useParams } from './router';

export const UserProfile = () => {
  const { id } = useParams();
  
  return <div>User ID: {id}</div>;
};
```

### Query Parameters

```tsx
import { useSearchParams } from './router';

export const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  return <div>Searching for: {query}</div>;
};
```

### Current Location

```tsx
import { useLocation } from './router';

export const CurrentPath = () => {
  const location = useLocation();
  
  return <div>Current path: {location.pathname}</div>;
};
```

## Migration to React Router

To migrate to React Router v6, simply change your imports:

**Before (Custom Router):**
```tsx
import { BrowserRouter, Routes, Route, Link, useNavigate } from './router';
```

**After (React Router):**
```tsx
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
```

That's it! The API is identical, so your components won't need any changes.

## Route Patterns

- `/` - Exact match
- `/about` - Exact match
- `/user/:id` - Parameter route (matches `/user/123`, `/user/abc`, etc.)
- `/posts/:id/comments` - Nested parameter routes
- `/docs/*` - Wildcard (matches `/docs/anything/here`)

## API Reference

### Components

- `BrowserRouter` - Router provider (wrap your app)
- `Routes` - Container for Route components
- `Route` - Define a route with `path` and `element` props
- `Link` - Navigation link component

### Hooks

- `useNavigate()` - Get navigate function for programmatic navigation
- `useLocation()` - Get current location object
- `useParams()` - Get route parameters
- `useSearchParams()` - Get URL search parameters


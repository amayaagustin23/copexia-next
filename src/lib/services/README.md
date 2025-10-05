# Services Architecture

This directory contains a refactored and centralized service architecture for API communication.

## 🏗️ Architecture Overview

### Base Service
- **`baseService.ts`**: Abstract base class with common HTTP operations
- Provides generic methods: `get`, `post`, `put`, `delete`
- Includes `adminRequest` method for authenticated admin operations

### API Routes
- **`../config/apiRoutes.ts`**: Centralized route definitions
- Organized by domain (ADMIN, PUBLIC, AUTH, USER, GOOGLE_PLACES)
- Type-safe route builders with parameters

### Domain Services
- **`postsService.ts`**: Blog posts management (admin + public)
- **`categoriesService.ts`**: Categories management (admin + public)
- **`authService.ts`**: Authentication operations
- **`userService.ts`**: User profile management

## 🚀 Usage

### Import Services
```typescript
// Import specific service
import { postsService } from '@/lib/services';

// Import multiple services
import { postsService, authService, userService } from '@/lib/services';

// Import with types
import { postsService, type LoginData } from '@/lib/services';
```

### API Routes
```typescript
import { API_ROUTES } from '@/lib/services';

// Use route builders
const postUrl = API_ROUTES.ADMIN.POSTS.GET_BY_ID('123');
const likeUrl = API_ROUTES.PUBLIC.POSTS.LIKE('456');
```

## 📋 Service Methods

### Posts Service
```typescript
// Admin methods
await postsService.list({ page: 1, size: 10 });
await postsService.create(postData);
await postsService.update(id, postData);
await postsService.delete(id);
await postsService.getDashboard();

// Public methods
await postsService.getPublicPosts({ page: 1 });
await postsService.getPublicPostBySlug('my-post');
await postsService.likePost('123');
await postsService.getComments('123');
```

### Auth Service
```typescript
await authService.login({ email, password });
await authService.register({ name, email, password });
await authService.logout();
await authService.forgotPassword({ email });
await authService.resetPassword({ token, password });
```

### User Service
```typescript
await userService.getProfile();
await userService.updateProfile({ name: 'New Name' });
await userService.changePassword({ currentPassword, newPassword });
await userService.uploadAvatar(file);
```

## 🔄 Migration from Old Services

### Before (Old)
```typescript
import { postsService } from '@/services/postsService';
import { authService } from '@/services/authService';
```

### After (New)
```typescript
import { postsService, authService } from '@/lib/services';
```

## 🎯 Benefits

1. **Centralized Routes**: All API endpoints in one place
2. **Type Safety**: Full TypeScript support with proper types
3. **Consistency**: Uniform method signatures across services
4. **Maintainability**: Easy to add new endpoints or modify existing ones
5. **Reusability**: Base service provides common functionality
6. **Organization**: Clear separation by domain and access level

## 🔧 Adding New Services

1. Create service class extending `BaseService`
2. Add routes to `API_ROUTES` in `../config/apiRoutes.ts`
3. Export from `index.ts`
4. Add TypeScript types if needed

```typescript
export class NewService extends BaseService {
  async getData(): Promise<any> {
    return this.get(this.routes.NEW.DATA);
  }
}

export const newService = new NewService();
```

## 🚨 Backward Compatibility

Old service files in `/src/services/` are deprecated but still work:
- `postsService.ts` → re-exports from new service
- `authService.ts` → keep existing functionality
- Other services → migrate when needed

## 📁 File Structure

```
src/lib/services/
├── README.md              # This documentation
├── index.ts               # Barrel exports
├── baseService.ts         # Base service class
├── postsService.ts        # Posts management
├── categoriesService.ts   # Categories management
├── authService.ts         # Authentication
└── userService.ts         # User profile
```

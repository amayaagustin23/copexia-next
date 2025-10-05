# Services Architecture Diagram

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Routes Layer                         │
│                    (apiRoutes.ts)                              │
├─────────────────────────────────────────────────────────────────┤
│  ADMIN    │  PUBLIC    │  AUTH      │  USER      │  GOOGLE    │
│  POSTS    │  POSTS     │  LOGIN     │  PROFILE   │  PLACES    │
│  CATEGS   │  CATEGS    │  REGISTER  │  AVATAR    │  AUTOCOMPL │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Base Service Layer                         │
│                   (baseService.ts)                             │
├─────────────────────────────────────────────────────────────────┤
│  • Generic HTTP methods (GET, POST, PUT, DELETE)               │
│  • Admin request handler with credentials                      │
│  • Error handling and response processing                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Domain Services Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  PostsService    │  CategoriesService  │  AuthService  │  UserService │
│  • list()        │  • list()           │  • login()    │  • getProfile() │
│  • create()      │  • create()         │  • register() │  • updateProfile() │
│  • update()      │  • update()         │  • logout()   │  • changePassword() │
│  • delete()      │  • delete()         │  • forgotPass │  • uploadAvatar() │
│  • getDashboard()│  • getById()        │  • resetPass  │               │
│  • likePost()    │  • getPublic()      │  • verifyEmail│               │
│  • getComments() │  • getBySlug()      │               │               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Component Integration                        │
├─────────────────────────────────────────────────────────────────┤
│  import { postsService, authService } from '@/lib/services';   │
│                                                                 │
│  // Usage in components                                         │
│  const posts = await postsService.list({ page: 1 });           │
│  const user = await authService.login({ email, password });    │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

```
Component Request
       │
       ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Service   │───▶│  BaseService │───▶│  API Route  │
│   Method    │    │  (HTTP)      │    │  Builder    │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Response   │◀───│  Axios HTTP  │◀───│  Backend    │
│  Processing │    │  Request     │    │  API        │
└─────────────┘    └──────────────┘    └─────────────┘
```

## 📁 File Organization

```
src/lib/
├── config/
│   └── apiRoutes.ts          # Centralized route definitions
├── services/
│   ├── README.md             # Documentation
│   ├── ARCHITECTURE.md       # This file
│   ├── index.ts              # Barrel exports
│   ├── baseService.ts        # Base service class
│   ├── postsService.ts       # Posts management
│   ├── categoriesService.ts  # Categories management
│   ├── authService.ts        # Authentication
│   └── userService.ts        # User profile
└── axios.ts                  # HTTP client configuration

src/services/ (deprecated)
├── postsService.ts           # Re-exports from new service
├── authService.ts            # Keep existing functionality
└── authServiceCompat.ts      # Compatibility layer
```

## 🎯 Key Benefits

1. **Single Source of Truth**: All routes defined in one place
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Consistency**: Uniform method signatures across all services
4. **Maintainability**: Easy to modify routes or add new endpoints
5. **Reusability**: Base service provides common HTTP operations
6. **Organization**: Clear separation by domain and access level
7. **Backward Compatibility**: Old imports still work during migration

## 🚀 Migration Path

### Phase 1: New Services (✅ Complete)
- Create new service architecture
- Implement base service and domain services
- Add centralized route definitions

### Phase 2: Compatibility (✅ Complete)
- Keep old services working with re-exports
- Add deprecation warnings
- Update documentation

### Phase 3: Migration (🔄 In Progress)
- Update component imports gradually
- Remove old service files
- Clean up unused code

### Phase 4: Optimization (📋 Planned)
- Add request/response interceptors
- Implement caching strategies
- Add error boundary handling

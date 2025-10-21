# API Service Documentation

## Unified API Structure

We use a single, well-organized API service with clear namespaces for different user roles.

### Usage Examples

```typescript
import { ApiService } from '@/lib/api';

// Authentication
const loginResponse = await ApiService.auth.login({ role: 'admin', username: 'admin@email.com', password: 'password' });
await ApiService.auth.logout();
const tokenValid = await ApiService.auth.validateToken();

// Admin Operations
const tasks = await ApiService.admin.getAllTasks();
const newTask = await ApiService.admin.createTask({ title: 'New Task', round_num: 1, teamId: 1 });
const leaderboard = await ApiService.admin.getLeaderboard();
const teams = await ApiService.admin.getAllTeams();

// Team Operations
const teamDetails = await ApiService.team.getDetails(1);
const teamTasks = await ApiService.team.getTasks(1);
await ApiService.team.submitTask(1, 2, { teamNotes: 'Completed successfully' });
await ApiService.team.uploadGalleryImage(1, fileObject);
```

### Alternative Import Style (for backwards compatibility)

```typescript
import { authAPI, adminAPI, teamAPI } from '@/lib/api';

const tasks = await adminAPI.getAllTasks();
const teamDetails = await teamAPI.getDetails(1);
```

## API Namespaces

### `ApiService.auth`
- `login()` - User authentication
- `logout()` - Clear session
- `validateToken()` - Check token validity

### `ApiService.admin`
- **Tasks**: CRUD operations, completion, assignment
- **Teams**: View all teams, get team details
- **Leaderboard**: View and update rankings
- **Problem Statements**: Full CRUD + CSV upload
- **Announcements**: Full CRUD operations
- **Dashboard**: Admin dashboard data

### `ApiService.team`
- **Profile**: Get/update team details
- **Tasks**: View assigned tasks, submit solutions
- **Problem Statements**: Read-only access
- **Gallery**: Upload/remove team images
- **Announcements**: Read-only access

## Benefits of This Structure

1. **Single Source of Truth**: One API service to maintain
2. **Clear Organization**: Role-based namespaces
3. **Type Safety**: Full TypeScript support
4. **Consistent Error Handling**: Centralized interceptors
5. **Easy to Use**: Intuitive method names and structure
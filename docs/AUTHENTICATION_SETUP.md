# Authentication Setup Guide

This guide covers the complete authentication setup for the LG Radar Dashboard using Supabase.

## 1. Supabase Configuration

### Environment Variables
Ensure these variables are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://memlxbsitkqvgitjubfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Authentication Providers

#### Email Authentication
- ✅ Email/Password login
- ✅ Magic link authentication
- ✅ Email confirmation required

#### Google OAuth
To enable Google OAuth in Supabase:

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - **Client ID**: Get from Google Cloud Console
   - **Client Secret**: Get from Google Cloud Console
4. Add authorized redirect URIs:
   - `https://memlxbsitkqvgitjubfo.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
   - `https://your-domain.vercel.app/auth/callback` (for production)

#### Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `https://memlxbsitkqvgitjubfo.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret to Supabase

## 2. Row Level Security (RLS) Policies

### Database Setup
Run the SQL commands in `supabase/rls-policies.sql` to set up:

- ✅ Enable RLS on all tables
- ✅ Organisation-based data isolation
- ✅ Role-based permissions (admin/user)
- ✅ Secure user data access

### Key Security Features
- Users can only access data from their organisation
- Admins have additional delete permissions
- JWT-based authentication with organisation_id claims
- Automatic user isolation at database level

## 3. Authentication Flow

### Server-Side Authentication
- `getServerSession()` helper in `lib/auth.ts`
- Automatic redirect to `/login` for unauthenticated users
- Session validation on all protected routes

### Client-Side Authentication
- `useUser()` hook for user state management
- `<AuthGuard>` component for route protection
- Automatic loading states and error handling

### Authentication Pages
- `/login` - Email, magic link, and Google OAuth
- `/signup` - Account creation with Google OAuth option
- `/auth/callback` - OAuth callback handling (automatically redirects to `/gazettes`)

### OAuth Callback Route
The `/auth/callback` route handler processes OAuth authentication:
- Exchanges authorization code for session
- Handles authentication errors gracefully
- Redirects to dashboard on success
- Redirects to login with error on failure

## 4. User Management

### User Registration
When users sign up:
1. Account created in Supabase Auth
2. User record created in `public.users` table
3. Organisation created if new
4. User assigned to organisation with appropriate role

### User Roles
- **admin**: Full access to organisation data, can delete records
- **user**: Read/write access to organisation data, cannot delete

### User Profile Data
Stored in `auth.users.user_metadata`:
- `full_name`: User's display name
- `organisation_name`: Organisation identifier
- `organisation_id`: UUID reference to organisation
- `avatar_url`: Profile picture URL (from Google OAuth)

### Profile Picture Support
- Google OAuth users automatically get their profile picture
- Displays in sidebar user section
- Falls back to initials for email/password users
- Responsive design with proper image sizing

## 5. Implementation Details

### Authentication Helpers
```typescript
// Server-side session check
const session = await getServerSession();
if (!session) redirect('/login');

// Require specific role
await requireRole('admin');

// Client-side user access
const { user, loading } = useUser();
```

### Route Protection
```typescript
// Server component protection
export default async function ProtectedPage() {
  await requireAuth();
  // Page content
}

// Client component protection
export default function ClientPage() {
  return (
    <AuthGuard>
      {/* Protected content */}
    </AuthGuard>
  );
}
```

### Database Queries
All database queries automatically respect RLS policies:
```typescript
// This will only return data for user's organisation
const { data } = await supabase
  .from('gazettes')
  .select('*');
```

## 6. Security Considerations

### JWT Claims
- `sub`: User ID (UUID)
- `email`: User email
- `user_metadata.organisation_id`: Organisation UUID
- `role`: User role (admin/user)

### Data Isolation
- Complete organisation-level data separation
- No cross-organisation data access possible
- Automatic filtering at database level

### Session Management
- Secure HTTP-only cookies
- Automatic session refresh
- Proper logout handling

## 7. Testing Authentication

### Manual Testing
1. Create test accounts with different organisations
2. Verify data isolation between organisations
3. Test all authentication methods (email, magic link, Google)
4. Verify role-based permissions

### Automated Testing
Consider adding tests for:
- Authentication flows
- RLS policy enforcement
- Role-based access control
- Session management

## 8. Troubleshooting

### Common Issues
1. **Google OAuth not working**: Check redirect URIs in Google Console
2. **RLS blocking queries**: Verify user has organisation_id set
3. **Session not persisting**: Check cookie settings and HTTPS
4. **Cross-organisation data access**: Review RLS policies

### Debug Tools
- Supabase Dashboard → Authentication → Users
- Browser DevTools → Application → Cookies
- Database logs for RLS policy violations
- Network tab for authentication requests

## 9. Production Deployment

### Vercel Configuration
Ensure environment variables are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Domain Configuration
Update redirect URIs in:
- Google Cloud Console
- Supabase Dashboard → Authentication → URL Configuration

### Security Headers
Consider adding security headers in `next.config.js`:
- Content Security Policy
- Strict Transport Security
- X-Frame-Options
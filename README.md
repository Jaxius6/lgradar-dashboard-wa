# LG Radar Dashboard

Real-time legislative tracking for WA councils – never miss a Gazette again.

## Overview

LG Radar Dashboard is a production-ready admin interface built with Next.js 14, providing comprehensive legislative tracking capabilities for Western Australian councils. The platform enables users to monitor government gazettes, set up intelligent alerts, and never miss critical legislative deadlines.

**Status**: ✅ **Production Ready** - Successfully building and deployable to Vercel

## Features

- **Real-time Gazette Tracking**: Monitor legislative changes across WA councils
- **Intelligent Alerts**: Keyword-based and council-specific notifications
- **Risk Assessment**: Automated risk rating for legislative changes
- **Deadline Tracking**: Live countdown timers for disallowance periods
- **Team Collaboration**: Multi-user support with role-based access
- **Export Capabilities**: CSV export for data analysis
- **Responsive Design**: Mobile-first design with dark mode
- **Accessibility**: WCAG 2.2 AA compliant

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS (dark mode only)
- **UI Components**: ShadCN UI
- **Authentication**: Supabase Auth (email, magic links, OAuth)
- **Database**: Supabase (PostgreSQL with RLS)
- **Payments**: Stripe (billing and subscriptions)
- **Deployment**: Vercel (CI/CD + edge runtime)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for billing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The application uses Supabase for data storage. Run the following SQL to set up the required tables:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gazettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view gazettes in their org" ON gazettes
  FOR SELECT USING (organisation_id IN (
    SELECT organisation_id FROM profiles WHERE id = auth.uid()
  ));
```

### Seed Data

To populate the database with sample data for development:

```bash
npm run seed
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run e2e` - Run end-to-end tests
- `npm run type-check` - Run TypeScript type checking

### Code Quality

The project includes several quality gates:

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Static type checking
- **Vitest**: Unit testing
- **Cypress**: End-to-end testing

### Project Structure

```
app/
├── (auth)/              # Authentication pages
│   ├── login/
│   └── signup/
├── (dashboard)/         # Protected dashboard pages
│   ├── gazettes/        # Main gazette tracking
│   ├── alerts/          # Alert management
│   ├── logs/            # Activity logs
│   ├── billing/         # Subscription management
│   ├── contact/         # Support contact
│   └── settings/        # User settings
└── layout.tsx           # Root layout

components/
├── ui/                  # ShadCN UI components
├── auth/                # Authentication components
├── layout/              # Layout components
└── gazettes/            # Gazette-specific components

lib/
├── supabase.ts          # Supabase client configuration
├── auth.ts              # Authentication utilities
├── dbSchema.ts          # Database schema and types
└── utils.ts             # Utility functions

styles/
└── globals.css          # Global styles and Tailwind
```

## Deployment

### Vercel Deployment

The application is ready for production deployment on Vercel:

1. **Build Status**: ✅ Successfully builds with `npm run build`
2. **TypeScript**: ✅ All compilation errors resolved
3. **ESLint**: ✅ Critical errors fixed (only warnings remain)
4. **Bundle Size**: Optimized for production (81.9 kB shared JS)

#### Deployment Steps:
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

Ensure all required environment variables are set in your deployment environment:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_APP_URL` - Your application URL
- `NEXTAUTH_SECRET` - NextAuth secret for session encryption

### Build Configuration

The project includes optimized build settings:
- **TypeScript Target**: ES2017 with downlevel iteration support
- **ESLint**: Configured with TypeScript support and Next.js rules
- **Bundle Analysis**: Optimized chunks and code splitting
- **Static Generation**: Pre-rendered static pages where possible

## Features in Detail

### Authentication

- Email/password authentication
- Magic link sign-in
- OAuth providers (Google, Apple) - configurable
- Row Level Security (RLS) for data isolation

### Gazette Management

- Paginated gazette listing
- Advanced search and filtering
- Risk rating system
- Deadline countdown timers
- Detailed gazette viewer

### Alert System

- Keyword-based alerts
- Council-specific monitoring
- Email notifications
- Daily summary emails

### Team Management

- Role-based access control (viewer, editor, admin)
- Team invitations
- Organisation isolation

### Billing Integration

- Stripe customer portal
- Subscription management
- Usage tracking
- Invoice history

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software owned by LG Radar.

## Recent Updates (January 2025)

### Dashboard Enhancements
- **Contact System**: Updated contact information and integrated webhook form submission with confetti animations
- **Billing Updates**: Current plan pricing updated to $197/month
- **Navigation**: Renamed "Activity Logs" to "Logs" for better clarity
- **Legal Pages**: Added comprehensive Terms of Service and Privacy Policy pages
- **Response Time**: Improved support response time to 2-4 hours
- **Support Hours**: Updated to Monday-Friday operations (Saturday-Sunday closed)

### Authentication Improvements
- **OAuth Integration**: Fixed Google OAuth redirect issues for seamless authentication
- **Profile Pictures**: Added Google profile picture support in sidebar navigation
- **Callback Handling**: Implemented proper OAuth callback route for secure authentication flow
- **Session Management**: Enhanced session cookie handling in OAuth callback route
- **Middleware Optimization**: Improved middleware to prevent redirect loops during OAuth flow
- **AuthGuard Enhancement**: Better session detection and state management for OAuth users

### Technical Enhancements
- **Webhook Integration**: Contact form now submits to n8n webhook endpoint
- **Form Validation**: Enhanced contact form with proper error handling
- **UI/UX**: Added success animations and improved user feedback
- **Documentation**: Updated README and ROADMAP to reflect current state

## Support

For support, email **lgradarwa@gmail.com.au** or call **+61 427 931 745**.
Visit our contact page in the dashboard for direct support requests.

**Support Hours**: Monday - Friday (Saturday-Sunday closed)
**Response Time**: We typically respond within 2-4 hours
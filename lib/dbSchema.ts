import { z } from 'zod';

// Enums
export const RiskRating = z.enum(['low', 'medium', 'high']);
export const UserRole = z.enum(['viewer', 'editor', 'admin']);
export const AlertType = z.enum(['keyword', 'council', 'category']);
export const LogAction = z.enum(['view', 'export', 'create', 'update', 'delete']);

// Base schemas
export const BaseSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Organisation schema
export const OrganisationSchema = BaseSchema.extend({
  name: z.string().min(1),
  slug: z.string().min(1),
  subscription_status: z.enum(['active', 'inactive', 'trial']),
  subscription_tier: z.enum(['basic', 'pro', 'enterprise']),
  stripe_customer_id: z.string().optional(),
});

// Profile schema
export const ProfileSchema = BaseSchema.extend({
  email: z.string().email(),
  full_name: z.string().optional(),
  organisation_id: z.string().uuid(),
  role: UserRole,
  avatar_url: z.string().url().optional(),
  two_factor_enabled: z.boolean().default(false),
  last_login: z.string().datetime().optional(),
});

// Gazette schema - matches the actual Supabase table structure
export const GazetteSchema = z.object({
  id: z.number(),
  date: z.string().nullable(),
  emoji: z.string().nullable(),
  category: z.string().nullable(),
  jurisdiction: z.string().nullable(),
  act: z.string().nullable(),
  title: z.string().nullable(),
  impact: z.string().nullable(),
  created_at: z.string().nullable(),
  link: z.string().nullable(),
  pubdate: z.string().nullable(),
  gaz_id: z.string().nullable(),
  gaz_num: z.number().nullable(),
  numpages: z.number().nullable(),
  author: z.string().nullable(),
  next_sit: z.string().nullable(),
  is_flagged: z.boolean().default(false),
  is_reviewed: z.boolean().default(false),
});

// Tabled schema - matches the actual Supabase table structure
export const TabledSchema = z.object({
  id: z.number(),
  date: z.string().nullable(),
  type: z.string().nullable(),
  name: z.string().nullable(),
  paper_no: z.string().nullable(),
  link: z.string().nullable(),
  url: z.string().nullable(), // Check if this column exists
  created_at: z.string().nullable(),
  is_flagged: z.boolean().default(false),
  is_reviewed: z.boolean().default(false),
});

// Legacy Gazette schema for backwards compatibility
export const LegacyGazetteSchema = BaseSchema.extend({
  title: z.string().min(1),
  summary: z.string().optional(),
  content: z.string().optional(),
  publication_date: z.string().datetime(),
  council_name: z.string().min(1),
  council_id: z.string().optional(),
  gazette_number: z.string().optional(),
  risk_rating: RiskRating,
  disallowance_deadline: z.string().datetime().optional(),
  is_relevant: z.boolean().default(false),
  source_url: z.string().url().optional(),
  pdf_url: z.string().url().optional(),
  organisation_id: z.string().uuid(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional(),
});

// Alert schema
export const AlertSchema = BaseSchema.extend({
  name: z.string().min(1),
  type: AlertType,
  keywords: z.array(z.string()).default([]),
  councils: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  email_notifications: z.boolean().default(true),
  daily_summary: z.boolean().default(false),
  organisation_id: z.string().uuid(),
  created_by: z.string().uuid(),
});

// Activity log schema
export const ActivityLogSchema = BaseSchema.extend({
  user_id: z.string().uuid(),
  action: LogAction,
  resource_type: z.string(),
  resource_id: z.string().optional(),
  details: z.record(z.any()).optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
  organisation_id: z.string().uuid(),
});

// Team invitation schema
export const TeamInvitationSchema = BaseSchema.extend({
  email: z.string().email(),
  role: UserRole,
  organisation_id: z.string().uuid(),
  invited_by: z.string().uuid(),
  accepted_at: z.string().datetime().optional(),
  expires_at: z.string().datetime(),
  token: z.string(),
});

// API response schemas
export const PaginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  total: z.number(),
  totalPages: z.number(),
});

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  pagination: PaginationSchema.optional(),
});

// Form schemas
export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const SignupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  organisationName: z.string().min(2, 'Organisation name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const ProfileUpdateSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

export const PasswordResetSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const AlertCreateSchema = z.object({
  name: z.string().min(1, 'Alert name is required'),
  type: AlertType,
  keywords: z.array(z.string()).optional(),
  councils: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  email_notifications: z.boolean().default(true),
  daily_summary: z.boolean().default(false),
});

export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Type exports
export type Organisation = z.infer<typeof OrganisationSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Gazette = z.infer<typeof GazetteSchema>;
export type Tabled = z.infer<typeof TabledSchema>;
export type LegacyGazette = z.infer<typeof LegacyGazetteSchema>;
export type Alert = z.infer<typeof AlertSchema>;
export type ActivityLog = z.infer<typeof ActivityLogSchema>;
export type TeamInvitation = z.infer<typeof TeamInvitationSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

export type LoginForm = z.infer<typeof LoginSchema>;
export type SignupForm = z.infer<typeof SignupSchema>;
export type ProfileUpdateForm = z.infer<typeof ProfileUpdateSchema>;
export type PasswordResetForm = z.infer<typeof PasswordResetSchema>;
export type AlertCreateForm = z.infer<typeof AlertCreateSchema>;
export type ContactForm = z.infer<typeof ContactFormSchema>;

export type RiskRatingType = z.infer<typeof RiskRating>;
export type UserRoleType = z.infer<typeof UserRole>;
export type AlertTypeType = z.infer<typeof AlertType>;
export type LogActionType = z.infer<typeof LogAction>;
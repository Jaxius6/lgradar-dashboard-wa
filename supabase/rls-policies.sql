-- Row Level Security (RLS) Policies for LG Radar Dashboard
-- These policies ensure users can only access data from their own organisation

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gazettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gazette_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.councils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can only see their own record
CREATE POLICY "Users can view own record" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own record
CREATE POLICY "Users can update own record" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Organisations table policies
-- Users can only see their own organisation
CREATE POLICY "Users can view own organisation" ON public.organisations
  FOR SELECT USING (
    id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
  );

-- Users can update their own organisation (for admins)
CREATE POLICY "Users can update own organisation" ON public.organisations
  FOR UPDATE USING (
    id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Gazettes table policies
-- Users can only see gazettes from their organisation
CREATE POLICY "Users can view organisation gazettes" ON public.gazettes
  FOR SELECT USING (
    organisation_id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
  );

-- Users can insert gazettes for their organisation
CREATE POLICY "Users can insert organisation gazettes" ON public.gazettes
  FOR INSERT WITH CHECK (
    organisation_id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
  );

-- Users can update gazettes from their organisation
CREATE POLICY "Users can update organisation gazettes" ON public.gazettes
  FOR UPDATE USING (
    organisation_id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
  );

-- Users can delete gazettes from their organisation (admins only)
CREATE POLICY "Admins can delete organisation gazettes" ON public.gazettes
  FOR DELETE USING (
    organisation_id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Gazette Items table policies
-- Users can only see gazette items from their organisation's gazettes
CREATE POLICY "Users can view organisation gazette items" ON public.gazette_items
  FOR SELECT USING (
    gazette_id IN (
      SELECT id FROM public.gazettes 
      WHERE organisation_id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
    )
  );

-- Users can insert gazette items for their organisation's gazettes
CREATE POLICY "Users can insert organisation gazette items" ON public.gazette_items
  FOR INSERT WITH CHECK (
    gazette_id IN (
      SELECT id FROM public.gazettes 
      WHERE organisation_id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
    )
  );

-- Users can update gazette items from their organisation's gazettes
CREATE POLICY "Users can update organisation gazette items" ON public.gazette_items
  FOR UPDATE USING (
    gazette_id IN (
      SELECT id FROM public.gazettes 
      WHERE organisation_id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
    )
  );

-- Users can delete gazette items from their organisation's gazettes (admins only)
CREATE POLICY "Admins can delete organisation gazette items" ON public.gazette_items
  FOR DELETE USING (
    gazette_id IN (
      SELECT id FROM public.gazettes 
      WHERE organisation_id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
    )
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Councils table policies
-- Users can only see councils from their organisation
CREATE POLICY "Users can view organisation councils" ON public.councils
  FOR SELECT USING (
    organisation_id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
  );

-- Users can insert councils for their organisation
CREATE POLICY "Users can insert organisation councils" ON public.councils
  FOR INSERT WITH CHECK (
    organisation_id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
  );

-- Users can update councils from their organisation
CREATE POLICY "Users can update organisation councils" ON public.councils
  FOR UPDATE USING (
    organisation_id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
  );

-- Users can delete councils from their organisation (admins only)
CREATE POLICY "Admins can delete organisation councils" ON public.councils
  FOR DELETE USING (
    organisation_id = (SELECT organisation_id FROM public.users WHERE id = auth.uid())
    AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- User Preferences table policies
-- Users can only see their own preferences
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences" ON public.user_preferences
  FOR DELETE USING (user_id = auth.uid());

-- Function to get user's organisation_id from JWT
CREATE OR REPLACE FUNCTION auth.get_user_organisation_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT organisation_id FROM public.users WHERE id = auth.uid();
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
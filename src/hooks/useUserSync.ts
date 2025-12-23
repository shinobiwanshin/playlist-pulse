import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserSync = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const syncUserToSupabase = async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('clerk_user_id', user.id)
          .single();

        if (!existingProfile) {
          // Create new profile
          const { error } = await supabase.from('profiles').insert({
            clerk_user_id: user.id,
            email: user.primaryEmailAddress?.emailAddress || null,
            full_name: user.fullName || null,
          });

          if (error) {
            console.error('Error creating profile:', error);
          }
        } else {
          // Update existing profile
          const { error } = await supabase
            .from('profiles')
            .update({
              email: user.primaryEmailAddress?.emailAddress || null,
              full_name: user.fullName || null,
            })
            .eq('clerk_user_id', user.id);

          if (error) {
            console.error('Error updating profile:', error);
          }
        }
      } catch (error) {
        console.error('Error syncing user:', error);
      }
    };

    syncUserToSupabase();
  }, [user, isLoaded, isSignedIn]);
};

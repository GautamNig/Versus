// src/hooks/useCounterIncrement.js
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useCounterIncrement = () => {
  useEffect(() => {
    const incrementCounter = async () => {
      try {
        // Get current active state
        const { data: activeState, error: activeError } = await supabase
          .from('active_state')
          .select('*')
          .single();

        if (activeError) throw activeError;

        const activeCelebrityId = activeState?.active_celebrity_id;
        
        if (!activeCelebrityId) return;

        // Get current counter for active celebrity
        const { data: counter, error: counterError } = await supabase
          .from('counters')
          .select('*')
          .eq('celebrity_id', activeCelebrityId)
          .single();

        if (counterError) throw counterError;

        // Check if max value reached
        if (counter.current_value >= counter.max_value) {
          return; // Stop incrementing
        }

        // Increment counter
        const { error: updateError } = await supabase
          .from('counters')
          .update({ 
            current_value: counter.current_value + 1,
            updated_at: new Date().toISOString()
          })
          .eq('celebrity_id', activeCelebrityId);

        if (updateError) throw updateError;

      } catch (error) {
        console.error('Error incrementing counter:', error);
      }
    };

    // Set up interval to increment every second
    const interval = setInterval(incrementCounter, 1000);

    return () => clearInterval(interval);
  }, []);
};
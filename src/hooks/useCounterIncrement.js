// src/hooks/useCounterIncrement.js
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { appConfig } from '../config/appConfig';

export const useCounterIncrement = () => {
  useEffect(() => {
    let intervalId;

    const incrementCounter = async () => {
      try {
        const { data: activeState, error: activeError } = await supabase
          .from('active_state')
          .select('*')
          .single();

        if (activeError) return;

        const activeCelebrityId = activeState?.active_celebrity_id;
        if (!activeCelebrityId) return;

        const { data: counter, error: counterError } = await supabase
          .from('counters')
          .select('*')
          .eq('celebrity_id', activeCelebrityId)
          .single();

        if (counterError) return;

        if (counter.current_value >= counter.max_value) {
          clearInterval(intervalId);
          return;
        }

        const { error: updateError } = await supabase
          .from('counters')
          .update({ 
            current_value: counter.current_value + 1,
            updated_at: new Date().toISOString()
          })
          .eq('celebrity_id', activeCelebrityId);

        if (updateError) {
          console.error('Error updating counter:', updateError);
        }

      } catch (error) {
        console.error('Error in increment counter:', error);
      }
    };

    intervalId = setInterval(incrementCounter, appConfig.counter.incrementInterval);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);
};
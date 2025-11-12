// src/hooks/useCelebrityCounter.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useCelebrityCounter = () => {
  const [celebrities, setCelebrities] = useState([]);
  const [counters, setCounters] = useState({});
  const [activeCelebrity, setActiveCelebrity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasUserSelected, setHasUserSelected] = useState(false);

  useEffect(() => {
    fetchInitialData();
    setupRealtimeSubscriptions();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch celebrities
      const { data: celebData, error: celebError } = await supabase
        .from('celebrities')
        .select('*')
        .order('created_at');

      if (celebError) throw celebError;

      // Fetch counters
      const { data: counterData, error: counterError } = await supabase
        .from('counters')
        .select('*');

      if (counterError) throw counterError;

      // Fetch active state
      const { data: activeData, error: activeError } = await supabase
        .from('active_state')
        .select('*')
        .single();

      if (activeError && activeError.code !== 'PGRST116') throw activeError;

      setCelebrities(celebData || []);
      
      // Convert counters array to object for easy access
      const countersObj = {};
      (counterData || []).forEach(counter => {
        countersObj[counter.celebrity_id] = counter;
      });
      setCounters(countersObj);
      
      setActiveCelebrity(activeData?.active_celebrity_id || null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to counter changes
    supabase
      .channel('counters')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'counters' },
        (payload) => {
          setCounters(prev => ({
            ...prev,
            [payload.new.celebrity_id]: payload.new
          }));
        }
      )
      .subscribe();

    // Subscribe to active state changes
    supabase
      .channel('active_state')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'active_state' },
        (payload) => {
          setActiveCelebrity(payload.new?.active_celebrity_id || null);
        }
      )
      .subscribe();
  };

  const switchCounter = async (celebrityId) => {
    try {
      // Update active state
      const { error } = await supabase
        .from('active_state')
        .update({ active_celebrity_id: celebrityId })
        .eq('id', (await supabase.from('active_state').select('id').single()).data.id);

      if (error) throw error;
      
      setHasUserSelected(true);
    } catch (error) {
      console.error('Error switching counter:', error);
    }
  };

  const checkIfFirstTimeUser = () => {
    // Check if this is the first user and no one has selected yet
    return !activeCelebrity && !hasUserSelected;
  };

  const handleFirstTimeSelection = async (celebrityId) => {
    await switchCounter(celebrityId);
    setHasUserSelected(true);
  };

  return {
    celebrities,
    counters,
    activeCelebrity,
    loading,
    switchCounter,
    checkIfFirstTimeUser,
    handleFirstTimeSelection,
    hasUserSelected
  };
};
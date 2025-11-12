// src/hooks/useDataPolling.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useDataPolling = (pollInterval = 1000) => {
  const [celebrities, setCelebrities] = useState([]);
  const [counters, setCounters] = useState({});
  const [activeCelebrity, setActiveCelebrity] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [celebResponse, counterResponse, activeResponse] = await Promise.all([
        supabase.from('celebrities').select('*').order('created_at'),
        supabase.from('counters').select('*'),
        supabase.from('active_state').select('*').single()
      ]);

      if (celebResponse.data) setCelebrities(celebResponse.data);
      
      if (counterResponse.data) {
        const countersObj = {};
        counterResponse.data.forEach(counter => {
          countersObj[counter.celebrity_id] = counter;
        });
        setCounters(countersObj);
      }
      
      if (activeResponse.data) {
        setActiveCelebrity(activeResponse.data.active_celebrity_id);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    
    const interval = setInterval(fetchData, pollInterval);
    
    return () => clearInterval(interval);
  }, [pollInterval]);

  return {
    celebrities,
    counters,
    activeCelebrity,
    loading,
    refreshData: fetchData
  };
};
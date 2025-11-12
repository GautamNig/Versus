// src/hooks/useCelebrityCounter.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { appConfig } from '../config/appConfig';

export const useCelebrityCounter = () => {
  const [celebrities, setCelebrities] = useState([]);
  const [counters, setCounters] = useState({});
  const [activeCelebrity, setActiveCelebrity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasUserSelected, setHasUserSelected] = useState(false);

  const fetchData = async () => {
    try {
      const [celebResponse, counterResponse, activeResponse] = await Promise.all([
        supabase.from('celebrities').select('*').order('created_at'),
        supabase.from('counters').select('*'),
        supabase.from('active_state').select('*').single()
      ]);

      if (celebResponse.error) throw celebResponse.error;
      if (counterResponse.error) throw counterResponse.error;

      setCelebrities(celebResponse.data || []);
      
      const countersObj = {};
      (counterResponse.data || []).forEach(counter => {
        countersObj[counter.celebrity_id] = counter;
      });
      setCounters(countersObj);
      
      setActiveCelebrity(activeResponse.data?.active_celebrity_id || null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, appConfig.pollingInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const switchCounter = async (celebrityId) => {
    try {
      const { data: activeState, error: fetchError } = await supabase
        .from('active_state')
        .select('id')
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('active_state')
        .update({ 
          active_celebrity_id: celebrityId,
          updated_at: new Date().toISOString()
        })
        .eq('id', activeState.id);

      if (error) throw error;
      
      setHasUserSelected(true);
      
      setTimeout(fetchData, 100);
    } catch (error) {
      console.error('Error switching counter:', error);
    }
  };

  const checkIfFirstTimeUser = () => {
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
    hasUserSelected,
    refreshData: fetchData
  };
};
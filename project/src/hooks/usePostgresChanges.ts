import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface DatabaseChange {
  table: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Record<string, any> | null;
  old: Record<string, any> | null;
  timestamp: string;
}

export function usePostgresChanges(tables: string[] = []) {
  const [changes, setChanges] = useState<DatabaseChange[]>([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const channels: any[] = [];

    tables.forEach(table => {
      const channel = supabase
        .channel(`db-changes-${table}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table
          },
          (payload: RealtimePostgresChangesPayload<any>) => {
            const change: DatabaseChange = {
              table: payload.table,
              eventType: payload.eventType,
              new: payload.new,
              old: payload.old,
              timestamp: new Date().toISOString()
            };

            setChanges(prev => [change, ...prev.slice(0, 49)]); // Keep last 50 changes
          }
        )
        .subscribe((status) => {
          setIsListening(status === 'SUBSCRIBED');
        });

      channels.push(channel);
    });

    return () => {
      channels.forEach(channel => channel.unsubscribe());
    };
  }, [tables]);

  const clearChanges = () => setChanges([]);

  return {
    changes,
    isListening,
    clearChanges
  };
}
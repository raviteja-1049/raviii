import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface UserPresence {
  user_id: string;
  email: string;
  full_name?: string;
  project_id?: string;
  last_seen: string;
  status: 'online' | 'away' | 'offline';
}

export interface BroadcastMessage {
  type: 'recipe_update' | 'taste_prediction' | 'collaboration_request' | 'system_notification';
  payload: any;
  sender_id: string;
  timestamp: string;
}

export function useRealtime(projectId?: string) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [presenceState, setPresenceState] = useState<Record<string, UserPresence>>({});
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    // Create a channel for the specific project
    const projectChannel = supabase.channel(`project:${projectId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: 'user_presence' }
      }
    });

    // Handle presence sync
    projectChannel
      .on('presence', { event: 'sync' }, () => {
        const state = projectChannel.presenceState();
        const presenceData: Record<string, UserPresence> = {};
        
        Object.keys(state).forEach(key => {
          const presence = state[key][0] as UserPresence;
          presenceData[key] = presence;
        });
        
        setPresenceState(presenceData);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        const message = payload as BroadcastMessage;
        setMessages(prev => [...prev, message]);
      })
      .subscribe(async (status) => {
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          // Track user presence
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await projectChannel.track({
              user_id: user.id,
              email: user.email,
              project_id: projectId,
              last_seen: new Date().toISOString(),
              status: 'online'
            });
          }
        }
      });

    setChannel(projectChannel);

    return () => {
      projectChannel.unsubscribe();
    };
  }, [projectId]);

  const sendMessage = async (type: BroadcastMessage['type'], payload: any) => {
    if (!channel) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const message: BroadcastMessage = {
      type,
      payload,
      sender_id: user.id,
      timestamp: new Date().toISOString()
    };

    await channel.send({
      type: 'broadcast',
      event: 'message',
      payload: message
    });
  };

  const updatePresence = async (status: UserPresence['status']) => {
    if (!channel) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await channel.track({
      user_id: user.id,
      email: user.email,
      project_id: projectId,
      last_seen: new Date().toISOString(),
      status
    });
  };

  return {
    presenceState,
    messages,
    isConnected,
    sendMessage,
    updatePresence
  };
}
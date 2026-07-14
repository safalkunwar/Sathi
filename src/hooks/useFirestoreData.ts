import { useState, useEffect } from 'react';
import { firestore } from '../services/firestore';
import { Companion, ExperienceStory, Activity, Event } from '../types';
import { offlineStorage } from '../services/storage';
import { COMPANIONS, STORIES, ACTIVITIES, EVENTS } from '../data/seedData';

const useCollection = <T extends { id: string }>(
  store: 'companions' | 'stories' | 'activities' | 'events',
  fallback: T[]
) => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFromCache = async () => {
      const cached = await offlineStorage.getCachedCollection<T>(store);
      if (cached.length > 0) {
        setItems(cached);
      }
    };

    loadFromCache();

    const unsubscribe = firestore.subscribe<T>(store, {}, async (live) => {
      if (live.length > 0) {
        setItems(live);
        await offlineStorage.cacheCollection(store, live);
      } else {
        const cached = await offlineStorage.getCachedCollection<T>(store);
        const source = cached.length ? cached : fallback;
        setItems(source);
        if (!cached.length) {
          await offlineStorage.cacheCollection(store, source);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [store]);

  return { [store]: items, loading } as Record<string, unknown> & { loading: boolean };
};

export const useCompanions = () => {
  const result = useCollection<Companion>('companions', COMPANIONS);
  return { companions: result.companions as Companion[], loading: result.loading };
};

export const useStories = () => {
  const result = useCollection<ExperienceStory>('stories', STORIES);
  return { stories: result.stories as ExperienceStory[], loading: result.loading };
};

export const useActivities = () => {
  const result = useCollection<Activity>('activities', ACTIVITIES);
  return { activities: result.activities as Activity[], loading: result.loading };
};

export const useEvents = () => {
  const result = useCollection<Event>('events', EVENTS);
  return { events: result.events as Event[], loading: result.loading };
};

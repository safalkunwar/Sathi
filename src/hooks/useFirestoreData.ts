import { useState, useEffect } from 'react';
import { firestore } from '../services/firestore';
import { COMPANIONS, STORIES } from '../data';
import { Companion, ExperienceStory, Activity, Event } from '../types';
import { offlineStorage } from '../services/storage';

export const useCompanions = () => {
  const [companions, setCompanions] = useState<Companion[]>(COMPANIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFromCache = async () => {
      const cached = await offlineStorage.getCachedCollection<Companion>('companions');
      if (cached.length > 0) {
        setCompanions(cached);
      }
    };

    loadFromCache();

    const unsubscribe = firestore.subscribe<Companion>('companions', {}, async (items) => {
      if (items.length > 0) {
        setCompanions(items);
        await offlineStorage.cacheCollection('companions', items);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { companions, loading };
};

export const useStories = () => {
  const [stories, setStories] = useState<ExperienceStory[]>(STORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFromCache = async () => {
      const cached = await offlineStorage.getCachedCollection<ExperienceStory>('stories');
      if (cached.length > 0) {
        setStories(cached);
      }
    };

    loadFromCache();

    const unsubscribe = firestore.subscribe<ExperienceStory>('stories', {}, async (items) => {
      if (items.length > 0) {
        setStories(items);
        await offlineStorage.cacheCollection('stories', items);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { stories, loading };
};

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFromCache = async () => {
      const cached = await offlineStorage.getCachedCollection<Activity>('activities');
      if (cached.length > 0) {
        setActivities(cached);
      }
    };

    loadFromCache();

    const unsubscribe = firestore.subscribe<Activity>('activities', {}, async (items) => {
      setActivities(items);
      await offlineStorage.cacheCollection('activities', items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { activities, loading };
};

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFromCache = async () => {
      const cached = await offlineStorage.getCachedCollection<Event>('events');
      if (cached.length > 0) {
        setEvents(cached);
      }
    };

    loadFromCache();

    const unsubscribe = firestore.subscribe<Event>('events', {}, async (items) => {
      setEvents(items);
      await offlineStorage.cacheCollection('events', items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { events, loading };
};

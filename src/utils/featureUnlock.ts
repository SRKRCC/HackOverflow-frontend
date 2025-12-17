const FEATURE_UNLOCK_TIMES = {
  tasks: new Date('2025-12-19T09:30:00+05:30'),
  gallery: new Date('2025-12-22T12:00:00+05:30'),
};

export const isFeatureUnlocked = (feature: 'tasks' | 'gallery'): boolean => {
  const now = new Date();
  const unlockTime = FEATURE_UNLOCK_TIMES[feature];
  return now >= unlockTime;
};

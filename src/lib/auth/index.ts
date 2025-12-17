import type { User } from '../types';
import { useTeamStore } from '../stores/team';

export const auth = {
  getUser: () => useTeamStore.getState().user,
  
  isAuthenticated: () => useTeamStore.getState().isAuthenticated,
  
  isAdmin: () => useTeamStore.getState().user?.role === 'admin',
  isTeam: () => useTeamStore.getState().user?.role === 'team',
  
  setUser: (user: User) => {
    useTeamStore.getState().setUser(user);
  },
  
  logout: () => {
    useTeamStore.getState().logout();
  },
  
  subscribe: (listener: (user: User | null) => void) => {
    return useTeamStore.subscribe((state, prevState) => {
      if (state.user !== prevState.user) {
        listener(state.user);
      }
    });
  },
  
  init: () => {
  },
};
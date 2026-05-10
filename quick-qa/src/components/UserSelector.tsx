'use client';

import { useState, useEffect, useContext, createContext, useCallback, ReactNode } from 'react';
import { User, AVAILABLE_USERS, getUserById } from '@/lib/types';

interface UserContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = 'quick-qa-current-user';

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return getUserById(stored);
        } catch {
          return AVAILABLE_USERS[0];
        }
      }
    }
    return AVAILABLE_USERS[0];
  });

  const setCurrentUser = useCallback((user: User) => {
    setCurrentUserState(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, user.id);
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function getCurrentUserIdFromLocalStorage(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY);
  }
  return null;
}

export function UserSelector() {
  const { currentUser, setCurrentUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-selector]')) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" data-user-selector>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors"
      >
        <div className="text-xl">{currentUser.avatar}</div>
        <div className="hidden sm:block">
          <div className="text-sm font-medium text-slate-200">{currentUser.name}</div>
          <div className="text-xs text-slate-500">当前身份</div>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-2 border-b border-slate-700">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              切换身份
            </div>
          </div>
          <div className="py-1 max-h-80 overflow-y-auto">
            {AVAILABLE_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setCurrentUser(user);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors ${
                  currentUser.id === user.id ? 'bg-violet-500/10' : ''
                }`}
              >
                <div className="text-xl">{user.avatar}</div>
                <span className="text-sm text-slate-200">{user.name}</span>
                {currentUser.id === user.id && (
                  <svg className="w-4 h-4 text-violet-400 ml-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

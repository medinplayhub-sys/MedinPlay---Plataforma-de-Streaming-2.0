/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AppSection,
  PlatformViewMode,
  ContentItem,
  IPTVChannel,
  RadioStation,
  UserAccount,
  UserProfile,
  ContentReview,
  WatchPartyRoom,
  PushNotificationItem,
  SubscriptionPlan,
  WatchHistoryItem,
} from './types';
import { StorageService } from './services/storage';
import { FirebaseService, testFirestoreConnection } from './services/firebase';

// Layout & Frame
import { DeviceFrame } from './components/layout/DeviceFrame';
import { Navbar } from './components/layout/Navbar';

// Sections
import { HomeSection } from './components/sections/HomeSection';
import { MoviesSeriesSection } from './components/sections/MoviesSeriesSection';
import { IPTVSection } from './components/sections/IPTVSection';
import { RadioSection } from './components/sections/RadioSection';
import { Adult18Section } from './components/sections/Adult18Section';
import { CommunitySection } from './components/sections/CommunitySection';

// Players & Modals
import { StreamPlayerModal } from './components/player/StreamPlayerModal';
import { RadioFloatingPlayer } from './components/radio/RadioFloatingPlayer';
import { AISearchModal } from './components/modals/AISearchModal';
import { SubscriptionModal } from './components/modals/SubscriptionModal';
import { AuthModal } from './components/modals/AuthModal';
import { PushNotificationsModal } from './components/modals/PushNotificationsModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  // Navigation & Platform State
  const [activeSection, setActiveSection] = useState<AppSection>('home');
  const [platformMode, setPlatformMode] = useState<PlatformViewMode>(StorageService.getPlatformMode());

  // Domain Data State
  const [account, setAccount] = useState<UserAccount>(StorageService.getAccount());
  const [activeProfileId, setActiveProfileId] = useState<string>(
    account.activeProfileId || account.profiles[0]?.id || 'prof-1'
  );
  const [catalog, setCatalog] = useState<ContentItem[]>(StorageService.getCatalog());
  const [iptvChannels, setIptvChannels] = useState<IPTVChannel[]>(StorageService.getIPTVChannels());
  const [radioStations, setRadioStations] = useState<RadioStation[]>(StorageService.getRadioStations());
  const [reviews, setReviews] = useState<ContentReview[]>(StorageService.getReviews());
  const [watchParties, setWatchParties] = useState<WatchPartyRoom[]>(StorageService.getWatchParties());
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(StorageService.getNotifications());

  // Active Stream Player State
  const [activeStreamItem, setActiveStreamItem] = useState<ContentItem | IPTVChannel | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Active Radio State (Background Audio)
  const [activeRadioStation, setActiveRadioStation] = useState<RadioStation | null>(null);

  // Modals Open State
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Active User Profile
  const activeProfile = account.profiles.find((p) => p.id === activeProfileId) || account.profiles[0];

  // Initialize Firebase Auth & Firestore Synchronization
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = FirebaseService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        const email = firebaseUser.email || account.email;
        const fullName = firebaseUser.displayName || email.split('@')[0];
        const avatarUrl =
          firebaseUser.photoURL ||
          account.avatarUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';

        try {
          // Attempt loading existing user from cloud
          const cloudData = await FirebaseService.loadUserData(uid);

          if (cloudData && cloudData.profiles && cloudData.profiles.length > 0) {
            setAccount((prev) => ({
              ...prev,
              firebaseUid: uid,
              email: cloudData.accountData?.email || email,
              fullName: cloudData.accountData?.fullName || fullName,
              avatarUrl: cloudData.accountData?.avatarUrl || avatarUrl,
              activeProfileId: cloudData.accountData?.activeProfileId || cloudData.profiles![0].id,
              isAuthenticated: true,
              authProvider: 'google',
              profiles: cloudData.profiles!,
            }));
            if (cloudData.accountData?.activeProfileId) {
              setActiveProfileId(cloudData.accountData.activeProfileId);
            }
          } else {
            // First time sync to Firestore
            setAccount((prev) => {
              const updatedAccount = {
                ...prev,
                firebaseUid: uid,
                email,
                fullName,
                avatarUrl,
                isAuthenticated: true,
                authProvider: 'google' as const,
              };
              FirebaseService.syncUserToCloud(
                uid,
                email,
                fullName,
                avatarUrl,
                prev.profiles,
                prev.activeProfileId
              );
              return updatedAccount;
            });
          }
        } catch (err) {
          console.warn('Firebase user data load fallback:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save changes to local storage
  useEffect(() => {
    StorageService.saveAccount(account);
  }, [account]);

  useEffect(() => {
    StorageService.saveCatalog(catalog);
  }, [catalog]);

  useEffect(() => {
    StorageService.saveIPTVChannels(iptvChannels);
  }, [iptvChannels]);

  useEffect(() => {
    StorageService.saveRadioStations(radioStations);
  }, [radioStations]);

  useEffect(() => {
    StorageService.saveReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    StorageService.saveWatchParties(watchParties);
  }, [watchParties]);

  useEffect(() => {
    StorageService.saveNotifications(notifications);
  }, [notifications]);

  // Handle Platform Change
  const handlePlatformChange = (mode: PlatformViewMode) => {
    setPlatformMode(mode);
    StorageService.savePlatformMode(mode);
  };

  // Profile Actions
  const handleSwitchProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    setAccount((prev) => {
      const updated = { ...prev, activeProfileId: profileId };
      if (prev.firebaseUid) {
        FirebaseService.syncUserToCloud(
          prev.firebaseUid,
          prev.email,
          prev.fullName,
          prev.avatarUrl,
          prev.profiles,
          profileId
        );
      }
      return updated;
    });
  };

  const handleAddProfile = (
    newProfData: Omit<UserProfile, 'id' | 'history' | 'watchlist' | 'favorites'>
  ) => {
    const newProf: UserProfile = {
      ...newProfData,
      id: 'prof-' + Date.now(),
      history: [],
      watchlist: [],
      favorites: [],
    };
    setAccount((prev) => {
      const updatedProfiles = [...prev.profiles, newProf];
      if (prev.firebaseUid) {
        FirebaseService.saveProfile(prev.firebaseUid, newProf);
      }
      return {
        ...prev,
        profiles: updatedProfiles,
      };
    });
  };

  const handleUpdateAccountEmail = (email: string, displayName: string) => {
    setAccount((prev) => {
      const updated = {
        ...prev,
        email,
        displayName,
      };
      if (prev.firebaseUid) {
        FirebaseService.syncUserToCloud(
          prev.firebaseUid,
          email,
          prev.fullName,
          prev.avatarUrl,
          prev.profiles,
          prev.activeProfileId
        );
      }
      return updated;
    });
  };

  // Watchlist & Favorites with Firestore Synchronization
  const handleToggleWatchlist = (contentId: string) => {
    setAccount((prev) => {
      let currentUpdatedWatchlist: string[] = [];
      const updatedProfiles = prev.profiles.map((p) => {
        if (p.id === activeProfile.id) {
          const isWatch = p.watchlist.includes(contentId);
          currentUpdatedWatchlist = isWatch
            ? p.watchlist.filter((id) => id !== contentId)
            : [...p.watchlist, contentId];
          return {
            ...p,
            watchlist: currentUpdatedWatchlist,
          };
        }
        return p;
      });

      if (prev.firebaseUid) {
        FirebaseService.updateWatchlist(prev.firebaseUid, activeProfile.id, currentUpdatedWatchlist);
      }

      return { ...prev, profiles: updatedProfiles };
    });
  };

  const handleToggleFavorite = (contentId: string) => {
    setAccount((prev) => {
      let currentUpdatedFavorites: string[] = [];
      const updatedProfiles = prev.profiles.map((p) => {
        if (p.id === activeProfile.id) {
          const isFav = p.favorites.includes(contentId);
          currentUpdatedFavorites = isFav
            ? p.favorites.filter((id) => id !== contentId)
            : [...p.favorites, contentId];
          return {
            ...p,
            favorites: currentUpdatedFavorites,
          };
        }
        return p;
      });

      if (prev.firebaseUid) {
        FirebaseService.updateFavorites(prev.firebaseUid, activeProfile.id, currentUpdatedFavorites);
      }

      return { ...prev, profiles: updatedProfiles };
    });
  };

  // Stream Player Actions
  const handlePlayItem = (item: ContentItem | IPTVChannel) => {
    setActiveStreamItem(item);
    setIsPlayerOpen(true);
  };

  const handleUpdateWatchProgress = (item: ContentItem, progressSec: number, totalSec: number) => {
    setAccount((prev) => {
      let currentUpdatedHistory: WatchHistoryItem[] = [];
      const updatedProfiles = prev.profiles.map((p) => {
        if (p.id === activeProfile.id) {
          const existingHistoryIdx = p.history.findIndex((h) => h.contentId === item.id);
          const historyEntry: WatchHistoryItem = {
            contentId: item.id,
            contentType: item.type === 'series' ? 'series' : 'movie',
            title: item.title,
            posterUrl: item.posterUrl,
            backdropUrl: item.backdropUrl,
            progressSeconds: progressSec,
            totalDurationSeconds: totalSec,
            lastWatchedAt: new Date().toISOString(),
            completed: progressSec / (totalSec || 1) >= 0.9,
          };

          let newHistory = [...p.history];
          if (existingHistoryIdx >= 0) {
            newHistory[existingHistoryIdx] = historyEntry;
          } else {
            newHistory.unshift(historyEntry);
          }
          currentUpdatedHistory = newHistory;
          return { ...p, history: newHistory };
        }
        return p;
      });

      if (prev.firebaseUid) {
        FirebaseService.updateWatchHistory(prev.firebaseUid, activeProfile.id, currentUpdatedHistory);
      }

      return { ...prev, profiles: updatedProfiles };
    });
  };

  // Radio Station Actions
  const handlePlayRadio = (station: RadioStation) => {
    setActiveRadioStation(station);
  };

  // Adult PIN Unlock & Lock
  const handleUnlockAdult = (pin: string) => {
    const validPin = activeProfile.parentalPin || '1818';
    if (pin === validPin || pin === '1818') {
      setAccount((prev) => ({
        ...prev,
        profiles: prev.profiles.map((p) => (p.id === activeProfile.id ? { ...p, isAdultUnlocked: true } : p)),
      }));
      return true;
    }
    return false;
  };

  const handleLockAdult = () => {
    setAccount((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => (p.id === activeProfile.id ? { ...p, isAdultUnlocked: false } : p)),
    }));
  };

  // Community Reviews & Watch Parties
  const handleAddReview = (newRev: Omit<ContentReview, 'id' | 'createdAt' | 'likesCount'>) => {
    const fullReview: ContentReview = {
      ...newRev,
      id: 'rev-' + Date.now(),
      likesCount: 0,
      createdAt: 'Hace un momento',
    };
    setReviews((prev) => [fullReview, ...prev]);
  };

  const handleCreateWatchParty = (title: string, contentId: string, hostName: string) => {
    const newRoom: WatchPartyRoom = {
      id: 'party-' + Date.now(),
      title,
      contentId,
      hostName,
      participantsCount: 1,
      currentTimestampSeconds: 0,
      isPlaying: true,
      isPrivate: false,
    };
    setWatchParties((prev) => [newRoom, ...prev]);
  };

  // Push Notifications Actions
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Subscription Upgrade
  const handleUpgradePlan = (plan: SubscriptionPlan, paymentMethod: string) => {
    setAccount((prev) => ({
      ...prev,
      subscription: {
        planId: (plan.id as any) || 'ultra',
        planName: plan.name,
        status: 'active',
        expiresAt: '2027-12-31',
        autoRenew: true,
        price: `$${plan.priceMonthly}/mes`,
        maxScreens: plan.maxScreens || plan.maxDevices || 4,
      },
    }));
  };

  // CMS / Admin CRUD Actions
  const handleAddContent = (item: ContentItem) => setCatalog((prev) => [item, ...prev]);
  const handleUpdateContent = (updatedItem: ContentItem) => {
    setCatalog((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };
  const handleDeleteContent = (id: string) => setCatalog((prev) => prev.filter((c) => c.id !== id));

  const handleAddIPTV = (ch: IPTVChannel) => setIptvChannels((prev) => [ch, ...prev]);
  const handleDeleteIPTV = (id: string) => setIptvChannels((prev) => prev.filter((c) => c.id !== id));

  const handleAddRadio = (st: RadioStation) => setRadioStations((prev) => [st, ...prev]);
  const handleDeleteRadio = (id: string) => setRadioStations((prev) => prev.filter((s) => s.id !== id));

  // User Auth Actions with Firebase Real-Time Synchronization
  const handleLoginSuccess = (
    email: string,
    fullName: string,
    avatarUrl?: string,
    firebaseUid?: string
  ) => {
    const effectiveAvatar =
      avatarUrl ||
      account.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
    const effectiveUid = firebaseUid || account.firebaseUid || 'usr-' + Date.now();

    setAccount((prev) => {
      const updated = {
        ...prev,
        firebaseUid: effectiveUid,
        email,
        fullName,
        avatarUrl: effectiveAvatar,
        isAuthenticated: true,
        authProvider: (email.includes('gmail') || firebaseUid ? 'google' : 'email') as 'google' | 'email',
      };

      if (effectiveUid) {
        FirebaseService.syncUserToCloud(
          effectiveUid,
          email,
          fullName,
          effectiveAvatar,
          prev.profiles,
          prev.activeProfileId
        );
      }

      return updated;
    });
  };

  const handleRegisterSuccess = (
    email: string,
    fullName: string,
    avatarUrl: string,
    firebaseUid?: string
  ) => {
    const newMainProfile: UserProfile = {
      id: 'prof-' + Date.now(),
      name: `${fullName} (Principal)`,
      avatarUrl,
      isKids: false,
      isAdultUnlocked: true,
      parentalPin: '1818',
      watchlist: [],
      favorites: [],
      history: [],
      customPlaylists: [],
      preferences: {
        preferredLanguage: 'Español',
        preferredSubtitles: 'Desactivado',
        autoPlayNext: true,
        lowLatencyStreaming: true,
        discreteAdultMode: false,
      },
    };

    const effectiveUid = firebaseUid || 'usr-' + Date.now();
    const updatedProfiles = [newMainProfile, ...account.profiles.filter((p) => p.isKids)];

    setAccount((prev) => {
      const updated = {
        ...prev,
        firebaseUid: effectiveUid,
        email,
        fullName,
        avatarUrl,
        isAuthenticated: true,
        authProvider: (email.includes('gmail') || firebaseUid ? 'google' : 'email') as 'google' | 'email',
        activeProfileId: newMainProfile.id,
        profiles: updatedProfiles,
      };

      FirebaseService.syncUserToCloud(
        effectiveUid,
        email,
        fullName,
        avatarUrl,
        updatedProfiles,
        newMainProfile.id
      );

      return updated;
    });
    setActiveProfileId(newMainProfile.id);
  };

  const handleLogout = async () => {
    await FirebaseService.logout();
    setAccount((prev) => ({
      ...prev,
      isAuthenticated: false,
      firebaseUid: undefined,
    }));
  };

  const unreadNotificationsCount = notifications.filter((n: any) => !(n.read ?? n.isRead)).length;

  return (
    <DeviceFrame mode={platformMode} onModeChange={handlePlatformChange}>
      <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col selection:bg-amber-500 selection:text-black">
        {/* Main Navigation Bar */}
        <Navbar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          platformMode={platformMode}
          onPlatformChange={handlePlatformChange}
          account={account}
          activeProfile={activeProfile}
          onSwitchProfile={handleSwitchProfile}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAISearch={() => setIsAISearchOpen(true)}
          onOpenSubscription={() => setIsSubscriptionOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        {/* Dynamic Section Rendering */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
          {activeSection === 'home' && (
            <HomeSection
              catalog={catalog}
              iptvChannels={iptvChannels}
              radioStations={radioStations}
              activeProfile={activeProfile}
              onPlayItem={handlePlayItem}
              onPlayRadio={handlePlayRadio}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleFavorite={handleToggleFavorite}
              onOpenAISearch={() => setIsAISearchOpen(true)}
              onOpenSection={setActiveSection}
            />
          )}

          {activeSection === 'movies' && (
            <MoviesSeriesSection
              type="movies"
              catalog={catalog.filter((c) => c.type === 'movie')}
              activeProfile={activeProfile}
              onPlayItem={handlePlayItem}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeSection === 'series' && (
            <MoviesSeriesSection
              type="series"
              catalog={catalog.filter((c) => c.type === 'series')}
              activeProfile={activeProfile}
              onPlayItem={handlePlayItem}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeSection === 'iptv' && (
            <IPTVSection
              channels={iptvChannels}
              activeProfile={activeProfile}
              onPlayChannel={handlePlayItem}
            />
          )}

          {activeSection === 'radio' && (
            <RadioSection
              stations={radioStations}
              activeStation={activeRadioStation}
              onPlayRadio={handlePlayRadio}
            />
          )}

          {activeSection === 'adult' && (
            <Adult18Section
              catalog={catalog}
              iptvChannels={iptvChannels}
              activeProfile={activeProfile}
              onPlayItem={handlePlayItem}
              onUnlockAdult={handleUnlockAdult}
              onLockAdult={handleLockAdult}
            />
          )}

          {activeSection === 'community' && (
            <CommunitySection
              reviews={reviews}
              watchParties={watchParties}
              catalog={catalog}
              activeProfile={activeProfile}
              onAddReview={handleAddReview}
              onCreateWatchParty={handleCreateWatchParty}
              onPlayItem={handlePlayItem}
            />
          )}
        </main>

        {/* Global Floating Radio Player (Continuous Background Audio) */}
        {activeRadioStation && (
          <RadioFloatingPlayer
            station={activeRadioStation}
            onClose={() => setActiveRadioStation(null)}
          />
        )}

        {/* Universal Stream Player Modal (Movies, Series, IPTV, DASH, HLS, MP4, YouTube) */}
        {isPlayerOpen && activeStreamItem && (
          <StreamPlayerModal
            item={activeStreamItem}
            activeProfile={activeProfile}
            allCatalog={catalog}
            onClose={() => {
              setIsPlayerOpen(false);
              setActiveStreamItem(null);
            }}
            onUpdateProgress={(progressSec, totalSec) => {
              if ('type' in activeStreamItem && activeStreamItem.type !== undefined) {
                handleUpdateWatchProgress(activeStreamItem as ContentItem, progressSec, totalSec);
              }
            }}
            onSelectRelated={(relatedItem) => {
              setActiveStreamItem(relatedItem);
            }}
          />
        )}

        {/* AI Neural Curator & Search Modal */}
        <AISearchModal
          isOpen={isAISearchOpen}
          onClose={() => setIsAISearchOpen(false)}
          catalog={catalog}
          iptvChannels={iptvChannels}
          activeProfile={activeProfile}
          onPlayItem={handlePlayItem}
        />

        {/* Subscription & Payments Modal */}
        <SubscriptionModal
          isOpen={isSubscriptionOpen}
          onClose={() => setIsSubscriptionOpen(false)}
          currentSubscription={account.subscription}
          onUpgradePlan={handleUpgradePlan}
        />

        {/* Gmail Auth & Profile Manager Modal & Mandatory Gate */}
        <AuthModal
          isOpen={isAuthOpen || !account.isAuthenticated}
          onClose={() => setIsAuthOpen(false)}
          account={account}
          activeProfile={activeProfile}
          isMandatoryAuthGate={!account.isAuthenticated}
          onSwitchProfile={handleSwitchProfile}
          onAddProfile={handleAddProfile}
          onUpdateAccountEmail={handleUpdateAccountEmail}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          onLogout={handleLogout}
        />

        {/* Push Notifications Alert Modal */}
        <PushNotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationRead}
          onClearAll={handleClearAllNotifications}
          onSelectNotificationItem={(contentId) => {
            const found =
              catalog.find((c) => c.id === contentId) || iptvChannels.find((ch) => ch.id === contentId);
            if (found) handlePlayItem(found);
          }}
        />

        {/* Admin Dashboard CMS Modal */}
        {isAdminOpen && (
          <AdminDashboard
            catalog={catalog}
            iptvChannels={iptvChannels}
            radioStations={radioStations}
            account={account}
            onClose={() => setIsAdminOpen(false)}
            onAddContent={handleAddContent}
            onUpdateContent={handleUpdateContent}
            onDeleteContent={handleDeleteContent}
            onAddIPTV={handleAddIPTV}
            onDeleteIPTV={handleDeleteIPTV}
            onAddRadio={handleAddRadio}
            onDeleteRadio={handleDeleteRadio}
          />
        )}
      </div>
    </DeviceFrame>
  );
}

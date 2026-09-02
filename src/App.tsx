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
} from './types';
import { StorageService } from './services/storage';

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
  const [activeProfileId, setActiveProfileId] = useState<string>(account.activeProfileId || account.profiles[0].id);
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

  // Save changes to storage
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
    setAccount((prev) => ({ ...prev, activeProfileId: profileId }));
  };

  const handleAddProfile = (newProfData: Omit<UserProfile, 'id' | 'history' | 'watchlist' | 'favorites'>) => {
    const newProf: UserProfile = {
      ...newProfData,
      id: 'prof-' + Date.now(),
      history: [],
      watchlist: [],
      favorites: [],
    };
    setAccount((prev) => ({
      ...prev,
      profiles: [...prev.profiles, newProf],
    }));
  };

  const handleUpdateAccountEmail = (email: string, displayName: string) => {
    setAccount((prev) => ({
      ...prev,
      email,
      displayName,
    }));
  };

  // Watchlist & Favorites
  const handleToggleWatchlist = (contentId: string) => {
    setAccount((prev) => {
      const updatedProfiles = prev.profiles.map((p) => {
        if (p.id === activeProfile.id) {
          const isWatch = p.watchlist.includes(contentId);
          return {
            ...p,
            watchlist: isWatch ? p.watchlist.filter((id) => id !== contentId) : [...p.watchlist, contentId],
          };
        }
        return p;
      });
      return { ...prev, profiles: updatedProfiles };
    });
  };

  const handleToggleFavorite = (contentId: string) => {
    setAccount((prev) => {
      const updatedProfiles = prev.profiles.map((p) => {
        if (p.id === activeProfile.id) {
          const isFav = p.favorites.includes(contentId);
          return {
            ...p,
            favorites: isFav ? p.favorites.filter((id) => id !== contentId) : [...p.favorites, contentId],
          };
        }
        return p;
      });
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
      const updatedProfiles = prev.profiles.map((p) => {
        if (p.id === activeProfile.id) {
          const existingHistoryIdx = p.history.findIndex((h) => h.contentId === item.id);
          const historyEntry = {
            contentId: item.id,
            title: item.title,
            posterUrl: item.posterUrl,
            backdropUrl: item.backdropUrl,
            progressSeconds: progressSec,
            totalDurationSeconds: totalSec,
            lastWatchedAt: new Date().toISOString(),
          };

          let newHistory = [...p.history];
          if (existingHistoryIdx >= 0) {
            newHistory[existingHistoryIdx] = historyEntry;
          } else {
            newHistory.unshift(historyEntry);
          }
          return { ...p, history: newHistory };
        }
        return p;
      });
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

  // User Auth Actions
  const handleLoginSuccess = (email: string, fullName: string) => {
    setAccount((prev) => ({
      ...prev,
      email,
      fullName,
      isAuthenticated: true,
      authProvider: email.includes('gmail') ? 'google' : 'email',
    }));
  };

  const handleRegisterSuccess = (email: string, fullName: string, avatarUrl: string) => {
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

    setAccount((prev) => ({
      ...prev,
      email,
      fullName,
      avatarUrl,
      isAuthenticated: true,
      authProvider: 'email',
      activeProfileId: newMainProfile.id,
      profiles: [newMainProfile, ...prev.profiles.filter((p) => p.isKids)],
    }));
    setActiveProfileId(newMainProfile.id);
  };

  const handleLogout = () => {
    setAccount((prev) => ({
      ...prev,
      isAuthenticated: false,
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
          onOpenSearch={() => setIsAISearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenSubscription={() => setIsSubscriptionOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        {/* Main Section Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4 pb-20 lg:pb-8">
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
              catalog={catalog}
              activeProfile={activeProfile}
              filterType="movie"
              onPlayItem={handlePlayItem}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeSection === 'series' && (
            <MoviesSeriesSection
              catalog={catalog}
              activeProfile={activeProfile}
              filterType="series"
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
              onPlayStation={handlePlayRadio}
            />
          )}

          {activeSection === 'adult18' && (
            <Adult18Section
              catalog={catalog}
              iptvChannels={iptvChannels}
              activeProfile={activeProfile}
              onUnlockAdult={handleUnlockAdult}
              onLockAdult={handleLockAdult}
              onPlayItem={handlePlayItem}
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
            />
          )}
        </main>

        {/* Persistent Floating Live Radio Player */}
        <RadioFloatingPlayer
          station={activeRadioStation}
          onClose={() => setActiveRadioStation(null)}
          onOpenRadioSection={() => setActiveSection('radio')}
        />

        {/* Video & IPTV Stream Player Modal */}
        <StreamPlayerModal
          item={activeStreamItem}
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          activeProfile={activeProfile}
          catalog={catalog}
          onPlayItem={handlePlayItem}
          onUpdateWatchProgress={handleUpdateWatchProgress}
          onToggleWatchlist={handleToggleWatchlist}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={activeStreamItem ? activeProfile.favorites.includes(activeStreamItem.id) : false}
          isWatchlisted={activeStreamItem ? activeProfile.watchlist.includes(activeStreamItem.id) : false}
        />

        {/* AI Semantic Search Modal */}
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
            const found = catalog.find((c) => c.id === contentId) || iptvChannels.find((ch) => ch.id === contentId);
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

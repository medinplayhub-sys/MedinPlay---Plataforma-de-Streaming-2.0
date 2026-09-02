import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  collection,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserAccount, UserProfile, WatchHistoryItem } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Test connection on boot as mandated
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
  }
}

// Firebase Cloud Sync Service
export const FirebaseService = {
  // Real Gmail/Google Login Popup
  async loginWithGoogle(): Promise<{
    user: FirebaseUser;
    email: string;
    fullName: string;
    avatarUrl: string;
  }> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email || '';
      const fullName = user.displayName || email.split('@')[0];
      const avatarUrl =
        user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';

      return { user, email, fullName, avatarUrl };
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      throw err;
    }
  },

  // Log Out
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  },

  // Subscribe to Auth State
  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Load User Data from Firestore
  async loadUserData(userId: string): Promise<{
    accountData?: Partial<UserAccount>;
    profiles?: UserProfile[];
  } | null> {
    const userDocRef = doc(db, 'users', userId);
    try {
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) {
        return null;
      }

      const userData = userSnap.data();

      // Fetch profiles subcollection
      const profilesRef = collection(db, 'users', userId, 'profiles');
      const profilesSnap = await getDocs(profilesRef);

      const profiles: UserProfile[] = [];
      profilesSnap.forEach((docSnap) => {
        const pData = docSnap.data();
        profiles.push({
          id: docSnap.id,
          name: pData.name || 'Perfil',
          avatarUrl: pData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
          isKids: !!pData.isKids,
          isAdultUnlocked: !!pData.isAdultUnlocked,
          parentalPin: pData.parentalPin || '1818',
          watchlist: pData.watchlist || [],
          favorites: pData.favorites || [],
          history: pData.history || [],
          customPlaylists: pData.customPlaylists || [],
          preferences: pData.preferences || {
            preferredLanguage: 'Español',
            preferredSubtitles: 'Desactivado',
            autoPlayNext: true,
            lowLatencyStreaming: true,
            discreteAdultMode: false,
          },
        });
      });

      return {
        accountData: {
          email: userData.email,
          fullName: userData.fullName,
          avatarUrl: userData.avatarUrl,
          activeProfileId: userData.activeProfileId,
        },
        profiles: profiles.length > 0 ? profiles : undefined,
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
      return null;
    }
  },

  // Sync / Save Full Account & Profiles to Firestore
  async syncUserToCloud(
    userId: string,
    email: string,
    fullName: string,
    avatarUrl: string,
    profiles: UserProfile[],
    activeProfileId: string
  ) {
    const userDocRef = doc(db, 'users', userId);
    try {
      await setDoc(
        userDocRef,
        {
          email,
          fullName,
          avatarUrl,
          activeProfileId,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // Save each profile in subcollection
      for (const profile of profiles) {
        const profileDocRef = doc(db, 'users', userId, 'profiles', profile.id);
        await setDoc(
          profileDocRef,
          {
            name: profile.name,
            avatarUrl: profile.avatarUrl,
            isKids: profile.isKids,
            isAdultUnlocked: profile.isAdultUnlocked,
            parentalPin: profile.parentalPin || '1818',
            watchlist: profile.watchlist || [],
            favorites: profile.favorites || [],
            history: profile.history || [],
            customPlaylists: profile.customPlaylists || [],
            preferences: profile.preferences || {},
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    }
  },

  // Update specific profile watchlist
  async updateWatchlist(userId: string, profileId: string, watchlist: string[]) {
    if (!userId || !profileId) return;
    const profileDocRef = doc(db, 'users', userId, 'profiles', profileId);
    try {
      await setDoc(
        profileDocRef,
        {
          watchlist,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/profiles/${profileId}`);
    }
  },

  // Update specific profile favorites
  async updateFavorites(userId: string, profileId: string, favorites: string[]) {
    if (!userId || !profileId) return;
    const profileDocRef = doc(db, 'users', userId, 'profiles', profileId);
    try {
      await setDoc(
        profileDocRef,
        {
          favorites,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/profiles/${profileId}`);
    }
  },

  // Update specific profile watch progress / history
  async updateWatchHistory(userId: string, profileId: string, history: WatchHistoryItem[]) {
    if (!userId || !profileId) return;
    const profileDocRef = doc(db, 'users', userId, 'profiles', profileId);
    try {
      await setDoc(
        profileDocRef,
        {
          history,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/profiles/${profileId}`);
    }
  },

  // Add / update new profile
  async saveProfile(userId: string, profile: UserProfile) {
    if (!userId) return;
    const profileDocRef = doc(db, 'users', userId, 'profiles', profile.id);
    try {
      await setDoc(
        profileDocRef,
        {
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          isKids: profile.isKids,
          isAdultUnlocked: profile.isAdultUnlocked,
          parentalPin: profile.parentalPin || '1818',
          watchlist: profile.watchlist || [],
          favorites: profile.favorites || [],
          history: profile.history || [],
          customPlaylists: profile.customPlaylists || [],
          preferences: profile.preferences || {},
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}/profiles/${profile.id}`);
    }
  },
};

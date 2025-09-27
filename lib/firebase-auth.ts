import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  address_type?: 'casa' | 'departamento';
  floor?: string;
  buzzer?: string;
  is_admin?: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface User extends UserProfile {}

// Función para crear/actualizar perfil de usuario en Firestore
export const createUserProfile = async (firebaseUser: FirebaseUser, additionalData?: any) => {
  if (!firebaseUser) return;

  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = firebaseUser;
    const createdAt = new Date().toISOString();

    try {
      await setDoc(userRef, {
        id: firebaseUser.uid,
        name: displayName || additionalData?.name || '',
        email: email || '',
        phone: additionalData?.phone || null,
        address: additionalData?.address || null,
        address_type: additionalData?.addressType || null,
        floor: additionalData?.floor || null,
        buzzer: additionalData?.buzzer || null,
        is_admin: false,
        avatar_url: photoURL || null,
        created_at: createdAt,
        updated_at: createdAt,
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }

  return userRef;
};

// Función para obtener perfil de usuario desde Firestore
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Función para actualizar perfil de usuario
export const updateUserProfile = async (userId: string, userData: Partial<UserProfile>): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updated_at: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Función de login con email y contraseña
export const loginWithEmail = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userProfile = await getUserProfile(result.user.uid);
    
    if (userProfile) {
      return { success: true, user: userProfile };
    } else {
      // Si no existe el perfil, crearlo
      await createUserProfile(result.user);
      const newProfile = await getUserProfile(result.user.uid);
      return { success: true, user: newProfile };
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

// Función de registro con email y contraseña
export const registerWithEmail = async (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  addressType?: 'casa' | 'departamento';
  floor?: string;
  buzzer?: string;
}): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    
    // Actualizar el perfil de Firebase Auth
    await updateProfile(result.user, {
      displayName: userData.name,
    });

    // Crear perfil en Firestore
    await createUserProfile(result.user, userData);
    
    // Enviar email de verificación
    await sendEmailVerification(result.user);

    const userProfile = await getUserProfile(result.user.uid);
    return { success: true, user: userProfile };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

// Función de login con Google
export const loginWithGoogle = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Crear o actualizar perfil en Firestore
    await createUserProfile(result.user);
    
    const userProfile = await getUserProfile(result.user.uid);
    return { success: true, user: userProfile };
  } catch (error: any) {
    console.error('Google login error:', error);
    return { success: false, error: error.message };
  }
};

// Función de logout
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Función para escuchar cambios de autenticación
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userProfile = await getUserProfile(firebaseUser.uid);
      callback(userProfile);
    } else {
      callback(null);
    }
  });
};

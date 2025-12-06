import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBQfyjMHQDr-McSK0f5vaYgxeqysmWTUDQ",
  authDomain: "craly-ai.firebaseapp.com",
  projectId: "craly-ai",
  storageBucket: "craly-ai.firebasestorage.app",
  messagingSenderId: "1056539490760",
  appId: "1:1056539490760:android:7478bbdb0aeb0ae88de8fd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;


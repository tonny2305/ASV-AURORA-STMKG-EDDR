import { initializeApp, type FirebaseApp } from "firebase/app"
import { getDatabase } from "firebase/database"

// Prefer env-based configuration; fall back to provided values if not set
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD8_uDhDO2QYesxQzZ8uZO2Nh7HHhTM2Lw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "asvmonitoring.firebaseapp.com",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://asvmonitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "asvmonitoring",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "asvmonitoring.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "407093477147",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:407093477147:web:f1ea5259be1cff79a25dbe",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-VQ89DV6SRN",
}

// Initialize once
let app: FirebaseApp
if (!globalThis.__FIREBASE_APP__) {
  console.log("🔥 Firebase config:", {
    databaseURL: firebaseConfig.databaseURL,
    projectId: firebaseConfig.projectId
  })
  app = initializeApp(firebaseConfig)
  // @ts-expect-error attach to global to prevent re-init during HMR
  globalThis.__FIREBASE_APP__ = app
} else {
  // @ts-expect-error read from global
  app = globalThis.__FIREBASE_APP__
}

export { app }
// Note: getAnalytics requires browser; initialized in a client component to avoid SSR issues.
export const db = getDatabase(app)

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDYKWcnZPsAhSP2UieTy39L9Vhiu2c_4Hc",
  authDomain: "wisdom-612ce.firebaseapp.com",
  projectId: "wisdom-612ce",
  storageBucket: "wisdom-612ce.firebasestorage.app",
  messagingSenderId: "867523203910",
  appId: "1:867523203910:web:3b60c9cbf60ed96f008b47",
  measurementId: "G-E4TWEFJ26Y",
  databaseURL: "https://wisdom-612ce-default-rtdb.firebaseio.com" // 추가된 부분
};

// Initialize Firebase (SSR 고려: 이미 초기화되었는지 확인)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Realtime Database 인스턴스
const database = getDatabase(app);

// Analytics (클라이언트 사이드에서만 실행)
const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export { app, database, analytics };

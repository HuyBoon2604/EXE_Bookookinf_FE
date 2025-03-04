import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Thêm cấu hình Firebase của bạn vào đây
  apiKey: "AIzaSyB5u-YbGJUXH_hJTfg_TrXnpa_csUOaeEg",
  authDomain: "studiodancebooking.firebaseapp.com",
  projectId: "studiodancebooking",
  storageBucket: "studiodancebooking.appspot.com",
  messagingSenderId: "100000000000",
  appId: "1:100000000000:web:1234567890abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
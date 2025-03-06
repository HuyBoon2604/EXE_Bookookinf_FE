import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Thêm cấu hình Firebase của bạn vào đây
  // apiKey: "AIzaSyB5u-YbGJUXH_hJTfg_TrXnpa_csUOaeEg",
  // authDomain: "studiodancebooking.firebaseapp.com",
  // projectId: "studiodancebooking",
  // storageBucket: "studiodancebooking.appspot.com",
  // messagingSenderId: "100000000000",
  // appId: "1:100000000000:web:1234567890abcdef123456"
  apiKey: "AIzaSyDC7u8BZ5u4mnLttZaXYjrW7M70ckPZ0xk",
  authDomain: "cursusprojectinternship.firebaseapp.com",
  projectId: "cursusprojectinternship",
  storageBucket: "cursusprojectinternship.appspot.com",
  messagingSenderId: "287668906476",
  appId: "1:287668906476:web:494b6505d33a7fabadb8c9",
  measurementId: "G-NLKVWTMQEN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
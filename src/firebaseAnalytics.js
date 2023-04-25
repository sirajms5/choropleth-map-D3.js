 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
   apiKey: "AIzaSyBE85dVOck-ooEn9YUyNLCcMxNGWQ4_GGw",
   authDomain: "sirajsaleem-domain.firebaseapp.com",
   projectId: "sirajsaleem-domain",
   storageBucket: "sirajsaleem-domain.appspot.com",
   messagingSenderId: "881709896673",
   appId: "1:881709896673:web:5706d584f1287c775af8a0",
   measurementId: "G-NJ5BPWDNP0"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);
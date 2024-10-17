import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import axios from "axios";
import { FCM_URLS } from "../utils/config";

const firebaseConfig = {
  apiKey: "AIzaSyCyifgIjCeo5jHF1by1SuyYA2mM_rN-hiw",
  authDomain: "pushnotifications-fb14a.firebaseapp.com",
  projectId: "pushnotifications-fb14a",
  storageBucket: "pushnotifications-fb14a.appspot.com",
  messagingSenderId: "924046382081",
  appId: "1:924046382081:web:14dec6415ec0803d9e5c00",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  const vapidKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
  const permission = await Notification.requestPermission();
  // console.log(permission);

  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth.userId;
  const userRole = auth.role;

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey,
    });

    // console.log(token);
    localStorage.setItem("fcm_token", JSON.stringify(token));

    axios
      .post(FCM_URLS.FCM_TOKEN_CREATE_URL, {
        userId: userId,
        fcmToken: token,
        role: userRole,
      })
      .then((response) => {
        console.log("Token saved successfully", response);
      })
      .catch((error) => {
        // console.error("Error saving token", error);
      });
  }
};

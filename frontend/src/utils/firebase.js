import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"

const firebaseConfig = {
  apiKey:            "AIzaSyDyibDitZMi-TSutVZ0NVAfnQ3j08XJ2-4",
  authDomain:        "dsa-analyzer-78267.firebaseapp.com",
  projectId:         "dsa-analyzer-78267",
  storageBucket:     "dsa-analyzer-78267.firebasestorage.app",
  messagingSenderId: "102333960145",
  appId:             "1:102333960145:web:642fdd1752d21637f51af0",
}

const app      = initializeApp(firebaseConfig)
export const auth     = getAuth(app)
export const provider = new GoogleAuthProvider()

// Only allow Gmail accounts
provider.setCustomParameters({ hd: "gmail.com" })

export const signInWithGoogle = () => signInWithPopup(auth, provider)
export const signOutUser      = () => signOut(auth)

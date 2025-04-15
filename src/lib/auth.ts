import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  UserCredential,
} from "firebase/auth";

import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore();

export const createUserPermission = async (user: any) => {
  const userRef = doc(db, "userPermissions", user.uid);
  await setDoc(userRef, {
    role: "user",
    permission: "view",
  });
};

export const signUp = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async (): Promise<void> => {
  return signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

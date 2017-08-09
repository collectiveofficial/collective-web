import { ref, firebaseAuth } from '../config';

export function createNativeUser(email, pw) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw);
}

export function nativeLogout() {
  return firebaseAuth().signOut();
}

export function nativeLogin(email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw);
}

export function resetNativePassword(email) {
  return firebaseAuth().sendPasswordResetEmail(email);
}

export function saveNativeUser(user) {
  return ref.child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid,
    })
    .then(() => user);
}

import { ref, firebaseAuth } from '../config';

export function createNativeUser (email, pw) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
  // .catch(function(error) {
  //   // Handle Errors here.
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   if (errorCode == 'auth/weak-password') {
  //     alert('The password is too weak.');
  //   } else {
  //     alert(errorMessage);
  //   }
  //   console.log(error);
  // });
    // .then(saveUser)
}

export function nativeLogout () {
  return firebaseAuth().signOut()
}

export function nativeLogin (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function resetNativePassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export function saveNativeUser (user) {
  return ref.child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)
}

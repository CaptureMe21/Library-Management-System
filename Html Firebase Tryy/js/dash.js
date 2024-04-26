// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, update, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD542ixuUPqhloWihSDknkw81fDG2Jy2rs",
  authDomain: "lms-try-3fdf2.firebaseapp.com",
  databaseURL: "https://lms-try-3fdf2-default-rtdb.firebaseio.com",
  projectId: "lms-try-3fdf2",
  storageBucket: "lms-try-3fdf2.appspot.com",
  messagingSenderId: "922498078551",
  appId: "1:922498078551:web:c4a74fa3e833b1103a1012"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

// Function to get total number of books
function getTotalUser() {
const booksRef = ref(db, 'Users');
  get(booksRef).then((snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userCount = Object.keys(userData).length;
      document.getElementById('totalUser').innerText = `Registered User: ${userCount}`;
    } else {
      console.log("No data available");
    }
}).catch((error) => {
  console.error("Error getting data: ", error);
});
}
// Call getTotalBooks() when the page loads
getTotalUser();

// Function to get total number of books
function getTotalBooks() {
const booksRef = ref(db, 'Books');
  get(booksRef).then((snapshot) => {
    if (snapshot.exists()) {
      const bookData = snapshot.val();
      const bookCount = Object.keys(bookData).length;
      document.getElementById('totalBooks').innerText = `Total Books: ${bookCount}`;
    } else {
      console.log("No data available");
    }
}).catch((error) => {
  console.error("Error getting data: ", error);
});
}
// Call getTotalBooks() when the page loads
getTotalBooks();

// Function to get total number of books
function getTotalUnavailable() {
  const booksRef = ref(db, 'UnavailableBooks');
    get(booksRef).then((snapshot) => {
      if (snapshot.exists()) {
        const bookData = snapshot.val();
        const bookCount = Object.keys(bookData).length;
        document.getElementById('totalUnreturned').innerText = `Unreturned Books: ${bookCount}`;
      } else {
        console.log("No data available");
      }
  }).catch((error) => {
    console.error("Error getting data: ", error);
  });
  }
  // Call getTotalBooks() when the page loads
  getTotalUnavailable();

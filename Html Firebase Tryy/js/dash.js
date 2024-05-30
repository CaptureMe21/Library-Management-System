import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, update, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD542ixuUPqhloWihSDknkw81fDG2Jy2rs",
  authDomain: "lms-try-3fdf2.firebaseapp.com",
  databaseURL: "https://lms-try-3fdf2-default-rtdb.firebaseio.com",
  projectId: "lms-try-3fdf2",
  storageBucket: "lms-try-3fdf2.appspot.com",
  messagingSenderId: "922498078551",
  appId: "1:922498078551:web:c4a74fa3e833b1103a1012"
};

export { app, db, auth};

// Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const auth = getAuth();

  function getTotalUser() {
    const usersRef = ref(db, 'Users');
    get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const nonAdminUsers = Object.values(userData).filter(user => user.admin === 0);
        const nonAdminUserCount = nonAdminUsers.length;
        document.getElementById('totalUser').innerText = `Registered Users: ${nonAdminUserCount}`;
      } else {
        console.log("No data available");
        document.getElementById('totalUser').innerText = `Registered Users: 0`;
      }
    }).catch((error) => {
      console.error("Error getting data: ", error);
    });
  }
  
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
          document.getElementById('totalBooks').innerText = `Total Books: 0`;
          }
      }).catch((error) => {
        console.error("Error getting data: ", error);
      });
    }

getTotalBooks();

// Function to get total number of books
function getTotalUnavailable() {
  const booksRef = ref(db, 'BorrowedBook');
    get(booksRef).then((snapshot) => {
      if (snapshot.exists()) {
        const bookData = snapshot.val();
        const bookCount = Object.keys(bookData).length;
        document.getElementById('totalUnreturned').innerText = `Unreturned Books: ${bookCount}`;
      } else {
        console.log("No data available");
        document.getElementById('totalUnreturned').innerText = `Unreturned Books: 0`;
      }
  }).catch((error) => {
    console.error("Error getting data: ", error);
  });
  }

  getTotalUnavailable();
  
    // Check if the user is logged in
    window.onload = function() {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) {
          window.location.href = "index.html"; // Redirect to login page
      }
  };


// Function to check if user is authenticated
function checkAuthentication() {
  onAuthStateChanged(auth, (user) => {
      if (!user) {
          // User is not logged in, redirect to login page
          window.location.href = "index.html";
      }
  });
}

// Function to log out
document.getElementById("logout").addEventListener("click", () => {
  signOut(auth)
      .then(() => {
          console.log("User Signed Out Successfully");
          window.localStorage.removeItem('isLoggedIn');
          window.location.href = "index.html"; // Redirect to login page
      })
      .catch((error) => {
          console.error("Error signing out:", error);
      })
      // Call checkAuthentication() when the page loads
      checkAuthentication();
  });    

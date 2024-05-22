import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

export { app, db, auth };

// Function to save announcement
function saveAnnouncement(title, message) {
    const announcementId = Date.now().toString(); // Generate a unique ID based on the current timestamp
    const user = auth.currentUser; // Get the current logged-in user
    
    if (user) {
        const userId = user.uid;
        const userName = user.displayName; // This assumes that the user's display name is already set to "namef namel"
        
        // Get the current date in a human-readable format
        const currentDate = new Date();
        const year = currentDate.getFullYear(); // Get the 4-digit year
        const month = currentDate.getMonth() + 1; // Get the month (0-11, add 1 to get 1-12)
        const day = currentDate.getDate(); // Get the day of the month (1-31)
        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

        // Add announcement to database with current date
        set(ref(db, 'Announcements/' + announcementId), {
            title: title,
            message: message,
            userId: userId,
            userName: userName,
            date: formattedDate // Use the formatted date as the timestamp
        })
        .then(() => {
            alert("Announcement posted successfully!");
            setTimeout(function() {
                window.location.href = "booklist.html";
            }, 1000); // Redirect after 1 second
        })
        .catch((error) => {
            console.error("Error posting announcement: ", error);
        });
    } else {
        console.log("User is not logged in."); // Handle if user is not logged in
    }
}


// Event listener for form submission
document.getElementById('submit').addEventListener('click', function(e) {
    e.preventDefault();
    const title = document.getElementById('postTitle').value;
    const message = document.getElementById('postBody').value;

    if (title && message) {
        saveAnnouncement(title, message);
    } else {
        alert("Please fill out both the title and message fields.");
    }
});

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

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

// Function to get the current maximum ID from the database
async function getCurrentMaxId() {
    try {
        const booksRef = ref(db, 'Books');
        const snapshot = await get(booksRef);
        let maxId = 0;
        snapshot.forEach((childSnapshot) => {
            const bookData = childSnapshot.val();
            const bookId = parseInt(bookData.id);
            if (bookId > maxId) {
                maxId = bookId;
            }
        });
        return maxId;
    } catch (error) {
        console.error("Error getting data:", error);
        throw error;
    }
}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("add").addEventListener('submit', async function(e){
        e.preventDefault();

        try {
            const currentMaxId = await getCurrentMaxId();

            const newBookId = currentMaxId + 1;

            const booksRef = ref(db, 'Books/' + document.getElementById("bnum").value);

            const newBookData = {
                id: newBookId,
                booktitle: document.getElementById("bname").value,
                quantity: document.getElementById("quanti").value,
                author: document.getElementById("author").value,
                genre: document.getElementById("genre").value,
                isbn: document.getElementById("bnum").value,
                shelfnumber: document.getElementById("snum").value,  
                copyright: document.getElementById("yearcopy").value,
                volume: document.getElementById("volume").value,
                edition: document.getElementById("edition").value,
                datereceive: document.getElementById("daterec").value,
                remarks: document.getElementById("remarks").value,
                pagenumber: document.getElementById("pagenum").value
            };

            await set(booksRef, newBookData);


            console.log("Book added successfully with ID:", newBookId);
            alert("Book Added Successfully!");
            setTimeout(function() {
                window.location.href = "booklist.html";
            }, 1000); // Redirect after 1 second
        } catch (error) {
            console.error("Error adding book:", error);
            alert("An Error occured While Adding the Book.");
        }
    });
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

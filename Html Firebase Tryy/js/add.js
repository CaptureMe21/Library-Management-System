import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// Add event listener when DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Add event listener for form submission
    document.getElementById("add").addEventListener('submit', async function(e){
        e.preventDefault();

        try {
            // Get the current maximum ID
            const currentMaxId = await getCurrentMaxId();

            // Increment the current maximum ID for the new book
            const newBookId = currentMaxId + 1;

            // Reference to the 'Books' node in the database
            const booksRef = ref(db, 'Books/' + document.getElementById("bnum").value);

            // Data for the new book with the incremented ID
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
                remarks: document.getElementById("remarks").value
            };

            // Add the new book to the database with the ISBN as the ID
            await set(booksRef, newBookData); // Use set to add data to the ISBN as the ID


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
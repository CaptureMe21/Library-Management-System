import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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

export { app, db, auth};

function displayBooksData() {
    // Reference to the 'BorrowedBooks' node in the database
    const borrowedBooksRef = ref(db, 'BorrowedBook');

    // Listen for changes to the 'BorrowedBooks' node
    onValue(borrowedBooksRef, (snapshot) => {
        const tableBody = document.getElementById('table-body');
        const messageDiv = document.getElementById('message');
        tableBody.innerHTML = ''; // Clear the table body before populating
        messageDiv.innerHTML = ''; // Clear the message div before populating

        if (!snapshot.exists()) {
            // Display a message if no books have been borrowed
            messageDiv.innerHTML = '<p>All books are in place.</p>';
        } else {
            // Iterate over each child of 'BorrowedBooks'
            snapshot.forEach((childSnapshot) => {
                const transactionId = childSnapshot.key; // Get the key (transaction ID)
                const bookData = childSnapshot.val();

                // Append a new row to the table for each book
                tableBody.innerHTML += `
                    <tr>
                        <td>${bookData.booktitle}</a></td>
                        <td>${bookData.isbn}</td>
                        <td>${bookData.quantity}</td>
                        <td>${bookData.bname}</td>
                        <td>${bookData.idnum}</td>
                        <td>${bookData.uid}</td>
                        <td>${bookData.borrowdate}</td>
                        <td>${bookData.returndate}</td>
                        <td>${transactionId}</td>
                    </tr>
                `;
            });

            // Add event listeners to the Update buttons
            const updateButtons = document.querySelectorAll('.update-button');
            updateButtons.forEach((button) => {
                button.addEventListener('click', (event) => {
                    const bookKey = event.target.dataset.key; // Get the key of the book
                    // Redirect to the update page with the book key as a query parameter
                    window.location.href = `update.html?book-key=${bookKey}`;
                });
            });
        }
    });
}

    // Call the function to display books data when the DOM content is loaded
    document.addEventListener('DOMContentLoaded', displayBooksData);
  
    
  function searchBooks() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear the table body before populating

    const borrowedBooksRef = ref(db, 'BorrowedBooks');

    onValue(borrowedBooksRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const transactionId = childSnapshot.key; // Get the key (transaction ID)
            const bookData = childSnapshot.val();

            // Check if any field contains the search term
            if (bookData.booktitle.toLowerCase().includes(searchTerm) ||
                bookData.isbn.toLowerCase().includes(searchTerm) ||
                bookData.quantity.toString().includes(searchTerm) ||
                bookData.name.toLowerCase().includes(searchTerm) ||
                bookData.idnum.toLowerCase().includes(searchTerm) ||
                transactionId.includes(searchTerm)) {
                // Append a new row to the table for each matching book
                tableBody.innerHTML += `
                    <tr>
                        <td>${bookData.booktitle}</a></td>
                        <td>${bookData.isbn}</td>
                        <td>${bookData.quantity}</td>
                        <td>${bookData.bname}</td>
                        <td>${bookData.idnum}</td>
                        <td>${bookData.uid}</td>
                        <td>${bookData.date}</td>
                        <td>${bookData.returndate}</td>
                        <td>${transactionId}</td>
                    </tr>
                `;
            }
        });
    });
}
    
    // Call the function to display books data when the DOM content is loaded
    document.addEventListener('DOMContentLoaded', displayBooksData);
    
    // Add event listener to the search button
document.getElementById("searchee").addEventListener("click", function(event) {
  event.preventDefault();
  searchBooks();

        const searchTerm = document.getElementById("search-input").value.toLowerCase();
        searchBooks(searchTerm);
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

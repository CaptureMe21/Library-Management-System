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

    // Function to display a popup and fetch data based on dataKey
    window.showPopup = function(dataKey) {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'block';

        // Fetch data from the realtime database using dataKey
        const bookRef = ref(db, 'Books/' + dataKey);
        onValue(bookRef, (snapshot) => {
            const bookData = snapshot.val();
            if (bookData) {
            // Set the content of the popup using the fetched data
            popup.innerHTML = `
                <h2>${bookData.booktitle}</h2>
                <p><strong>Author:</strong> ${bookData.author}</p>
                <p><strong>Genre:</strong> ${bookData.genre}</p>
                <p><strong>Quantity:</strong> ${bookData.quantity}</p>
                <p><strong>ISBN:</strong> ${bookData.isbn}</p>
                <p><strong>Shelf Number:</strong> ${bookData.shelfnumber}</p>
                <p><strong>Copyright Year:</strong> ${bookData.copyright}</p>
                <p><strong>Volume:</strong> ${bookData.volume}</p>
                <p><strong>Edition:</strong> ${bookData.edition}</p>
                <p><strong>Date Received:</strong> ${bookData.datereceive}</p>
                <p><strong>Remarks:</strong> ${bookData.remarks}</p>
                <p><strong>Page Count:</strong> ${bookData.pagenumber}</p>
                <button class="close-button">Close</button>
            `;
            } else {
            console.error("Book data not found for dataKey:", dataKey);
            }
        });

        const closeButton = popup.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                popup.style.display = 'none';
            });
        }
    }
    };


    function displayBooksData() {
        // Reference to the 'Books' node in the database
        const booksRef = ref(db, 'Books');
    
        // Listen for changes to the 'Books' node
        onValue(booksRef, (snapshot) => {
            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = ''; // Clear the table body before populating
    
            // Iterate over each child of 'Books'
            snapshot.forEach((childSnapshot) => {
                const bookKey = childSnapshot.key; // Get the key of the book
                const bookData = childSnapshot.val();
    
                // Append a new row to the table for each book
                tableBody.innerHTML += `
                    <tr>
                        <td>${bookData.id}</td>
                        <td><a onclick="showPopup('${bookKey}'); return false;" href="#">${bookData.booktitle}</a></td>
                        <td>${bookData.author}</td>
                        <td>${bookData.genre}</td>
                        <td>${bookData.quantity}</td>
                        <td>${bookData.isbn}</td>
                        <td>${bookData.shelfnumber}</td>
                        <td><button class="update-button" data-key="${bookKey}">Update</button></td>
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
        });
    }
    
    function searchBooks(searchTerm) {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = ''; // Clear the table body before populating
    
        const booksRef = ref(db, 'Books');
    
        onValue(booksRef, (snapshot) => {
            // Iterate over each child of 'Books'
            snapshot.forEach((childSnapshot) => {
                const bookData = childSnapshot.val();
                const bookTitle = bookData.booktitle.toLowerCase();
                const author = bookData.author.toLowerCase();
                const genre = bookData.genre.toLowerCase();
                const shelfnumber = bookData.shelfnumber.toLowerCase();
    
                // Check if any of the book properties match the search term
                if (bookTitle.includes(searchTerm) || author.includes(searchTerm) || genre.includes(searchTerm) || shelfnumber.includes(searchTerm)) {
                    const bookKey = childSnapshot.key; // Get the key of the book
    
                    // Append a new row to the table for each book
                    tableBody.innerHTML += `
                        <tr>
                            <td>${bookData.id}</td>
                            <td><a onclick="showPopup('${bookKey}'); return false;" href="#">${bookData.booktitle}</a></td>
                            <td>${bookData.author}</td>
                            <td>${bookData.genre}</td>
                            <td>${bookData.quantity}</td>
                            <td>${bookData.isbn}</td>
                            <td>${bookData.shelfnumber}</td>
                            <td><button class="update-button" data-key="${bookKey}">Update</button></td>
                        </tr>
                    `;
    
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
        });
    }
    
    // Call the function to display books data when the DOM content is loaded
    document.addEventListener('DOMContentLoaded', displayBooksData);
    
    // Search functionality
    document.getElementById("searchee").addEventListener("click", function(event) {
        event.preventDefault();
        
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

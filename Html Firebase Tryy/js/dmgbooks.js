import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, update, child, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// Function to display a popup and fetch data based on dataKey
window.showPopup = function(dataKey) {
const popup = document.getElementById('popup');
if (popup) {
    popup.style.display = 'block';

    // Fetch data from the realtime database using dataKey
    const bookRef = ref(db, 'UnavailableBooks/' + dataKey);
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

document.addEventListener('DOMContentLoaded', function() {
    // Reference to the 'UnavailableBooks' node in the database
    const booksRef = ref(db, 'UnavailableBooks');

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
                    <td>${bookData.remarks}</td>
                </tr>
            `;
        });
    });

    // Search functionality
    document.getElementById("searchee").addEventListener("click", function(event) {
        event.preventDefault();
        
        const searchTerm = document.getElementById("search-input").value.toLowerCase();
        searchBooks(searchTerm);
    });

    function searchBooks(searchTerm) {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = ''; // Clear the table body before populating

        onValue(booksRef, (snapshot) => {
            // Iterate over each child of 'Books'
            snapshot.forEach((childSnapshot) => {
                const bookData = childSnapshot.val();
                const bookid = bookData.bookid.toLowerCase();
                const bookTitle = bookData.booktitle.toLowerCase();
                const author = bookData.author.toLowerCase();
                const genre = bookData.genre.toLowerCase();

// Check if any of the book properties match the search term
  if (bookid.includes(searchTerm) || bookTitle.includes(searchTerm) || author.includes(searchTerm) || genre.includes(searchTerm)) {
  const bookKey = childSnapshot.key; // Get the key of the book

   // Append a new row to the table for each book
      tableBody.innerHTML += `
        <tr>
        <td>${bookData.id}</td>
        <td><a onclick="showPopup(); return false;" href="#">${bookData.booktitle}</a></td>
        <td>${bookData.author}</td>
        <td>${bookData.genre}</td>
        <td>${bookData.quantity}</td>
        <td>${bookData.isbn}</td>
        <td>${bookData.shelfnumber}</td>
        </tr>
        `;
    }
  });
});
}
});
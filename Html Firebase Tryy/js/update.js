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

// Function to set the values of input fields based on the book-key
function setInputsFromBookKey() {
    const bookKey = getParameterByName('book-key');
    if (bookKey) {
        // Get the book data from the database using the book-key
        const bookRef = ref(db, 'Books/' + bookKey);
        onValue(bookRef, (snapshot) => {
            const bookData = snapshot.val();
            // Populate input fields with book data
            document.getElementById('bname').value = bookData.booktitle;
            document.getElementById('quanti').value = bookData.quantity;
            document.getElementById('author').value = bookData.author;
            document.getElementById('genre').value = bookData.genre;
            document.getElementById('bnum').value = bookData.isbn;
            document.getElementById('snum').value = bookData.shelfnumber;
            document.getElementById("yearcopy").value = bookData.copyright;
            document.getElementById("volume").value = bookData.volume;
            document.getElementById("edition").value = bookData.edition;
            document.getElementById("daterec").value = bookData.datereceive;
            document.getElementById("remarks").value = bookData.remarks;
        });
    }
}

// Function to get the value of a URL parameter by name
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Function to check if user is authenticated
function checkAuthentication() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // User is not logged in, redirect to login page
            window.location.href = "index.html";
        }
    });
}

// Add event listener to the form submission
document.getElementById('updateForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission

    const bookKey = getParameterByName('book-key');
    if (bookKey) {
        // Update the corresponding book data in the Firebase Realtime Database
        const bookRef = ref(db, 'Books/' + bookKey);
        const updatedBook = {
            booktitle: document.getElementById('bname').value,
            quantity: document.getElementById('quanti').value,
            author: document.getElementById('author').value,
            genre: document.getElementById('genre').value,
            isbn: document.getElementById('bnum').value,
            shelfnumber: document.getElementById('snum').value,
            copyright: document.getElementById("yearcopy").value,
            volume: document.getElementById("volume").value,
            edition: document.getElementById("edition").value,
            datereceive: document.getElementById("daterec").value,
            remarks: document.getElementById("remarks").value
        };

        update(bookRef, updatedBook)
            .then(() => {
                console.log('Book details updated successfully');
                // Redirect to booklist.html after updating
                alert("Book Updated Successfully!");
                setTimeout(function() {
                    window.location.href = "booklist.html";
                }, 1000); // Redirect after 1 second
            })
            .catch((error) => {
                console.error('Error updating book details:', error);
                // Optionally, display an error message to the user
                alert('Error updating book details. Please try again later.');
            });
    }
});

// Function to log out
document.getElementById("logout").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User signed out successfully");
            window.localStorage.removeItem('isLoggedIn');
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error signing out:", error);
        });
});

// Call checkAuthentication and setInputsFromBookKey when the page loads
window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = "index.html"; // Redirect to login page
    }
    checkAuthentication();
    setInputsFromBookKey();
};
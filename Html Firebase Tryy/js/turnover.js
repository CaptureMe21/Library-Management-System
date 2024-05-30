import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set, remove, update} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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

function displayBooksData() {
    const borrowedBooksRef = ref(db, 'RequestReturn');

    onValue(borrowedBooksRef, (snapshot) => {
        const tableBody = document.getElementById('table-body');
        const messageDiv = document.getElementById('message');
        tableBody.innerHTML = ''; // Clear the table body before populating
        messageDiv.innerHTML = ''; // Clear the message div before populating

        if (!snapshot.exists()) {
            messageDiv.innerHTML = '<p>No return request yet.</p>';
        } else {
            snapshot.forEach((childSnapshot) => {
                const transactionId = childSnapshot.key;
                const bookData = childSnapshot.val();

                tableBody.innerHTML += `
                    <tr>
                        <td>${bookData.booktitle}</td>
                        <td>${bookData.isbn}</td>
                        <td>${bookData.quantity}</td>
                        <td>${bookData.bname}</td>
                        <td>${bookData.idnum}</td>
                        <td>${bookData.uid}</td>
                        <td>${bookData.returndate}</td>
                        <td>${transactionId}</td>
                        <td><button class="allow-btn" data-transaction-id="${transactionId}">Allow</button> <button class="delete-btn" data-transaction-id="${transactionId}">Delete</button></td>
                    </tr>
                `;
            });
        }
    });
}

function searchBooks() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear the table body before populating

    const borrowedBooksRef = ref(db, 'RequestReturn');

    onValue(borrowedBooksRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const transactionId = childSnapshot.key;
            const bookData = childSnapshot.val();

            if (bookData.booktitle.toLowerCase().includes(searchTerm) ||
                bookData.isbn.toLowerCase().includes(searchTerm) ||
                bookData.quantity.toString().includes(searchTerm) ||
                bookData.bname.toLowerCase().includes(searchTerm) ||
                bookData.idnum.toLowerCase().includes(searchTerm) ||
                transactionId.includes(searchTerm)) {

                tableBody.innerHTML += `
                    <tr>
                        <td>${bookData.booktitle}</td>
                        <td>${bookData.isbn}</td>
                        <td>${bookData.quantity}</td>
                        <td>${bookData.bname}</td>
                        <td>${bookData.idnum}</td>
                        <td>${bookData.uid}</td>
                        <td>${bookData.date}</td>
                        <td>${bookData.returndate}</td>
                        <td>${transactionId}</td>
                        <td><button class="allow-btn" data-transaction-id="${transactionId}">Allow</button></td>
                        <td><button class="delete-btn" data-transaction-id="${transactionId}">Delete</button></td>
                    </tr>
                `;
            }
        });
    });
}

document.getElementById("searchee").addEventListener("click", function(event) {
    event.preventDefault();
    searchBooks();
});

window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = "index.html"; // Redirect to login page
    }

    // Call displayBooksData only once when the page loads
    displayBooksData();
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
        });
});

// Call checkAuthentication() when the page loads
checkAuthentication();

function allowBook(transactionId) {
    const requestBookRef = ref(db, `RequestReturn/${transactionId}`);
    const returnedBooksRef = ref(db, `ReturnedBooks/${transactionId}`);
    const borrowedBooksRef = ref(db, `BorrowedBook/${transactionId}`);

    // Get the book data
    onValue(requestBookRef, (snapshot) => {
        if (snapshot.exists()) {
            const bookData = snapshot.val();
            const bookRef = ref(db, `Books/${bookData.isbn}`);

            // Transfer the data to ReturnedBooks and update Books quantity
            set(returnedBooksRef, bookData)
                .then(() => {
                    // Once transferred, remove from RequestReturn and BorrowedBooks
                    return Promise.all([remove(requestBookRef), remove(borrowedBooksRef)]);
                })
                .then(() => {
                    console.log('Book data transferred successfully');

                    // Update the quantity of the book in Books node to "1"
                    return update(bookRef, { quantity: "1" });
                })
                .then(() => {
                    console.log('Book quantity updated successfully');
                })
                .catch((error) => {
                    console.error('Error transferring book data:', error);
                });
        } else {
            console.log('No data available');
        }
    }, (error) => {
        console.error('Error fetching book data:', error);
    });
}


// Add event listener to Allow button
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('allow-btn')) {
        const transactionId = event.target.getAttribute('data-transaction-id');
        if (confirm("Are you sure you want to allow this book request?")) {
            allowBook(transactionId);

        }
    }
});

document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function () {
        const transactionId = this.getAttribute('data-transaction-id');
        if (confirm("Are you sure you want to delete this book request?")) {
            deleteBook(transactionId);
        }
    });
});

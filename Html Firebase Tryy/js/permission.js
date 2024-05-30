import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set, remove, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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
    const borrowedBooksRef = ref(db, 'RequestBorrow');

    onValue(borrowedBooksRef, (snapshot) => {
        const tableBody = document.getElementById('table-body');
        const messageDiv = document.getElementById('message');
        tableBody.innerHTML = '';
        messageDiv.innerHTML = '';

        if (!snapshot.exists()) {
            messageDiv.innerHTML = '<p>All books are in place.</p>';
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
                        <td>${bookData.borrowdate}</td>
                        <td>${bookData.returndate}</td>
                        <td>${transactionId}</td>
                        <td><button class="allow-btn" data-transaction-id="${transactionId}">Allow</button> <button class="delete-btn" data-transaction-id="${transactionId}">Delete</button></td>
                    </tr>
                `;
            });
        }

        document.querySelectorAll('.allow-btn').forEach(button => {
            button.addEventListener('click', function () {
                const transactionId = this.getAttribute('data-transaction-id');
                if (confirm("Are you sure you want to allow this book request?")) {
                    allowBook(transactionId);
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const transactionId = this.getAttribute('data-transaction-id');
                if (confirm("Are you sure you want to delete this book request?")) {
                    deleteBook(transactionId);
                }
            });
        });
    });
}

function allowBook(transactionId) {
    const requestBookRef = ref(db, `RequestBorrow/${transactionId}`);

    onValue(requestBookRef, (snapshot) => {
        if (snapshot.exists()) {
            const bookData = snapshot.val();
            const borrowedBooksRef = ref(db, `BorrowedBook/${transactionId}`);

            const bookDataWithTransactionId = {
                ...bookData,
                transactionId: transactionId // Adding transaction ID to the data
            };

            set(borrowedBooksRef, bookDataWithTransactionId)
                .then(() => {
                    console.log('Book data copied successfully');

                    // Update the quantity of the book in Books node to 0
                    const bookRef = ref(db, `Books/${bookData.isbn}`);
                    return update(bookRef, { quantity: "0" });
                })
                .then(() => {
                    console.log('Book quantity updated successfully');

                    // Remove the original data from RequestBorrow
                    return remove(requestBookRef);
                })
                .then(() => {
                    console.log('Original book data removed successfully');
                })
                .catch((error) => {
                    console.error('Error transferring book data:', error);
                });
        } else {
            console.log('No data available');
        }
    }, { onlyOnce: true });
}

function deleteBook(transactionId) {
    const requestBookRef = ref(db, `RequestBorrow/${transactionId}`);
    remove(requestBookRef)
        .then(() => {
            console.log(`Book request with transaction ID ${transactionId} removed successfully`);
            // Optionally, you can call displayBooksData() again to refresh the table
            displayBooksData();
        })
        .catch((error) => {
            console.error('Error deleting book request:', error);
        });
}

document.addEventListener('DOMContentLoaded', displayBooksData);

function searchBooks() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    const borrowedBooksRef = ref(db, 'RequestBorrow');

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
                        <td>${bookData.borrowdate}</td>
                        <td>${bookData.returndate}</td>
                        <td>${transactionId}</td>
                        <td><button class="allow-btn" data-transaction-id="${transactionId}">Allow</button> <button class="delete-btn" data-transaction-id="${transactionId}">Delete</button></td>
                    </tr>
                `;
            }
        });

        document.querySelectorAll('.allow-btn').forEach(button => {
            button.addEventListener('click', function () {
                const transactionId = this.getAttribute('data-transaction-id');
                if (confirm("Are you sure you want to allow this book request?")) {
                    allowBook(transactionId);
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const transactionId = this.getAttribute('data-transaction-id');
                if (confirm("Are you sure you want to delete this book request?")) {
                    deleteBook(transactionId);
                }
            });
        });
    });
}

document.getElementById("searchee").addEventListener("click", function (event) {
    event.preventDefault();
    searchBooks();
});

window.onload = function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = "index.html";
    }
};

function checkAuthentication() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "index.html";
        }
    });
}

document.getElementById("logout").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User Signed Out Successfully");
            window.localStorage.removeItem('isLoggedIn');
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error signing out:", error);
        });
});

checkAuthentication();

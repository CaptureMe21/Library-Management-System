import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, update, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
    
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

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const db = getDatabase(app);
      const auth = getAuth();

        // Handle form submission
        document.getElementById("submit").addEventListener('click', function(e){
            e.preventDefault();

            // Get the book number from the input field
            const bookName = document.getElementById("bname").value.trim();

            // Check if the book number is empty
            if (!bookName) {
                alert("Please enter a book number.");
                return; // Exit the function early
            }

            // Reference to the book data in the database
            const bookRef = ref(db, 'Books/' + bookName);

            // Remove the book from the database
            remove(bookRef)
                .then(() => {
                    console.log("Book deleted successfully!");
                    // Provide feedback to the user
                    alert("Book deleted successfully!");
                    // Redirect to a different page
                    window.location.href = "booklist.html";
                })
                .catch((error) => {
                    console.error("Error deleting book: ", error);
                    // Provide feedback to the user
                    alert("Error deleting book. Please try again later.");
                });
        })
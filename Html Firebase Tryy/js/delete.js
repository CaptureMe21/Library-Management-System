import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getDatabase, ref, set, get, update, child, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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

    export { app, db, auth};

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const db = getDatabase(app);
      const auth = getAuth();

        // Handle form submission
  document.getElementById("delpox").addEventListener('click', function(e){
    e.preventDefault();

    // Get the book number and quantity from the input fields
    const bookISBN = document.getElementById("bnum").value.trim();
    const quantity = parseInt(document.getElementById("quanti").value.trim());

    // Check if the input fields are empty
    if (!bookISBN || isNaN(quantity)) {
      alert("Please enter valid data");
      return; // Exit the function early
    }

    // Check if the user is authenticated
    if (!auth.currentUser) {
      alert("You need to be logged in to perform this action");
      return; // Exit the function early
    }

    // Reference to the book data in the database
    const bookRef = ref(db, 'Books/' + bookISBN);

    // Fetch the book data from the database
    get(bookRef).then((snapshot) => {
      const bookData = snapshot.val();

      // Check if the book exists and if its quantity is sufficient
      if (bookData && bookData.quantity >= quantity) {
        // Transfer the book data to a different node (e.g., "ArchivedBooks")
        const archivedBooksRef = ref(db, 'UnavailableBooks/' + bookISBN);
        
        // Update or set the data in the new node
        update(archivedBooksRef, {
            id: bookData.id,
            booktitle: bookData.booktitle,
            author: bookData.author,
            genre: bookData.genre,
            quantity: quantity,
            isbn: bookISBN,
            shelfnumber: bookData.shelfnumber,
            copyright: bookData.copyright,
            volume: bookData.volume,
            edition: bookData.edition,
            datereceive: bookData.datereceive,
            remarks: bookData.remarks
        }).then(() => {
          // Remove the transferred quantity from the original node
          const remainingQuantity = bookData.quantity - quantity;
            if (remainingQuantity === 0) {
                // If the remaining quantity is 0, remove the entire node
                remove(bookRef).then(() => {
                    console.log("Book deleted successfully from the original node");
                }).catch((error) => {
                console.error("Error deleting book from the original node: ", error);
                });
            } else {
                // If there's remaining quantity, update it in the original node
                update(bookRef, { quantity: remainingQuantity }).then(() => {
                    console.log("Remaining quantity updated successfully in the original node");
                }).catch((error) => {
                    console.error("Error updating remaining quantity in the original node: ", error);
                });
            }
          
          // Provide feedback to the user
          alert("Book data transferred successfully!");
          // Redirect to a different page
          window.location.href = "booklist.html";
        }).catch((error) => {
          console.error("Error transferring book data: ", error);
          // Provide feedback to the user
          alert("Error transferring book data. Please try again later.");
        });
      } else {
        alert("Book not found or quantity is insufficient");
      }
    }).catch((error) => {
      console.error("Error fetching book data: ", error);
      // Provide feedback to the user
      alert("Error fetching book data. Please try again later.");
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

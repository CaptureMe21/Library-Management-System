import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, update, child, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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

      export { app, db, auth };

      // Function to display a popup and fetch data based on dataKey
    window.showPopup = function(dataKey) {
        const popup = document.getElementById('popup1');
        if (popup) {
            popup.style.display = 'block';
    
            // Fetch data from the realtime database using dataKey
            const userRef = ref(db, 'Users/' + dataKey);
            onValue(userRef, (snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                // Set the content of the popup using the fetched data
                popup.innerHTML = `
                    <h2>${userData.namef} ${userData.namel}</h2>
                    <p><strong>ID Number:</strong> ${userData.idnum}</p>
                    <p><strong>Admin:</strong> ${userData.admin === 1 ? 'Yes' : 'No'}</p>
                    <p><strong>Email:</strong> ${userData.email}</p>
     
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
    

        function displayUsersData() {
            // Reference to the 'Users' node in the database
            const usersRef = ref(db, 'Users');
        
            // Listen for changes to the 'Users' node
            onValue(usersRef, (snapshot) => {
                const tableBody = document.getElementById('table-body');
                tableBody.innerHTML = ''; // Clear the table body before populating
        
                // Iterate over each child of 'Users'
                snapshot.forEach((childSnapshot) => {
                    const userId = childSnapshot.key; // Get the key (user ID)
                    const userData = childSnapshot.val();
        
                    // Check if user is non-admin (admin value is 0)
                    if (userData.admin === 0) {
                        // Append a new row to the table for each non-admin user
                        tableBody.innerHTML += `
                            <tr>
                                <td><a onclick="showPopup('${userId}'); return false;" href="#">${userData.namef} ${userData.namel}</td>
                                <td>${userId}</td>
                            </tr>
                        `;
                    }
                });
            });
        }
        
        // Call the function to display users data when the DOM content is loaded
        document.addEventListener('DOMContentLoaded', displayUsersData);
        

    // Check if the user is logged in
    window.onload = function() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            window.location.href = "index.html"; // Redirect to login page
        }
        checkAuthentication();
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

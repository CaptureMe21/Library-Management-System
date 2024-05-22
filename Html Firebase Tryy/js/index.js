// Import the functions you need from the SDKs you need
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

export { app, db, auth};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

// Function to handle login form submission
document.getElementById("loginbtn").addEventListener('click', function(e) {
    e.preventDefault();

    const email = document.getElementById("uname").value.trim();
    const password = document.getElementById("upassword").value;
    const dt = new Date();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        // Reference to the user data in the database
        const userRef = ref(db, 'Users/' + user.uid);

        // Retrieve user data from the database
        get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.admin === 1) {
                    // User is an admin, continue with login process
                    console.log("User is an admin");
                    // Update last login time
                    update(ref(db, 'Users/' + user.uid), {
                        last_login: dt,
                    }).then(() => {
                        alert("Succesfully Logged In as Admin!");
                        // Redirect to dashboard after login
                        setTimeout(function() {
                            window.localStorage.setItem('isLoggedIn', true);
                            window.location.href = "dashboard.html";
                        }, 1000);
                    }).catch((error) => {
                        console.error("Error updating last login time:", error);
                        alert("Error updating last login time.");
                    });
                } else {
                    // User is not an admin, display error message
                    console.log("User is not an admin");
                    alert("You are NOT an Admin!!");
                }
            } else {
                // User data not found, display error message or handle accordingly
                console.log("User data not found");
                alert("User data not found.");
            }
        })
        .catch((error) => {
            console.error("Error getting user data:", error);
            alert("Error getting user data.");
        });
    })
    .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
    });
});

// Function to handle registration form submission
document.getElementById("subregis").addEventListener('submit', function(e){
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("regispass").value;
    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const idnum = document.getElementById("idnum").value.trim();

    // Create user with email and password
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        // Reference to the user data in the database
        const userRef = ref(db, 'Users/' + user.uid);

        // Write user data to the database
        set(userRef, {
            namef: fname,
            namel: lname,
            email: email,
            idnum: idnum,
            admin: 1
        }).then(() => {
            console.log("Account created successfully!");
            alert("Account Created Successfully!");
            // Redirect to a different page after a short delay
            setTimeout(function() {
                window.location.href = "index.html";
            }, 1000);
        }).catch((error) => {
            console.error("Error setting user data:", error);
            alert("Error creating account.");
        });
    })
    .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
    });
});


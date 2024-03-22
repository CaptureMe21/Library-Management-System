    // Check if the user is logged in
    window.onload = function() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            window.location.href = "index.html"; // Redirect to login page
        }
    };

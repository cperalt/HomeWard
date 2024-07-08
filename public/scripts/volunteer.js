document.addEventListener("DOMContentLoaded", function() {
    var inputs = document.querySelectorAll('.signup-container form .form-group input, .signup-container form .form-group textarea');

    // Function to validate inputs
    function validateInputs() {
        inputs.forEach(function(input) {
            switch (input.id) {
                case "name":
                    if (! /[a-zA-Z]/.test(input.value)) {
                        alert('Please enter only alphabets for Name.');
                        return false;
                    }                    
                    break;
                case "email":
                    if (! /^\S+@\S+\.\S+$/.test(input.value)) {
                        alert('Please enter a valid Email.');
                        return false;
                    }
                    break;
                case "phone":
                    if (! /^\d+$/.test(input.value)) {
                        alert('Please enter a valid Phone Number.');
                        return false;
                    }
                    break;
                case "availability":
                    if (! input.value.trim()) {
                        alert('Availability cannot be empty.');
                        return false;
                    }
                    break;
                case "skills":
                    if (! input.value.trim()) {
                        alert('Skills and Interests cannot be empty.');
                        return false;
                    }
                    break;
            }
        });
        return true; 
    }

    document.querySelector('.signup-container form button[type=submit]').addEventListener('click', function(e) {
        if (!validateInputs()) {
            e.preventDefault(); 
        }
    });
});
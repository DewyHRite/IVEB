//Landy Shaw
// Utility 
function showMessage(elementId, type, text) {
    const messageDiv = document.getElementById(elementId);
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
    }
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

function validateTRN(trn) {
    const trnRegex = /^\d{3}-\d{3}-\d{3}$/;
    return trnRegex.test(trn);
}

function isOver18(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age >= 18;
}

// Registration 
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const trn = document.getElementById('trn').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate form
        if (!firstName || !lastName || !dob || !gender || !phone || !email || !trn || !password || !confirmPassword) {
            showMessage('message', 'error', 'All fields are required');
            return;
        }
        
        if (!validateTRN(trn)) {
            showMessage('message', 'error', 'TRN must be in the format 000-000-000');
            return;
        }
        
        if (!isOver18(dob)) {
            showMessage('message', 'error', 'You must be at least 18 years old to register');
            return;
        }
        
        if (password.length < 8) {
            showMessage('message', 'error', 'Password must be at least 8 characters long');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('message', 'error', 'Passwords do not match');
            return;
        }
        
        // Check if TRN or email already existy
        const registrationData = JSON.parse(localStorage.getItem('RegistrationData')) || [];
        const trnExists = registrationData.some(user => user.trn === trn);
        const emailExists = registrationData.some(user => user.email === email);
        
        if (trnExists) {
            showMessage('message', 'error', 'TRN already registered');
            return;
        }
        
        if (emailExists) {
            showMessage('message', 'error', 'Email already registered');
            return;
        }
        
        // Create user object
        const user = {
            firstName,
            lastName,
            dob,
            gender,
            phone,
            email,
            trn,
            password,
            dateOfRegistration: new Date().toISOString(),
            cart: {},
            invoices: []
        };
        
        // Save to localstorage
        registrationData.push(user);
        localStorage.setItem('RegistrationData', JSON.stringify(registrationData));
        
        // Show success message and redirect
        showMessage('message', 'success', 'Registration successful! Redirecting to login...');
        setTimeout(() => {
            window.location.href = 'Login.html';
        }, 2000);
    });
    
    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            clearForm('registerForm');
        });
    }
}

//ASH's Part

// Login Section
const loginForm = document.getElementById('loginForm');
const requiredFieldsMessage = document.getElementById('requiredFieldsMessage');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form submission

        const trn = document.getElementById('loginTRN').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        // Check if required fields are filled
        if (!trn || !password) {
            requiredFieldsMessage.style.display = 'block'; // Show the message
            return;
        }

        requiredFieldsMessage.style.display = 'none'; // Hide the message if fields are valid

        // Proceed with login logic (e.g., authentication)
        console.log('Login successful with TRN:', trn);
    });
}

if (loginForm) {
    let loginAttempts = 0;
    const maxAttempts = 3;
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const trn = document.getElementById('loginTRN').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Validate TRN format
        if (!validateTRN(trn)) {
            showMessage('loginMessage', 'error', 'TRN must be in the format 000-000-000');
            return;
        }
        
        // Check credentials
        const registrationData = JSON.parse(localStorage.getItem('RegistrationData')) || [];
        const user = registrationData.find(user => user.trn === trn && user.password === password);
        
        if (user) {
            // Successful login
            sessionStorage.setItem('currentUser', JSON.stringify({ trn: user.trn, name: user.firstName }));
            showMessage('loginMessage', 'success', 'Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'ProductPage.html';
            }, 1500);
        } else {
            // Failed login
            loginAttempts++;
            const attemptsLeft = maxAttempts - loginAttempts;
            
            if (loginAttempts >= maxAttempts) {
                showMessage('loginMessage', 'error', 'Account locked. Too many failed attempts.');
                setTimeout(() => {
                    window.location.href = 'error-account-locked.html';
                }, 1500);
            } else {
                showMessage('loginMessage', 'error', `Invalid TRN or password. ${attemptsLeft} attempt(s) left.`);
            }
        }
    });
    
    // Cancel button
    const loginCancelBtn = document.getElementById('loginCancelBtn');
    if (loginCancelBtn) {
        loginCancelBtn.addEventListener('click', () => {
            clearForm('loginForm');
        });
    }
    
    // Reset password link
    const resetPasswordLink = document.getElementById('resetPasswordLink');
    if (resetPasswordLink) {
        resetPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const trn = document.getElementById('loginTRN').value.trim();
            
            if (!trn) {
                showMessage('loginMessage', 'error', 'Please enter your TRN first');
                return;
            }
            
            if (!validateTRN(trn)) {
                showMessage('loginMessage', 'error', 'TRN must be in the format 000-000-000');
                return;
            }
            
            // Store TRN in sessionStorage for password reset page
            sessionStorage.setItem('resetTRN', trn);
            window.location.href = 'reset-password.html';
        });
    }
}

// Checking again if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && (window.location.pathname.includes('login.html') || window.location.pathname.includes('registration.html'))) {
        window.location.href = 'ProductPage.html';
    }

    // Landy Shaw

    // Reset Password Section
const resetPasswordForm = document.getElementById('resetPasswordForm');
if (resetPasswordForm) {
    // Pre-fill TRN if coming from login page
    const resetTRN = sessionStorage.getItem('resetTRN');
    if (resetTRN) {
        document.getElementById('resetTRN').value = resetTRN;
        sessionStorage.removeItem('resetTRN');
    }

    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const trn = document.getElementById('resetTRN').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        // Validate inputs
        if (!trn || !newPassword || !confirmNewPassword) {
            showMessage('resetMessage', 'error', 'All fields are required');
            return;
        }
        
        if (!validateTRN(trn)) {
            showMessage('resetMessage', 'error', 'TRN must be in the format 000-000-000');
            return;
        }
        
        if (newPassword.length < 8) {
            showMessage('resetMessage', 'error', 'Password must be at least 8 characters long');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            showMessage('resetMessage', 'error', 'Passwords do not match');
            return;
        }
        
        // Find user and update password
        const registrationData = JSON.parse(localStorage.getItem('RegistrationData')) || [];
        const userIndex = registrationData.findIndex(user => user.trn === trn);
        
        if (userIndex === -1) {
            showMessage('resetMessage', 'error', 'TRN not found');
            return;
        }
        
        // Update User
        registrationData[userIndex].password = newPassword;
        localStorage.setItem('RegistrationData', JSON.stringify(registrationData));
        
        showMessage('resetMessage', 'success', 'Password reset successfully! Redirecting to login...');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
    
    // Cancel button
    const resetCancelBtn = document.getElementById('resetCancelBtn');
    if (resetCancelBtn) {
        resetCancelBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
}

});

const loginToDashboardBtn = document.getElementById('loginToDashboardBtn');

if (loginToDashboardBtn) {
    loginToDashboardBtn.addEventListener('click', () => {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

        if (currentUser) {
            // Redirect to the dashboard
            window.location.href = 'Dashboard.html';
        } else {
            // Show an error message if no user is logged in
            const loginMessage = document.getElementById('loginMessage');
            loginMessage.textContent = 'No user is currently logged in. Please log in first.';
            loginMessage.className = 'message error';
        }
    });
}

// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// --- Firebase init ---
const firebaseConfig = {
  apiKey:     "AIzaSyBvGkRyJQiU6qiod0BGgjkQdspZ1ZskKuc",
  authDomain: "balanced-bite-545a9.firebaseapp.com",
  projectId:  "balanced-bite-545a9",
  storageBucket: "balanced-bite-545a9.firebasestorage.app",
  messagingSenderId: "96942250358",
  appId:      "1:96942250358:web:7e644d656b33b61507c257"
};
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

// --- DOM refs ---
const loginForm         = document.getElementById('loginForm');
const forgotLink        = document.getElementById('forgot');
const resetOverlay      = document.getElementById('modal-overlay');
const resetClose        = document.getElementById('modal-close');
const resetSubmit       = document.getElementById('modal-submit');
const recoveryEmail     = document.getElementById('recovery-email');

const loginModalOverlay = document.getElementById('loginModalOverlay');
const loginModalIcon    = document.getElementById('login-modal-icon2');
const loginModalMessage = document.getElementById('login-modal-message');
const loginModalClose   = document.getElementById('login-modal-close');
const loginModalOk      = document.getElementById('login-modal-ok');

// --- Utility to show your custom modal ---
function showLoginModal(type, message) {
  if (type === 'success') {
    loginModalIcon.className = 'fas fa-check-circle';
    loginModalIcon.style.color = '#4CAF50';
    loginModalOk.style.display = 'inline-block';
  } else {
    loginModalIcon.className = 'fas fa-frown';
    loginModalIcon.style.color = '#2196F3';
    loginModalOk.style.display = 'none';
  }
  loginModalMessage.textContent = message;
  loginModalOverlay.style.display = 'flex';
}

// --- Hide feedback modal ---
loginModalClose.addEventListener('click', () => {
  loginModalOverlay.style.display = 'none';
});
window.addEventListener('click', e => {
  if (e.target === loginModalOverlay) {
    loginModalOverlay.style.display = 'none';
  }
});
loginModalOk.addEventListener('click', () => {
  loginModalOverlay.style.display = 'none';
  if (loginModalMessage.textContent.startsWith('Successful login')) {
    window.location.href = './main.html';
  }
});

// --- “Forgot password?” opens the reset modal ---
forgotLink.addEventListener('click', e => {
  e.preventDefault();
  recoveryEmail.value = '';
  resetOverlay.style.display = 'flex';
});
resetClose.addEventListener('click', () => {
  resetOverlay.style.display = 'none';
});
window.addEventListener('click', e => {
  if (e.target === resetOverlay) resetOverlay.style.display = 'none';
});

// --- Handle Reset‑Password click with email‑existence check ---
resetSubmit.addEventListener('click', async e => {
  e.preventDefault();
  const email = recoveryEmail.value.trim();
  if (!email) {
    showLoginModal('error', 'Please enter your email address.');
    return;
  }

  try {
    // 1) fetch which sign‑in methods exist for this email
    const methods = await fetchSignInMethodsForEmail(auth, email);
    console.log('Available methods for', email, ':', methods);
    // 2) if there is no "password" method, we can't reset a password
    if (!methods.includes('password')) {
      showLoginModal('error', `No email/password account found for ${email}.`);
      return;
    }

    // 3) send the reset email
    await sendPasswordResetEmail(auth, email);
    resetOverlay.style.display = 'none';
    showLoginModal('success', `Password reset email sent to ${email}.`);
  } catch (err) {
    console.error('Reset error:', err.code, err.message);
    showLoginModal('error', `Reset failed: ${err.message}`);
  }
});

// --- Handle Login submission ---
loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showLoginModal('success', `Successful login! Welcome back, ${email}`);
  } catch (err) {
    console.error('Login error:', err.code, err.message);
    showLoginModal('error', `Login failed: ${err.message}`);
  }
});

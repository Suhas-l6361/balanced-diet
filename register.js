// register.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBvGkRyJQiU6qiod0BGgjkQdspZ1ZskKuc",
  authDomain: "balanced-bite-545a9.firebaseapp.com",
  projectId: "balanced-bite-545a9",
  storageBucket: "balanced-bite-545a9.firebasestorage.app",
  messagingSenderId: "96942250358",
  appId: "1:96942250358:web:7e644d656b33b61507c257"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

// Modal elements
const modal       = document.getElementById('customModal');
const modalIcon   = modal.querySelector('.modal-icon');
const modalMsg    = modal.querySelector('.modal-message');
const modalOkBtn  = modal.querySelector('.modal-ok-btn');
const modalClose  = modal.querySelector('.close-btn');

function showModal(type, message) {
  modal.className = 'modal ' + type;
  modalMsg.textContent = message;
  // set icon & OK button visibility
  if (type === 'success') {
    modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    modalOkBtn.style.display = 'inline-block';
  } else if (type === 'error') {
    modalIcon.innerHTML = '<i class="fas fa-frown"></i>';
    modalOkBtn.style.display = 'none';
  } else { // failure
    modalIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
    modalOkBtn.style.display = 'none';
  }
  modal.style.display = 'flex';
}

// close handlers
modalClose.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
modalOkBtn.addEventListener('click', () => {
  window.location.href = './login.html';
});

// Form submission
document.getElementById("registrationForm").addEventListener('submit', function(event) {
  event.preventDefault();

  const registerEmail    = document.getElementById("registeremail").value;
  const registerPassword = document.getElementById("registerpassword").value;

  createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
    .then((userCredential) => {
      showModal('success', `Registration successful! Welcome, ${registerEmail}`);
    })
    .catch((error) => {
      const { code, message } = error;
      if (code === 'auth/email-already-in-use') {
        showModal('error', 'This email is already in use.');
      } else {
        showModal('failure', `Registration failed: ${message}`);
      }
      console.error("Auth error:", code, message);
    });
});

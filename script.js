// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDyJdKzSPpUeAgs1ni5dJD7DviblX2E2B4",
    authDomain: "ycdo---registration-form.firebaseapp.com",
    projectId: "ycdo---registration-form",
    storageBucket: "ycdo---registration-form.firebasestorage.app",
    messagingSenderId: "632743367139",
    appId: "1:632743367139:web:d4f4cdc81329e0925cd0d6",
    measurementId: "G-1NWJ10FCQG"
};

// Initialize Firebase
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
    showError();
}

// Get DOM elements
const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const modal = document.getElementById('qrModal');
const closeButton = document.querySelector('.close-button');
const downloadButton = document.getElementById('downloadQR');

// Hide messages initially
successMessage.style.display = 'none';
errorMessage.style.display = 'none';

// Form validation
function validateForm(formData) {
    if (!formData.name || formData.name.trim() === '') {
        throw new Error('សូមបញ្ចូលឈ្មោះ');
    }
    if (!formData.gender) {
        throw new Error('សូមជ្រើសរើសភេទ');
    }
    if (!formData.phone || !/^[0-9+\-\s]*$/.test(formData.phone)) {
        throw new Error('សូមបញ្ចូលលេខទូរស័ព្ទត្រឹមត្រូវ');
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ');
    }
    if (!formData.address || formData.address.trim() === '') {
        throw new Error('សូមបញ្ចូលអាសយដ្ឋាន');
    }
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        // Get form data
        const formData = {
            name: form.name.value,
            gender: form.gender.value,
            phone: form.phone.value,
            email: form.email.value || '',
            address: form.address.value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'បានចុះឈ្មោះ'
        };

        // Validate form data
        validateForm(formData);

        // Add to Firestore
        const docRef = await db.collection('registrations').add(formData);
        
        // Create QR code data
        const qrData = {
            documentId: docRef.id,
            name: formData.name,
            phone: formData.phone
        };

        // Convert to JSON and encode for Khmer support
        const qrDataString = encodeURIComponent(JSON.stringify(qrData));
        
        // Generate QR code
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = ''; // Clear previous QR code
        
        new QRCode(qrContainer, {
            text: decodeURIComponent(qrDataString),
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Show success message and modal
        showSuccess();
        showModal();
        form.reset();

        // Setup download button
        setupDownloadButton(qrContainer);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message);
    }
});

// Handle phone number input
document.getElementById('phone').addEventListener('input', function(e) {
    // Remove any non-numeric characters except + and -
    let value = e.target.value.replace(/[^\d+\-]/g, '');
    e.target.value = value;
});

// Setup download functionality
function setupDownloadButton(qrContainer) {
    downloadButton.onclick = () => {
        const qrImage = qrContainer.querySelector('img');
        if (qrImage) {
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = qrImage.src;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
}

// Modal functions
function showModal() {
    modal.style.display = 'block';
}

function hideModal() {
    modal.style.display = 'none';
}

// Success/Error message functions
function showSuccess() {
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

function showError(message = 'មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្តងទៀត។') {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

// Event Listeners for modal
closeButton.onclick = hideModal;

window.onclick = (event) => {
    if (event.target === modal) {
        hideModal();
    }
};

// Form input handlers
const inputs = form.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
        }
    });
});

// Initialize tooltips or any other UI components
document.addEventListener('DOMContentLoaded', () => {
    // Hide messages on page load
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    modal.style.display = 'none';
});

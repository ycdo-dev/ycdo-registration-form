// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyJdKzSPpUeAgs1ni5dJD7DviblX2E2B4",
  authDomain: "ycdo---registration-form.firebaseapp.com",
  projectId: "ycdo---registration-form",
  storageBucket: "ycdo---registration-form.firebasestorage.app",
  messagingSenderId: "632743367139",
  appId: "1:632743367139:web:d4f4cdc81329e0925cd0d6",
  measurementId: "G-1NWJ10FCQG"
};

// ចាប់ផ្តើម Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const modal = document.getElementById('qrModal');
const closeButton = document.querySelector('.close-button');
const downloadButton = document.getElementById('downloadQR');

// បិទ modal នៅពេលចុច X ឬចុចក្រៅ modal
closeButton.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// បង្កើត ID តែមួយគត់
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// បង្កើត QR Code
function createQRCode(data) {
    const qrcodeContainer = document.getElementById('qrcode');
    if (!qrcodeContainer) {
        console.error('QR code container not found');
        return;
    }
    
    qrcodeContainer.innerHTML = ''; // សម្អាត QR code ចាស់
    
    try {
        // បង្កើត object ថ្មីដែលមានតែព័ត៌មានសំខាន់ៗ
        const qrData = {
            id: data.id,
            name: data.name,
            phone: data.phone,
            documentId: data.documentId
        };
        
        console.log('QR Data:', qrData); // Log QR data
        
        // បង្កើត QR code
        new QRCode(qrcodeContainer, {
            text: JSON.stringify(qrData),
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        if (downloadButton) {
            downloadButton.onclick = function() {
                const canvas = qrcodeContainer.querySelector('canvas');
                if (canvas) {
                    const image = canvas.toDataURL("image/png");
                    const link = document.createElement('a');
                    link.download = `qr-code-${data.name}.png`;
                    link.href = image;
                    link.click();
                }
            }
        }

        // បង្ហាញ modal
        if (modal) {
            modal.style.display = "block";
        }
    } catch (error) {
        console.error('Error creating QR code:', error);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.id = generateUniqueId();
    data.timestamp = new Date().toISOString();
    
    try {
        // រក្សាទុកទិន្នន័យទៅក្នុង Firebase
        const docRef = await db.collection('registrations').add(data);
        console.log('Document written with ID:', docRef.id);
        
        // បន្ថែម document ID ទៅក្នុងទិន្នន័យសម្រាប់ QR code
        data.documentId = docRef.id;
        
        // បង្កើតនិងបង្ហាញ QR code មុនពេល reset form
        createQRCode(data);
        
        form.reset();
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
        
    } catch (error) {
        console.error('Error adding document:', error);
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
});

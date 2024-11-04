const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', e => {
    e.preventDefault();
    
    // Replace this URL with your Google Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzMPmJbt67yZL0_E05Y42JUCUVhcZX27xBYUE4EfQVC7KXgtJOFDfLo05VAOAt1Y3lmDg/exec';
    
    // Create URL-encoded data string
    const formData = new FormData(form);
    const urlEncodedData = new URLSearchParams(formData).toString();

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
    .then(response => {
        form.reset();
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    });
});

const inputs = document.querySelectorAll('.input_otp input');
const button = document.querySelector('.submit_otp button');

inputs.forEach(input => {
    let lastInputStatus = 0;
    button.setAttribute('disabled', true);
    input.onkeyup = (e) => {
        const currentElement = e.target;
        const nextElement = input.nextElementSibling;
        const prevElement = input.previousElementSibling;
    
    if(prevElement && e.keyCode === 8) {
        if(lastInputStatus === 1) {
            prevElement.value = '';
            prevElement.focus();
        }
        button.setAttribute('disabled', true);
        lastInputStatus = 1;
    }
    else {
        const validChar = /^[0-9]+$/;
        if(!validChar.test(currentElement.value)) {
            currentElement.value = currentElement.value.replace(/\D/g, ''); //non-digit char
        }
        else if(currentElement.value) {
            if(nextElement) {
                nextElement.focus();
            }
            else {
                button.removeAttribute('disabled');
                lastInputStatus = 0;
            }
        }
    }
}
})
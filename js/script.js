// Theme Selection
let themeButtons = document.querySelectorAll('.color-buttons');
localStorage.setItem('isFormFilled', false);
localStorage.setItem('validSectionCount', 0);

themeButtons.forEach(color => {
    color.addEventListener('click', (e) => {
        let icon = document.createElement('i');
        let dataColor = color.getAttribute('data-color');

        Array.from(themeButtons).map((color) => {
            if (color.querySelector('i')) {
                color.querySelector('i').remove();
            };
        });

        icon.classList.add('bx', 'bx-check', 'fs-2', 'check');
        color.append(icon);
        document.querySelector(':root').style.setProperty('--background-color', dataColor);
    });
});

// Function To Display Error Messages
function displayErrorMessage(input, message) {
    let errorSpan = document.createElement('span');
    errorSpan.classList.add('error-message');
    input.classList.add('error-input');
    errorSpan.textContent = message;
    input.parentNode.appendChild(errorSpan);
}

// Function To Remove Error Messages
function removeErrorMessage(input) {
    let errorSpan = input.parentNode.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.remove();
        input.classList.remove('error-input');
    }
}

// Function To Validate password
const validatePassword = (password) => {
    if (!/(?=.*[a-z])/.test(password)) {
        return "Password must contain at least one lowercase letter.";
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        return "Password must contain at least one uppercase letter.";
    }

    if (!/(?=.*\d)/.test(password)) {
        return "Password must contain at least one digit.";
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
        return "Password must contain at least one special character among @$!%*?&.";
    }

    if (!/^.{8,}$/.test(password)) {
        return "Password must be at least 8 characters long.";
    }
    return true;
}

// Input Field Validation By Type
const InputFieldValidation = (input) => {
    let isValid = false;
    removeErrorMessage(input);

    switch (input.type) {
        case 'text':
            const multipleWordsRegex = /\s+/;
            const numberAndSymbolRegex = /[0-9!@#$%^&*(),.?":{}|<>_+=\-[\]\\';`~/]/;

            if (!input.value.trim()) {
                displayErrorMessage(input, `This field is required.`);
            } else if (numberAndSymbolRegex.test(input.value.trim())) {
                displayErrorMessage(input, `Numbers and symbols are not allowed.`);
            } else if (input.id === 'firstName' || input.id === 'lastName') {
                if (multipleWordsRegex.test(input.value.trim())) {
                    displayErrorMessage(input, `Please enter a ${input.name}.`);
                } else {
                    isValid = true;
                }
            } else {
                isValid = true;
            }

            break;
        case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (input.value.trim() === '') {
                displayErrorMessage(input, 'Please enter your email address.');
            } else if (!emailPattern.test(input.value.trim())) {
                displayErrorMessage(input, 'Please enter a valid email address.');
            } else {
                isValid = true;
            }
            break;
        case 'number':
            const validationPatterns = {
                phoneNumber: /^\d{10}$/,
                zipCode: /^\d{6}(?:-\d{4})?$/,
                gpa: /^\d\.\d{2}$/
            };

            if (input.value.trim() === '') {
                displayErrorMessage(input, `Please enter your ${input.name}.`);
            } else if (input.id === 'phoneNumber' || input.id === 'zipCode' || input.id === 'gpa') {
                let regex = validationPatterns[input.id];
                (!regex.test(input.value.trim()))
                    ? displayErrorMessage(input, `Please enter a valid ${input.name}.`)
                    : isValid = true;
            } else {
                isValid = true;
            }
            break;
        case 'date':
            if (input.value.trim() === '') {
                displayErrorMessage(input, `Please enter your ${input.name}.`);
            } else if (input.id === 'dateOfBirth') {
                let currentDate = new Date();
                let inputDate = new Date(input.value);

                let minDate = new Date(currentDate);
                minDate.setFullYear(currentDate.getFullYear() - 18);

                if (inputDate >= currentDate || inputDate > minDate) {
                    displayErrorMessage(input, 'Please enter a valid date of birth within an acceptable range.');
                } else {
                    isValid = true;
                }
            } else {
                isValid = true;
            }
            break;
        case 'password':
            if (input.value.trim() === '') {
                displayErrorMessage(input, 'Please enter your password.');
            } else {
                let isPasswordValid = validatePassword(input.value);
                if (isPasswordValid === true) {
                    isValid = true;
                } else {
                    displayErrorMessage(input, isPasswordValid);
                    isValid = false;
                }
            }
            break;
        case 'file':
            if (input.value.trim() === '') {
                displayErrorMessage(input, `Please upload your ${input.name}.`);
            } else {
                isValid = true;
            }
            break;
        case 'url':
            const urlPatterns = {
                linkedIn: /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
                github: /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/?$/,
            };
            if (input.value.trim() === '') {
                displayErrorMessage(input, `Please enter your ${input.name} url.`);
            } else if (input.id === 'linkedIn' || input.id === 'github') {
                let regex = urlPatterns[input.id];
                (!regex.test(input.value.trim()))
                    ? displayErrorMessage(input, `Please enter a valid ${input.name}.`)
                    : isValid = true;
            } else {
                isValid = true;
            }

    }
    return isValid;
}

// Select Validations
let selectFieldValidation = (select) => {
    let isValid = false;
    removeErrorMessage(select);

    if (select.value === 'select') {
        displayErrorMessage(select, `Please select your ${select.name}.`);
    } else {
        isValid = true;
    }
    return isValid;
}

// Save Button On Click
let saveButtons = document.querySelectorAll('.save-btn');
saveButtons.forEach((btn) => {
    // Validations After Input Change
    let container = btn.getAttribute('data-container');
    let form = document.querySelector(`#${container}`);
    let inputs = form.querySelectorAll('input');
    let selects = form.querySelectorAll('select');

    inputs.forEach((input) => {
        input.addEventListener('change', () => {
            InputFieldValidation(input);
        });
    });

    selects.forEach((select) => {
        select.addEventListener('change', () => {
            selectFieldValidation(select);
        });
    });

    // Validations After Save Button Click
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        let isInputsValid = false;
        let isSelectsValid = false;
        let inputsCount = 0;
        let selectsCount = 0;
        let container = btn.getAttribute('data-container');
        let form = document.querySelector(`#${container}`);
        let inputs = form.querySelectorAll('input');
        let selects = form.querySelectorAll('select');

        inputs.forEach((input) => {
            isInputsValid = InputFieldValidation(input);
            (isInputsValid) ? inputsCount++ : inputsCount--;
        });

        selects.forEach((select) => {
            isSelectsValid = selectFieldValidation(select);
            (isSelectsValid) ? selectsCount++ : selectsCount--;
        });

        if (inputs.length === inputsCount && selects.length === selectsCount) {
            inputs.forEach((input) => {
                input.disabled = true;
            });
            selects.forEach((select) => {
                select.disabled = true;
            });
            localStorage.setItem('validSectionCount', +(+(localStorage.getItem('validSectionCount')) + 1));
            btn.disabled = true;
            let complete = document.querySelector(`#${container}-complete`);
            let accordionBtn = document.querySelector(`#${container}-btn`);
            accordionBtn.click();
            complete.classList.add('d-flex');
            btn.nextElementSibling.disabled = true;
        }
    });
});

// Reset Button Onclick
let resetButtons = document.querySelectorAll('.reset-btn');
resetButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        let container = event.target.getAttribute('data-container');
        let form = document.querySelector(`#${container}`);
        let inputs = form.querySelectorAll('input');
        let selects = form.querySelectorAll('select');

        inputs.forEach((input) => {
            removeErrorMessage(input);
        });

        selects.forEach((select) => {
            removeErrorMessage(select);
        });
    });
});

let submitBtn = document.querySelector('#submit-btn');
let clearBtn = document.querySelector('#clear-btn');

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if ((localStorage.getItem('validSectionCount')) == 7) {
        alert('Submit Success');
    } else {
        alert('Form Is Not Filled');
    }
});

clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    location.reload();
});


function validateEmail(email) {
    return email.match(/\w+@\D+\.\w+/);
}

export default validateEmail;
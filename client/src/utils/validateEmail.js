function validateEmail(email) {
    return email.match(/^\S*@\S*\.\w+/);
}

export default validateEmail;
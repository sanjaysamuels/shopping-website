

window.onload = function() {
    var addressBox = document.getElementById('address-ref')
    var passwordBox = document.getElementById('password-ref')

    for(var i = 0; i < window.userDetails.length; i++) {
        if (localStorage.getItem('un') == window.userDetails[i].username) {
            addressBox.setAttribute("value", window.userDetails[i].address)
            passwordBox.setAttribute("value", window.userDetails[i].password)
        }
    }
}
/* Data and functions for accounts */

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

window.onload = function() {
    console.log(localStorage.getItem('status'))
    if (localStorage.getItem('status') == "loggedIn"){
        document.getElementById("p1").innerHTML = `Welcome ${localStorage.getItem('un')}!`;
        var signInBlock = document.getElementById("sign-in")
        signInBlock.style.display = "none";
        get("create-account").style.display = "none";
    } else{
        document.getElementById("p1").innerHTML = "Anonymous";
        var editAccBlock = document.getElementById("edt-accnt")
        editAccBlock.style.display = "none";
        var signOutBlock = document.getElementById("sign-out")
        signOutBlock.style.display = "none";
    }
}

function storeUser(){
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("pwd").value
    const confirmPwd = document.getElementById("cfrmpwd").value
    const address = document.getElementById("address").value

    var validEmailRex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var validPassRex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (password != confirmPwd){
        document.getElementById('error-message').innerHTML = "Passwords do not match!"
    } else if (username == "" || email == "" || password == "" || address == ""){
        document.getElementById('error-message').innerHTML = "All fields must be filled!"
    } else if (!email.match(validEmailRex)){
        document.getElementById('error-message').innerHTML = "Invalid Email ID format entered!"
    } else if (!password.match(validPassRex)){
        document.getElementById('error-message').innerHTML = "Invalid password! Must have atleast one letter and symbol!"
    } 
    else {
        const result = postData('http://localhost:7266/user/register', {
            "email":email,
            "password":password,
            "username":username,
            "shipping_address":address
    })

    localStorage.setItem('status','loggedIn')
    localStorage.setItem('un', username)
    location.href = './index.html';
    
    }
}



async function signInUser(){
    console.log(localStorage.getItem('status'))
    var username = document.getElementById('username').value
	var password = document.getElementById('pwd').value

    const result = await fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json())

    if (username == "" || password == ""){
        document.getElementById('error-message').innerHTML = "All fields must be filled!"
    }
    else if (result.status === 'ok') {
        // everythign went fine
        //console.log('Got the token: ', result.data)
        localStorage.setItem('token', result.data)
        localStorage.setItem('status','loggedIn')
        localStorage.setItem('un', username)
        location.href = './index.html';
    } else if (result.status === 'nm') {
        document.getElementById('error-message').innerHTML = "Password does not match"
    } else if (result.status === 'nf'){
        document.getElementById('error-message').innerHTML = "User not found!"
    }
}


function signOut(){
    localStorage.setItem('status','loggedOut')
    localStorage.removeItem('token')
    localStorage.removeItem('un')
}

async function updateUserDetails(){
    var address = document.getElementById('address-ref').value
    var password = document.getElementById('password-ref').value

    if (address == "" && password == ""){
        document.getElementById('error-message').innerHTML = "Atleast one field must be filled!"
    }

    if (password != ""){
        const result = await fetch('/user/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newPassword: password,
                token: localStorage.getItem('token')
            })
        }).then((res) => res.json())
    
        if (result.status === 'ok') {
            // everything went fine
            alert('Password updated successfully!')
        } else {
            console.log(result.error)
        }
    }

    if (address != ""){
        const result = await fetch('/user/change-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newAddress: address,
                token: localStorage.getItem('token')
            })
        }).then((res) => res.json())
    
        if (result.status === 'ok') {
            // everythign went fine
            alert('Address updated successfully!')
        } else {
            console.log(result.error)
        }
    }
    
}



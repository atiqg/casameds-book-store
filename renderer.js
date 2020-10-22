//FIREBASE LIBRARIES/PACKAGES
var firebase = require('firebase/app');
require('firebase/auth');
//ALERT BOX PACKAGE
const Swal = require('sweetalert2');
//INITIALIZE FIREBASE APP
initFirebase();
//STORE UNIQUE USER ID
let unique_uid;
//GET CMD TO CHECK APP IS RUNNING FOR THE FIRST TIME
var cmd = process.argv[1];




//TOGGLE LOGIN & SIGNUP FORM
const changeForm = () => {
    const container = document.querySelector('.containerMain');
    container.classList.toggle('active');
};

/**
 * FUNCTION TO CREATE A USER IN FIREBASE DATABASE
 * STEP 1: GET FORM VARIABLES AND VALIDATE THEM
 * STEP 2: CREATE USER WITH FIREBASE 
 * STEP 3: IF SUCCESS SHOW UID ELSE SHOW ERROR
 */
function signUpUser(){
    var email= document.querySelector('#signUpEmail').value;
    var password= document.querySelector('#signUpPassword').value;
    var confirmPassword= document.querySelector('#signUpConfirm').value;
    //validate form variables
    if(email == "" || password == "" || password!=confirmPassword){
        Swal.fire('warning', 'Fill form correctly', 'warning');
        return;
    }
    //start loading
    document.querySelector('#loadingSvg').style.display='block';

    //signup user with firebase
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        document.querySelector('#loadingSvg').style.display='none';
        unique_uid = user.user.uid;
        Swal.fire('Success', 'Signed Up successfully', 'success');
        toggle_book_order_page();
    }).catch(function(error) {
        document.querySelector('#loadingSvg').style.display='none';
        // handle errors.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          Swal.fire('Error', 'The password is too weak.', 'error');
        } else {
          Swal.fire('Error', errorMessage, 'error');
        }
        console.log(error);
    });
}

/**
 * FUNCTION TO LOGIN A FIREBASE REGISTERED USER
 * STEP 1: GET FORM VARIABLES AND VALIDATE THEM
 * STEP 2: TRY TO LOGIN USER WITH FIREBASE
 * STEP 3: IF SUCCESSFUL SHOW UID ELSE SHOW ERROR
 */
function logInUser(){
    //get form variables 
    var email= document.querySelector('#logInEmail').value;
    var password= document.querySelector('#logInPassword').value;
    
    //validate form variables
    if(email == "" || password == ""){
        Swal.fire('Warning', 'Fill form correctly', 'warning');
        return;
    }
    
    
    //start loading
    document.querySelector('#loadingSvg').style.display='block';
    
    //login user with password and email
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
        document.querySelector('#loadingSvg').style.display='none';
        // store user uid
        unique_uid = user.user.uid;
        Swal.fire('Success', 'Signed In successfully', 'success');
        toggle_book_order_page();
    }).catch(function(error) {
        document.querySelector('#loadingSvg').style.display='none';
        //handle errors 
        var errorCode = error.code;
        var errorMessage = error.message;
     
        if (errorCode === 'auth/wrong-password') {
            Swal.fire('Error', 'Wrong password', 'error');
        } else {    
            Swal.fire('Error', errorMessage, 'error');
        }
        console.log(error);
    });
}

/**
 * FUNCTION TO INITIALIZE FIREBASE APP
 * STEP 1: CONFIGURE ALL PARAMETERS
 * STEP 2: INITIALIZE APP WITH THOSE PARAMETERS
 */
function initFirebase(){
    var firebaseConfig = {
        apiKey: "AIzaSyCVcJwrCgiTc6eVoatenc8XMn-Tvwn-CGc",
        authDomain: "casameds.firebaseapp.com",
        databaseURL: "https://casameds.firebaseio.com",
        projectId: "casameds",
        storageBucket: "casameds.appspot.com",
        messagingSenderId: "514916400979",
        appId: "1:514916400979:web:c2b3f3104bdd8cc952aba6",
        measurementId: "G-0M91BF7DJG"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

/**(####  URL USED TO SEND EMAIL IN THIS FUNCTION IS PART OF ANOTHER PROJECT MADE BY ATIQ GAURI #####)
 * FUNCTION TO SEND BOOK IN A EMAIL TO USER
 * STEP 1: GET SELECTED BOOK AND EMAIL
 * STEP 2: VALIDATE ALL VARIABLES
 * STEP 3: SET EMAIL URL WITH EMAIL, SUBJECT AND BODY PARAMETERS
 */
function order_selected_book(){
    let selected_book_name, email = document.querySelector('#purchaserEmail').value;
    //get selected book
    if (document.querySelector('#thePossibleWorld').checked) {
        selected_book_name = 'The Possible World';
    }else if (document.querySelector('#humans').checked) {
        selected_book_name = 'Humans';
    }else if (document.querySelector('#atomicHabit').checked) {
        selected_book_name = 'Atomic Habit';
    }else{
        Swal.fire('warning', 'Please select any one book', 'warning');
        return;
    }
    //validate email
    if(email == ''){
        Swal.fire('warning', 'Please enter a valid email', 'warning');
        return;
    }

    //start loading
    document.querySelector('#loadingSvg').style.display='block';
    //configure mail request url
    //(####  URL USED TO SEND EMAIL IN THIS FUNCTION IS PART OF ANOTHER PROJECT MADE BY ATIQ GAURI #####)
    let url = 'https://us-central1-notchup-test.cloudfunctions.net/sendMail?parentEmail='+ email +
    '&emailSubject=Your casameds book by Atiq Gauri&emailBody='+
    'Here is your book\'s <a href="https://atiqgauri.github.io/assets/files/Atiq_Gauri.pdf">download link</a>';
    
    //request mail
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //stop loading
            document.querySelector('#loadingSvg').style.display='none';
            //show email is sent
            Swal.fire('Success', 'Your book has been sent to ' + email, 'success');
        }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

/**
 * FUNCTION TO CHANGE HTML BLOCK TO BOOKS PAGE
 */
function toggle_book_order_page(){
    document.querySelector('#bodySection').innerHTML = '<p class="userID" id="userID">User_ID (UID): '+ unique_uid +'</p>' +
    '<div class="container">'+
    '<div class="row">' +
    '<div class="col-md-4 col-lg-4 col-sm-4" id="book_box">' +
    '<label>' +
    '<input type="radio" name="product" class="card-input-element" id="thePossibleWorld" />' +
    '<div class="panel panel-default card-input" id="selectionArea">' +
    '<div class="panel-heading">The Possible World</div>' +
    '<div class="panel-body">' +
    '<img src="./assets/book1.jpg" width="220" height="300" alt="" draggable="false" />' +
    '</div>' +
    '</div>' +
    '</label>' +
    '</div>' +
    '<div class="col-md-4 col-lg-4 col-sm-4" id="book_box">' +
    '<label>' +
    '<input type="radio" name="product" class="card-input-element" id="humans" />' +
    '<div class="panel panel-default card-input" id="selectionArea">' +
    '<div class="panel-heading">Humans</div>' +
    '<div class="panel-body">' +
    '<img src="./assets/book2.jpg" width="220" height="300" alt="" draggable="false" />' +
    '</div>' +
    '</div>' +
    '</label>' +
    '</div>' +
    '<div class="col-md-4 col-lg-4 col-sm-4" id="book_box">' +
    '<label>' +
    '<input type="radio" name="product" class="card-input-element" id="atomicHabit" />' +
    '<div class="panel panel-default card-input" id="selectionArea">' +
    '<div class="panel-heading">Atomic Habit</div>' +
    '<div class="panel-body">' +
    '<img src="./assets/book3.jpg" width="220" height="300" alt="" draggable="false" />' +
    '</div>' +
    '</div>' +
    '</label>' +
    '</div>' +
    '</div>' +
    '<div id="purchaseSection">' +
    '<label for="fname" id="purchaserEmailLabel">Enter your email to receive downloadable link of the selected book</label>' +
    '<input type="email" id="purchaserEmail" name="fname" placeholder="****@gmail.com"><br><br>' +
    '<button type="button" id="purchaserBookButton" onclick="order_selected_book()">Order Book</button>' +
    '</div>' +
    '</div>';


}

//IF APP IS RUNNING FOR THE FIRST TIME THEN SHOW THE REQUIREMENTS
if (cmd == '--squirrel-firstrun') {
    Swal.fire('This app require internet connection', '', 'info');
}
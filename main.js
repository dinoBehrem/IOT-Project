// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyB8vfdak77CGScERGh2Y7AQHNeYVXPti8c",
    authDomain: "iot-project-93c00.firebaseapp.com",
    databaseURL: "https://iot-project-93c00-default-rtdb.firebaseio.com",
    projectId: "iot-project-93c00",
    storageBucket: "iot-project-93c00.appspot.com",
    messagingSenderId: "808237092699",
    appId: "1:808237092699:web:6ceec790c5e8460019147e",
    measurementId: "G-R0ZB3KHZHE"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

//firebase data
let pump_1 = firebase.database().ref("pump_1");
let pump_2 = firebase.database().ref("pump_2");
let pump_3 = firebase.database().ref("pump_3");
let pump_4 = firebase.database().ref("pump_4");

let temp_1 = 0;
let temp_2 = 0;

let active_pump1;

pump_1.on('value', data => {
    document.querySelectorAll(".fa-thermometer-half")[0].innerText = data.val().temp + '°C';
    document.querySelectorAll(".fa-stopwatch")[0].innerText = convertTime(data.val().active_time);

    if (!data.val().isWorking && !data.val().broken && data.val().temp <= 60 && data.val().active_time <= 50) {
        active_pump1 = data; 
    }else{
        data.isWorking = true;
    }
});

pump_2.on('value', data => {
    document.querySelectorAll(".fa-thermometer-half")[1].innerText = data.val().temp + '°C';
    document.querySelectorAll(".fa-stopwatch")[1].innerText = convertTime(data.val().active_time);
});

pump_3.on('value', data => {
    document.querySelectorAll(".fa-thermometer-half")[2].innerText = data.val().temp + '°C';
    document.querySelectorAll(".fa-stopwatch")[2].innerText = convertTime(data.val().active_time);
});

pump_4.on('value', data => {
    document.querySelectorAll(".fa-thermometer-half")[3].innerText = data.val().temp;
    document.querySelectorAll(".fa-stopwatch")[3].innerText = convertTime(data.val().active_time);
});

// events

let incrementor_1 = 1;
let incrementor_2 = 1;

	setInterval(() => {
        temp_1 += incrementor_1;
        active_pump1.val().temp = temp_1;
        console.log(active_pump1.val().temp);

        
        if(active_pump1 != "undefiend")
        {
            pump_1.set(active_pump1.val());
        }
	}, 1000);

// utils
function convertTime(number)
{
    let active_time = parseInt(number / 60) + ":" + number % 60;
    
    return active_time;
}


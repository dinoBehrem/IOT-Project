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
  measurementId: "G-R0ZB3KHZHE",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

let firestore = firebase.firestore();

//firebase data
let pump_1 = firebase.database().ref("pumpe/pump1");
let pump_2 = firebase.database().ref("pumpe/pump2");
let pump_3 = firebase.database().ref("pumpe/pump3");
let pump_4 = firebase.database().ref("pumpe/pump4");

pump_1.on("value", function (snapshot) {
  var dataArray = snapshot.val();
  console.log("Pump 1 Data:", dataArray);

  const tempElement = document.querySelectorAll(".fa-thermometer-half")[0];
  const timeElement = document.querySelectorAll(".fa-stopwatch")[0];
  const isMalfunctioning = document.querySelectorAll(".fa-ban")[0];
  const pumpImg = document.querySelectorAll("img")[0];

  if (tempElement && timeElement && isMalfunctioning && pumpImg) {
    tempElement.innerText = dataArray.temperature + "°C";
    timeElement.innerText = convertTime(dataArray.activeHorus);
    isMalfunctioning.setAttribute(
      "style",
      dataArray.isMalfunctioning ? "color:red" : "color:green"
    );

    pumpImg.setAttribute(
      "style",
      dataArray.isActive ? "background-color:green" : "background-color:yellow"
    );
  } else {
    console.error("Elements for Pump 1 not found");
  }
});

pump_2.on("value", (snapshot) => {
  var dataArray = snapshot.val();
  console.log("Pump 1 Data:", dataArray);

  const tempElement = document.querySelectorAll(".fa-thermometer-half")[1];
  const timeElement = document.querySelectorAll(".fa-stopwatch")[1];
  const isMalfunctioning = document.querySelectorAll(".fa-ban")[1];
  const pumpImg = document.querySelectorAll("img")[1];

  if (tempElement && timeElement && isMalfunctioning && pumpImg) {
    tempElement.innerText = dataArray.temperature + "°C";
    timeElement.innerText = convertTime(dataArray.activeHours);
    isMalfunctioning.setAttribute(
      "style",
      dataArray.isMalfunctioning ? "color:red" : "color:green"
    );

    pumpImg.setAttribute(
      "style",
      dataArray.isActive ? "background-color:green" : "background-color:yellow"
    );
  } else {
    console.error("Elements for Pump 2 not found");
  }
});

pump_3.on("value", (snapshot) => {
  var dataArray = snapshot.val();
  console.log("Pump 1 Data:", dataArray);

  const tempElement = document.querySelectorAll(".fa-thermometer-half")[2];
  const timeElement = document.querySelectorAll(".fa-stopwatch")[2];
  const isMalfunctioning = document.querySelectorAll(".fa-ban")[2];
  const pumpImg = document.querySelectorAll("img")[2];

  if (tempElement && timeElement && isMalfunctioning && pumpImg) {
    tempElement.innerText = dataArray.temperature + "°C";
    timeElement.innerText = convertTime(dataArray.activeHours);
    isMalfunctioning.setAttribute(
      "style",
      dataArray.isMalfunctioning ? "color:red" : "color:green"
    );

    pumpImg.setAttribute(
      "style",
      dataArray.isActive ? "background-color:green" : "background-color:yellow"
    );
  } else {
    console.error("Elements for Pump 3 not found");
  }
});

pump_4.on("value", (snapshot) => {
  var dataArray = snapshot.val();
  console.log("Pump 1 Data:", dataArray);

  const tempElement = document.querySelectorAll(".fa-thermometer-half")[3];
  const timeElement = document.querySelectorAll(".fa-stopwatch")[3];
  const isMalfunctioning = document.querySelectorAll(".fa-ban")[3];
  const pumpImg = document.querySelectorAll("img")[3];

  if (tempElement && timeElement && isMalfunctioning && pumpImg) {
    tempElement.innerText = dataArray.temperature + "°C";
    timeElement.innerText = convertTime(dataArray.activeHours);
    isMalfunctioning.setAttribute(
      "style",
      dataArray.isMalfunctioning ? "color:red" : "color:green"
    );

    pumpImg.setAttribute(
      "style",
      dataArray.isActive ? "background-color:green" : "background-color:yellow"
    );
  } else {
    console.error("Elements for Pump 3 not found");
  }
});

// utils
function convertTime(number) {
  if (number == 0) {
    return "0:0";
  }
  let active_time = parseInt(number / 60) + ":" + (number % 60);

  return active_time;
}

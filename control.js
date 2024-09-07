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

let number = firebase.database().ref("randomNumber");

number.on("value", function(value) {
  var data = value.val();

  document.getElementById("randomNumber").innerText = data;
});

const pumps = {
  pump1: firebase.database().ref("pumpe/pump1"),
  pump2: firebase.database().ref("pumpe/pump2"),
  pump3: firebase.database().ref("pumpe/pump3"),
  pump4: firebase.database().ref("pumpe/pump4"),
};

function activatePump(pumpRef) {
  pumpRef.update({
    isActive: true,
    restHours: 0,
  });
  startActiveHoursTimer(pumpRef);
}

function restPump(pumpRef) {
  pumpRef.update({
    isActive: false,
    activeHours: 0,
  });
}

function updatePumpTemperature(pumpId, inputElementId) {
    const temperatureValue = parseInt(document.getElementById(inputElementId).value);
    
    if (!isNaN(temperatureValue)) {
        updateTemperature(pumps[pumpId], temperatureValue);
    } else {
        console.error("Invalid temperature value");
    }
}

function updateTemperature(pumpRef, newTemperature) {
    pumpRef.update({
        temperature: newTemperature
    });
}

function startActiveHoursTimer(pumpRef) {
  const intervalId = setInterval(() => {
    pumpRef.once("value").then((snapshot) => {
      const pump = snapshot.val();
      if (pump.isActive) {
        var temperatureIncrease = 0;

        if (pump.temperature < 60) {
          temperatureIncrease = 10;
        }

        pumpRef.update({
          activeHours: pump.activeHours + 1,
          temperature: pump.temperature + temperatureIncrease,
        });
        if (pump.activeHours >= 8 || pump.temperature > 80) {
          restPump(pumpRef);
          clearInterval(intervalId);
          switchPumps();
        }
      } else {
        clearInterval(intervalId);
      }
    });
  }, 3000);
}

function switchPumps() {
    Promise.all(Object.values(pumps).map(ref => ref.once("value"))).then(snapshots => {
        const pumpData = snapshots.map(snapshot => snapshot.val());
        const activePumps = [];
        const restingPumps = [];

        pumpData.forEach((pump, index) => {
            if (pump.isActive) {
                activePumps.push({ pump, ref: Object.values(pumps)[index] });
            } else {
                restingPumps.push({ pump, ref: Object.values(pumps)[index] });
            }
        });

        activePumps.forEach(({ pump, ref }) => {
            if (pump.activeHours >= 8 || pump.temperature > 80) {
                restPump(ref);

                for (let i = 0; i < restingPumps.length; i++) {
                    const restingPump = restingPumps[i];
                    if (restingPump.pump.restHours >= 4 && restingPump.pump.temperature < 40) {
                        activatePump(restingPump.ref);
                        restingPumps.splice(i, 1);
                        break;
                    }
                }
            }
        });
    });
}

window.onload = function () {
  activatePump(pumps.pump1);
  activatePump(pumps.pump2);
  restPump(pumps.pump3);
  restPump(pumps.pump4);
};

Object.values(pumps).forEach((pumpRef) => {
  pumpRef.on("value", () => {
    switchPumps();
  });
});

setInterval(() => {
  Object.entries(pumps).forEach(([key, pumpRef]) => {
    pumpRef.once("value").then((snapshot) => {
      const pump = snapshot.val();

      var temperatureDecrease = 0;

      if (pump.temperature > 10) {
        temperatureDecrease = 10;
      } else if (pump.temperature >= 1) {
        temperatureDecrease = 1;
      }

      var restHourIncrease = 0;

      if (pump.restHours > 0 && !pump.isActive && pump.activeHours > 0) {
        restHourIncrease = 1;
      }

      if (!pump.isActive) {
        pumpRef.update({
          restHours: pump.restHours + 1,
          temperature: pump.temperature - temperatureDecrease,
          activeHours: pump.activeHours - restHourIncrease,
        });
      }
    });
  });
}, 3000);

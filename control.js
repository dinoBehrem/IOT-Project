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

const pumps = {
    pump1: firebase.database().ref("pumpe/pump1"),
    pump2: firebase.database().ref("pumpe/pump2"),
    pump3: firebase.database().ref("pumpe/pump3"),
    pump4: firebase.database().ref("pumpe/pump4")
};

// Function to update temperature for a specific pump
function updateTemperature(pumpRef, newTemperature) {
    pumpRef.update({
        temperature: newTemperature
    });
}

// Function to activate a pump
function activatePump(pumpRef) {
    pumpRef.update({
        isActive: true,
        activeHours: 0,
        restHours: 0
    });
    startActiveHoursTimer(pumpRef);
}

// Function to start the activeHours timer for a pump
function startActiveHoursTimer(pumpRef) {
    const intervalId = setInterval(() => {
        pumpRef.once('value').then(snapshot => {
            const pump = snapshot.val();
            if (pump.isActive) {
                pumpRef.update({
                    activeHours: pump.activeHours + 1
                });
                if (pump.activeHours >= 8) {
                    restPump(pumpRef);
                    clearInterval(intervalId);
                }
            } else {
                clearInterval(intervalId);
            }
        });
    }, 4000);
}

// Function to rest a pump
function restPump(pumpRef) {
    pumpRef.update({
        isActive: false,
        restHours: 0    // Reset rest hours when pump is rested
    });
}

// Function to update pump temperature based on input element
function updatePumpTemperature(pumpId, inputElementId) {
    const temperatureValue = parseInt(document.getElementById(inputElementId).value);
    
    if (!isNaN(temperatureValue)) {
        updateTemperature(pumps[pumpId], temperatureValue);
    } else {
        console.error("Invalid temperature value");
    }
}

// Function to handle pump logic
function managePumps() {
    Promise.all(Object.values(pumps).map(ref => ref.once('value'))).then(snapshots => {
        const pumpData = snapshots.map(snapshot => snapshot.val());
        
        // Determine pairs of pumps (e.g., pump1 & pump2, pump3 & pump4)
        const pairs = [
            { pumpA: pumpData[0], pumpB: pumpData[1], refA: pumps.pump1, refB: pumps.pump2 },
            { pumpA: pumpData[2], pumpB: pumpData[3], refA: pumps.pump3, refB: pumps.pump4 }
        ];
        
        pairs.forEach(({ pumpA, pumpB, refA, refB }) => {
            if (pumpA.isMalfunctioning || pumpA.temperature > 80) {
                restPump(refA);
                if (!pumpB.isMalfunctioning && pumpB.restHours >= 8) { 
                    activatePump(refB);
                }
            } else if (pumpB.isMalfunctioning || pumpB.temperature > 80) {
                restPump(refB);
                if (!pumpA.isMalfunctioning && pumpA.restHours >= 8) {
                    activatePump(refA);
                }
            }

            // Handle the 8-hour operation rule
            if (pumpA.isActive && pumpA.activeHours >= 8) {
                restPump(refA);
                if (!pumpB.isMalfunctioning && pumpB.restHours >= 8) {
                    activatePump(refB);
                }
            } else if (pumpB.isActive && pumpB.activeHours >= 8) {
                restPump(refB);
                if (!pumpA.isMalfunctioning && pumpA.restHours >= 8) {
                    activatePump(refA);
                }
            }
        });
    });
}

// Set Pump 1 and Pump 2 as active when the app starts
window.onload = function() {
    activatePump(pumps.pump1);
    activatePump(pumps.pump2);
};

// Listen for changes and manage pumps accordingly
Object.values(pumps).forEach(pumpRef => {
    pumpRef.on('value', () => {
        managePumps();
    });
});

// Timer to increase restHours for inactive pumps
setInterval(() => {
    Object.entries(pumps).forEach(([key, pumpRef]) => {
        pumpRef.once('value').then(snapshot => {
            const pump = snapshot.val();
            if (!pump.isActive) {
                pumpRef.update({
                    restHours: pump.restHours + 1
                });
            }
        });
    });
}, 4000); // 1 hour in milliseconds

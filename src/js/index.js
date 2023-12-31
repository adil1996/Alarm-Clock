const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");
const setalarmContainer = document.querySelector(".set-alarm-container");

// Adding Hours, Minutes, Seconds in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById('set-alarm-container').style.display  = "none";
  dropDownMenu(1, 12, setHours);
 
  dropDownMenu(0, 59, setMinutes);

  dropDownMenu(0, 59, setSeconds);

  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

// Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", getInput);


function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}


function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;

  return time;
}


function getInput(e) {
  e.preventDefault();
  const hourValue = setHours.value;
  const minuteValue = setMinutes.value;
  const secondValue = setSeconds.value;
  const amPmValue = setAmPm.value;

  const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    amPmValue
  );
  setAlarm(alarmTime);
}

// Converting time to 24 hour format
function convertToTime(hour, minute, second, amPm) {
  debugger
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}


function alarmAlert(time) {
  alert('Ringing Alarm : '+time);
}

function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      document.getElementById("ringtone").play();
      setTimeout(alarmAlert(time),3000);
      document.getElementById("ringtone").pause();
      document.getElementById("ringtone").currentTime = 0;
    }
    console.log("running");
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

// Alarms set by user Dislayed in HTML
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmContainer.prepend(alarm);
}

// Is alarms saved in Local Storage?
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) {
    alarms = JSON.parse(isPresent);
    
  }


  return alarms;
}

// save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarams();
  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
  if(alarms.length > 0) {
    document.getElementById('set-alarm-container').style.display  = "block";
  }
}

// Fetching alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarams();

  if(alarms.length > 0) {
    document.getElementById('set-alarm-container').style.display  = "block";
  }

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}


function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
}

function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
  if(alarms.length == 0) {
    document.getElementById('set-alarm-container').style.display  = "none";
  }
}
const form = document.getElementById("form");

const startTimeInput = document.getElementById("startTime")


startTimeInput.addEventListener('change', function(e) {
  const endTimeInput = document.getElementById("endTime")
  endTimeInput.setAttribute("min", e.target.value);
})

function addZero(num) {
  if(num < 10) {
    return '0'+num;
  } else {
    return num;
  }
}


function setMinStart() {
  let minDate = new Date();
  console.log(minDate);
  let year = minDate.getFullYear();
  let month = addZero(minDate.getMonth() + 1);
  let day = addZero(minDate.getDate());
  let hour = addZero(minDate.getHours());
  let minutes = addZero(minDate.getMinutes());

  startTimeInput.setAttribute("min", `${year}-${month}-${day}T${hour}:${minutes}`);
}

setMinStart();

// Jank town USA
function getLinkFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  let link = urlParams.get('link');
  document.getElementById('link').value = link;
}

getLinkFromURL();

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const link = document.getElementById('link').value
    if (!link) return;
    const eventTitle = document.getElementById('title').value
    var eventStartTime = document.getElementById('startTime').value
    var eventEndTime = document.getElementById('endTime').value
    var eventDescription = document.getElementById('description').value
    if (!eventDescription) {
        eventDescription = ''
    }
    var eventReminder = false
    if (document.getElementById('reminder').value) {
        eventReminder = true
    }

    var event = {
        'summary': eventTitle,
        'location': link,
        'description': eventDescription,
        'start': {
            'dateTime': eventStartTime + ':00-0500',
            // 'timeZone': 'America/Chicago'
          },
        
          'end': {
            'dateTime': eventEndTime + ':00-0500'
            // 'timeZone': 'America/Chicago'
          },
        
        'reminders': {
            'useDefault': eventReminder
        }
    }
    chrome.runtime.sendMessage({
        msg: 'add_event',
        data: { event }
    })
    window.close();
});
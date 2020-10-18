const form = document.getElementById("form");

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
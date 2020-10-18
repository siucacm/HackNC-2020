const list = document.getElementById("link-list")

let eventsData = [];

chrome.storage.sync.get('events', function (result) {
    console.log(result.events)
    eventsData = result.events;
    makeList()
})


function makeList() {
    //console.log(eventsData)
    eventsData.forEach((val, index) => {
        appendList(val, index)
    })
}

function deleteFromList(link, index) {
    linkData.splice(index, 1)
    console.log(index);
    link.remove();
    chrome.storage.sync.set({ links: linkData }, function () {
        console.log("DELETED", linkData);
    })
}

function appendList(event, index) {
    var li = document.createElement('li')
    var a = document.createElement('a');
    var s = document.createElement('span')
    a.setAttribute('href', event[2]);
    console.log(event[2])
    a.setAttribute('target', '_blank');
    event.pop();
    // a.setAttribute('innerHTML', event[0] + event[1])
    a.classList.add('list-item-link');
    a.appendChild(document.createTextNode(event));

    // s.appendChild(document.createTextNode('DELETE'));
    // s.classList.add('list-item-delete');
    // s.addEventListener('click', function () { deleteFromList(li, index) });


    li.classList.add('list-item')
    li.appendChild(a);
    li.appendChild(s);

    list.appendChild(li);

}

const form = document.getElementById("form");

//console.log(form);

// form.addEventListener('submit', function(e) {
//     // chrome.identity.getAuthToken({interactive: false}, function(token) {
//     //     console.log(token);
//     // })
//     e.preventDefault();
//     const link = document.getElementById('link').value
//     if(!link) return;
//     linkData.push(link);
//     // chrome.storage.sync.set({links:linkData}, function() {
//     //     appendList(link, linkData.length-1);
//     //     document.getElementById('text').value = '';
//     // })
// })

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

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request.data);
        if (request.msg === "add_link") {
            let link = request.data.link;
            console.log(link);
            if (link) {
                linkData.push(link);
                chrome.storage.sync.set({ links: linkData }, function () {
                    appendList(link, linkData.length - 1);
                })
            }

        }
    }
);

document.getElementById("switchbtn1").addEventListener("click", switchDiv);
document.getElementById("switchbtn2").addEventListener("click", switchDiv);

function switchDiv() {
    console.log("divs were switched!");
    var add = document.getElementById("add-meeting");
    var list = document.getElementById("list-meeting");
    if(add.style.display == "none") {
        add.style.display = "block";
        list.style.display = "none";
    } else {
        add.style.display = "none";
        list.style.display = "block";
    }
}

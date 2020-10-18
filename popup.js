const list = document.getElementById("link-list")

let linkData = [];

chrome.storage.sync.get('links', function (result) {
    console.log(result);
    linkData = result.links;
    makeList()
})


function makeList() {
    linkData.forEach((val, index) => {
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

function appendList(link, index) {
    var li = document.createElement('li')
    var a = document.createElement('a');
    var s = document.createElement('span')
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');
    a.classList.add('list-item-link');
    a.appendChild(document.createTextNode(link));

    s.appendChild(document.createTextNode('DELETE'));
    s.classList.add('list-item-delete');
    s.addEventListener('click', function () { deleteFromList(li, index) });


    li.classList.add('list-item')
    li.appendChild(a);
    li.appendChild(s);

    list.appendChild(li);

}

const form = document.getElementById("form");

console.log(form);

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
    chrome.identity.getAuthToken({ interactive: false }, function (token) {
        console.log(token);
    })
    e.preventDefault();

    const link = document.getElementById('link').value
    if (!link) return;
    const eventTitle = document.getElementById('title').value
    const eventTime = document.getElementById('time').value
    const eventDescription = document.getElementById('description').value
    if (!eventDescription) {
        eventDescription = ''
    }
    const eventReminder = false
    if (document.getElementById('reminder').value) {
        const eventReminder = true
    }

    var event = {
        'summary': eventTitle,
        'location': link,
        'description': eventDescription,
        'start': {
            'dateTime': eventTime,
        },
        'end': {
            'dateTime': '2015-05-28T17:00:00-07:00',
        },
        'reminders': {
            'useDefault': eventReminder
        }
    };
    chrome.runtime.sendMessage({
        msg: 'add_event',
        data: { event }
    })
    //ADD_EVENT(event);
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
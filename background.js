const manifest = chrome.runtime.getManifest()



chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ events: [] }, function () {
        console.log("The event array has been made!")
    })
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        chrome.storage.sync.set({ auth_token: token }, function () {
            console.log("TOKEN SAVED");
        })
    })

    gapi.load('client', start)
})


const gapiInitData = {
    apiKey: 'AIzaSyDxpca03rBRSddS8HoGPYaP_eQqKRL5PNA',
    clientId: manifest.oauth2.client_id,
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
}

const calenderList = 'https://www.googleapis.com/calendar/v3/users/me/calendarList'

const addCalendar = 'https://www.googleapis.com/calendar/v3/calendars'

const addEvent = 'https://www.googleapis.com/calendar/v3/calendars/'


const eventList = 'https://www.googleapis.com/calendar/v3/calendars/'

function createCalendar() {
    gapi.client.request({
        path: addCalendar,
        method: 'POST',
        body: {
            summary: 'OMM_MEETING_CAL'
        }
    }).then(function (response) {
        chrome.storage.sync.set({ calendarID: response.result.id })
    })
}

function start() {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        gapi.client.init({ gapiInitData }).then(function () {
            gapi.auth.setToken({
                'access_token': token
            })

            return gapi.client.request({
                path: calenderList,
                method: 'GET'
            })
        }).then(function (response) {
            
            let cals = response.result.items;
            for(let i = 0; i < cals.length; i++) {
                if(cals[i].summary == 'OMM_MEETING_CAL') {
                    // TODO: cal id only gets set on install so if the cal were to be deleted whole thing would need to be reinstalled
                    chrome.storage.sync.set({calendarID: cals[i].id}); 
                    return;
                }
            }
            //console.log(cals);
            createCalendar();
        })
        getEvents();
    })
}


function addLink(info, tab) {
    
    chrome.tabs.create({url:`addLink.html?link=${info.selectionText}`});
    
    /*var views = chrome.extension.getViews({ type: "popup" });
    if (views.length > 0) {
        console.log(views);
        console.log("Word " + info.selectionText + " was clicked.");
        chrome.runtime.sendMessage({
            msg: "add_link",
            data: { link: info.selectionText }
        })
    }
    else {
        chrome.storage.sync.get('links', function (result) {
            let links = result.links;
            links.push(info.selectionText);
            chrome.storage.sync.set({ links }, function () {
                console.log("Updated Links");
            })
        })
    }
    */
}

function addEvents(allEvents) {
    chrome.storage.sync.get('events', function (result) {
        let ourEvents = result.events
        console.log(allEvents)
        for (var i = 0; i < allEvents.length; i++) {
            ourEvents.push([allEvents[i].summary, allEvents[i].start.dateTime, allEvents[i].location])
        }

        chrome.storage.sync.set({events: ourEvents})
    })
}

function getEvents() {
    chrome.storage.sync.get('calendarID', function (result) {
        let ourCalendar = result.calendarID;

        return gapi.client.request({
            path: eventList + ourCalendar + "/events",
            method: 'GET',
            body: {
                calendarID: ourCalendar
            }
        }).then(function (response) {
            addEvents(response.result.items)
            // console.log(response.result.items)
            //chrome.storage.sync.set({ events: [response.result.items.summary, response.result.items.timeZone, response.result.items.description]})
        })
    });
}


chrome.contextMenus.create({
    title: "Add To OMM: %s",
    contexts: ["selection"],
    onclick: addLink
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg == 'add_event') {

        let event = request.data.event
        chrome.storage.sync.get('calendarID', function (result) {
            let calendarID = result.calendarID;
            //console.log(calendarID.type)

            gapi.client.request({
                path: addEvent + calendarID + "/events",
                method: 'POST',
                body: {
                    start: {
                        dateTime: event.start.dateTime
                        // timeZone: event.start.timeZone
                    },
                    end: {
                        dateTime: event.end.dateTime
                        // timeZone: event.end.timeZone
                    },

                    description: event.description,
                    location: event.location,
                    summary: event.summary,
                    reminders: {
                        useDefault: event.reminders
                    }
                }
            }).then(function (response) {
                console.log(response)
                getEvents();
            })
        });
    }
});

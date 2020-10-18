const manifest = chrome.runtime.getManifest()



chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ links: [] }, function () {
        console.log("The link array has been made!")
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

function start() {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        gapi.client.init({ gapiInitData }).then(function () {
            gapi.auth.setToken({
                'access_token': token
            })

            return gapi.client.request({
                path: addCalendar,
                method: 'POST',
                body: {
                    summary: 'OMM_MEETING_CAL'
                }
            })
        }).then(function (response) {
            chrome.storage.sync.set({ calendarID: response.result.id })
        })
    })
}


function addLink(info, tab) {
    var views = chrome.extension.getViews({ type: "popup" });
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
            })
        });
    }
});

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

const calenderList = 'https://www.googleapis.com/calendar/v3/users/me/calendarList'

const gapiInitData = {
    apiKey: 'AIzaSyDxpca03rBRSddS8HoGPYaP_eQqKRL5PNA',
    clientId: manifest.oauth2.client_id,
    scope: 'https://www.googleapis.com/auth/calendar.readonly'
}

function start() {

    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        gapi.client.init({ gapiInitData }).then(function () {
            gapi.auth.setToken({
                'access_token': token
            })

            return gapi.client.request({
                'path': calenderList
            })
        }).then(function (response) {
            console.log(response);
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
    if (request.type == 'calender_list') {

    }
});

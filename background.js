
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({links: []}, function() {
    console.log("The link array has been made!")
  })
  chrome.identity.getAuthToken({interactive: true}, function(token) {
      chrome.storage.sync.set({auth_token: token}, function() {
          console.log("TOKEN SAVED");
      })
  })
})


function addLink(info,tab) {
    var views = chrome.extension.getViews({ type: "popup" });
    if(views.length > 0) {
        console.log(views);
        console.log("Word " + info.selectionText + " was clicked.");
        chrome.runtime.sendMessage({
            msg: "add_link",
            data: { link: info.selectionText }
        })
    }
    else {
        chrome.storage.sync.get('links', function(result) {
            let links = result.links;
            links.push(info.selectionText);
            chrome.storage.sync.set({links}, function() {
                console.log("Updated Links");
            })
        })
    }
    
  }
chrome.contextMenus.create({
    title: "Add To OMM: %s", 
    contexts:["selection"], 
    onclick: addLink
});


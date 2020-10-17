
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({links: []}, function() {
    console.log("The link array has been made!")
  })
})


function addLink(info,tab) {
    console.log("Word " + info.selectionText + " was clicked.");
    chrome.runtime.sendMessage({
        msg: "add_link",
        data: { link: info.selectionText }
    })
  }
chrome.contextMenus.create({
title: "Add To OMM: %s", 
contexts:["selection"], 
onclick: addLink
});


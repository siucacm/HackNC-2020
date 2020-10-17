chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({links: []}, function() {
    console.log("The link array has been made!")
  })
})
function makeList(links) {
    const list = document.getElementById("link-list")
    links.forEach((val, index) => {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(val))
        list.appendChild(li)
    })
}

function appendList(link) {
    const list = document.getElementById('link-list');
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(link));
    list.appendChild(li);
}

const form = document.getElementById("form");

console.log(form);

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const link = document.getElementById('text').value
    chrome.storage.sync.get('links', function(result) {
        let links = result.links
        links.push(link);
        console.log(links)
        chrome.storage.sync.set({links}, function() {
            appendList(link)
            document.getElementById('text').value = '';
        })
    })
})

chrome.storage.sync.get('links', function(result) {
    makeList(result.links)
})

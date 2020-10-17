const list = document.getElementById("link-list")

let linkData = [];

chrome.storage.sync.get('links', function(result) {
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
    chrome.storage.sync.set({links: linkData}, function() {
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
    s.addEventListener('click', function() { deleteFromList(li, index)});


    li.classList.add('list-item')
    li.appendChild(a);
    li.appendChild(s);
    
    list.appendChild(li);
    
}

const form = document.getElementById("form");

console.log(form);

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const link = document.getElementById('text').value
    if(!link) return;
    linkData.push(link);
    chrome.storage.sync.set({links:linkData}, function() {
        appendList(link, linkData.length-1);
        document.getElementById('text').value = '';
    })
})



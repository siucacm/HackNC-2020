function authenticatedXhr(method, url, callback) {
    var retry = true;
    chrome.identity.getAuthToken({ interactive: false }, function (access_token) {
        if (chrome.runtime.lastError) {
            callback(chrome.runtime.lastError);
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Authorization',
            'Bearer ' + access_token);

        xhr.onload = function () {
            if (this.status === 401 && retry) {
                console.error("IT FAILED")
                return;
            }
            callback(null, this.status, this.responseText);
        }
    });
}
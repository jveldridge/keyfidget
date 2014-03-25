// content script

console.log("intercept script loaded");

RIGHT_ARROW = 39;
LEFT_ARROW = 37;

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == RIGHT_ARROW || key == LEFT_ARROW) {
        console.log("sending message");
        chrome.runtime.sendMessage({sender: window.location}, function(response) {
          console.log(response.farewell);
        });
    }
}

var f = function(message, sender, sendResponse) {
    console.log("message received");
}

chrome.runtime.onMessage.addListener(f);
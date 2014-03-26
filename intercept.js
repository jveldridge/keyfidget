// content script

console.log("intercept script loaded");

RIGHT_ARROW = 39;
LEFT_ARROW = 37;

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == RIGHT_ARROW || key == LEFT_ARROW) {
        console.log("sending message");
        chrome.runtime.sendMessage({sender: window.location,
                                    scroll_x: document.body.scrollLeft,
                                    scroll_y: document.body.scrollTop}, 
            function(response) {
                console.log(response.farewell);
            }
        );
    }
}
var msgReceived = function(message, sender) {
    window.onload = function() {
        window.scroll(message.scroll_x, message.scroll_y);  
    }
}
chrome.runtime.onMessage.addListener(msgReceived);


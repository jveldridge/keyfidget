// background script

var block = false;
var curr = "";
var last = "";
var scroll_x = 0;
var scroll_y = 0;

var beforeRequestHandler = function(details) {
    if (block) {
		console.log("REQUEST SHOULD BE BLOCKED");
		console.log("request url: " + details.url);
		console.log("redirecting to: " + curr);
		block = false;
        last = curr;

		// return {"cancel": true}
		return {"redirectUrl": curr}
	}
}
var opt_extraInfoSpec = ["blocking"];
var filter = {urls: ["<all_urls>"], types: ["main_frame"]};

chrome.webRequest.onBeforeRequest.addListener(beforeRequestHandler, filter, opt_extraInfoSpec);

var msgReceived = function(message, sender) {
	// console.log("message: " + JSON.stringify(message) + "; sender: " + JSON.stringify(sender));
	curr = sender.url;
	scroll_x = message.scroll_x;
    scroll_y = message.scroll_y;
    // console.log("url: " + curr + "; scroll: " + message.scroll_y);
	block = true;
	window.setTimeout(function () {console.log("timer fired"); block = false;}, 1000);
}

chrome.runtime.onMessage.addListener(msgReceived);

function completedCallback(details) {
    if (details.url == last) {
        // console.log("time to send scroll message");
        // tell content script to navigate back one page in history
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log("sending scroll message");
            chrome.tabs.sendMessage(tabs[0].id, {scroll_x: scroll_x, scroll_y: scroll_y}, function(response) {
                //console.log("got response: " + response);
          });
        });
    }
}

chrome.webRequest.onCompleted.addListener(completedCallback, filter);
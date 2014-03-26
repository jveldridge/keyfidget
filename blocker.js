// background script

var block = false;
var curr = "";
var last = "";
var scroll_x = 0;
var scroll_y = 0;

function is_probably_navigation_request(reqUrl) {
	return hasExtension(reqUrl, ".html") || endsWith(reqUrl, ".htm");
}

function hasExtension(url, ext) {
    var stop = url.indexOf('?');
    if (stop == -1) {
        stop = url.length;
    }
    url = url.substring(0, stop);
    return endsWith(url, ext);
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

var callback = function(details) {
	if (block && is_probably_navigation_request(details.url)) {
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
var filter = {urls: ["<all_urls>"]};

chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);

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
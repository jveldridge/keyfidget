// background script

var block = false;
var curr = "";

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
	// console.log("curr is now: " + curr);
	block = true;
	window.setTimeout(function () {console.log("timer fired"); block = false;}, 1000);
}

chrome.runtime.onMessage.addListener(msgReceived);

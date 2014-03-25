// background script

var block = false;
var curr = "";

var callback = function(details) {
	if (block) {//alert("request happened");
		console.log("REQUEST SHOULD BE BLOCKED");
		// console.log(JSON.stringify(details));
		// console.log(window.location.href);
		console.log("referrer: " + curr);
		// return {"cancel": true}
		return {"redirectUrl": curr}
	}
	// else {
	// 	console.log("let request go")
	// }
}
var opt_extraInfoSpec = ["blocking"];
var filter = {urls: ["<all_urls>"]};


chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);

var msgReceived = function(message, sender) {
	console.log("message: " + JSON.stringify(message) + "; sender: " + JSON.stringify(sender));
	curr = sender.url;
	console.log("curr is now: " + curr);
	block = true;
	window.setTimeout(function () {console.log("timer fired"); block = false;}, 1000);
}

chrome.runtime.onMessage.addListener(msgReceived);
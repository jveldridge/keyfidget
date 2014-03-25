// background script

var block = false;

var callback = function(details) {
	if (block) {//alert("request happened");
		console.log("REQUEST SHOULD HAVE BEEN BLOCKED");
		console.log(JSON.stringify(details));
		return {"cancel": true}
	}
	// else {
	// 	console.log("let request go")
	// }
}
var opt_extraInfoSpec = ["blocking"];
var filter = {urls: ["<all_urls>"]};


chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);

var msgReceived = function(message, sender) {
	//t(JSON.stringify(YOUR_OBJECT_HERE, null, 4));
	console.log("mesage received");
	//console.log("message: " + JSON.stringify(message) + "; sender: " + JSON.stringify(sender));
	block = true;
	window.setTimeout(function () {console.log("timer fired"); block = false;}, 1000);
}

chrome.runtime.onMessage.addListener(msgReceived);
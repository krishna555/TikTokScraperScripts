var keyword = {key: "thinspo"};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message === "get-message") {
		console.log("Sent Message", keyword);
		sendResponse(keyword);
	}
});
var port;
function connect() {
	port = chrome.runtime.connect({name: "knockknock"});
	port.onDisconnect.addListener(connect);
	port.onMessage.addListener((msg) => {
		console.log(msg);
		if (msg === "get-message") {
			console.log("Sent Message");
			port.postMessage(keyword);
		}
		return true;
	});
}
connect();

async function createNewTab(url) {
	let queryOptions = {
		active: true,
		url: url
	};
	let tab = await chrome.tabs.create(queryOptions);
	return tab;
}
// var currentUrl = null;
var tabIds = [];
async function fn(url) {
	const tab = await createNewTab(url);
	
  tabIds.push(tab.id);
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function tagPageExample() {
	var keywords = ["ukraine", "russia", "putin", "soviet", "kremlin", "minsk", "ukrainian", "NATO", "luhansk", "donetsk", "kyiv", "kiev", "moscow", "zelensky", "fsb", "KGB", "Україна", "Киев", "ФСБ", "Россия", "КГБ", "Київ", "україни", "Росія", "кгб", "фсб", "SlavaUkraini", "ukrainian", "\U0001F1FA\U0001F1E", "Украина", "украины", "Donbas", "donbas", "Донбасс", "Донбасс", "своихнебросаем"];
	var url_format = "https://"
	var orchestrator = async function() {
		for (var i = 0; i < keywords.length; ++i) {
	    console.log("URL Number : " +  i);
	    keyword["key"] = keywords[i];
	    var url = "https://www.tiktok.com/tag/" + keywords[i] + "?lang=en";
	    var timeLimit = 20000;
	    await fn(url);
	    if (i - 1 >= 0) {
	      await chrome.tabs.remove(tabIds[i - 1]);
	    }
	    await timeout(timeLimit);
		}
	}
	orchestrator();
}

function searchPageExample() {
	var keywords = ["datascience"]
	var url_format = "https://"
	var searchOrchestrator = async function() {
		for (var i = 0; i < keywords.length; ++i) {
	    console.log("URL Number : " +  i);
	    keyword["key"] = keywords[i];
	    var url = "https://www.tiktok.com/search?q=" + keywords[i];
	    var timeLimit = 20000;
	    await fn(url);
	    if (i - 1 >= 0) {
	      await chrome.tabs.remove(tabIds[i - 1]);
	    }
	    await timeout(timeLimit);
		}
	}
	searchOrchestrator();
}

tagPageExample();
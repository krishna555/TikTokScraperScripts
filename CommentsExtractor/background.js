var id = 0

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

var raw_data = Helpers.rawData;
// Example of a simple user data object
const user = {username: 'demo-user'};

var urls = []
for (key in raw_data) {
  urls.push(key);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "get-message") {
      sendResponse(raw_data[currentUrl]);
    }
});

function connect() {
  port = chrome.runtime.connect({name: "knockknock"});
  port.onDisconnect.addListener(connect);
  port.onMessage.addListener((msg) => {
    if (msg === "get-message") {
      port.postMessage(raw_data[currentUrl]);
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

function getTimeForUrl(url) {
  var count = raw_data[url]["count"];
  var bins = [35, 100, 200, 400, 600, 800, 1000, 2000, 3000, 4000, 5000, 10000]
  var time = [10, 10, 10, 10, 10, 10, 10, 20, 20, 20, 30, 30];
  var ans = -1;
  for (var i = 0; i < time.length - 1; ++i) {
    if (count < bins[i]) {
      ans = i;
      break
    } 
  }
  if (ans == -1) {
    ans = time.length - 1;
  }
  console.log(time[ans] * 1000);
  return time[ans] * 1000;
}

var orchestrator = async function() {
	for (var i = 0; i < urls.length; ++i) {
    console.log("URL Number : " +  i);
    currentUrl = urls[i];
    var timeLimit = getTimeForUrl(currentUrl);
		await fn(urls[i]);
    if (i - 1 >= 0) {
      await chrome.tabs.remove(tabIds[i - 1]);
    }
    await timeout(timeLimit);
	}
}
orchestrator();
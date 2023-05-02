window.onload = function() {
	console.log("Running Search Content Script!");
	var res = []
	var keyword = null;
	// var URL_LIMIT = 100;
	chrome.runtime.sendMessage('get-message', (message) => {
		console.log("Received msg", message);
		keyword = message.key
	});


	function deleteTimer(port) {
		if (port._timer) {
			clearTimeout(port._timer);
			delete port._timer;
		}
	}
	function forceConnect(port) {
		deleteTimer(port);
		port.disconnect();
	}
	chrome.runtime.onConnect.addListener((port) => {
		console.log(port);
		if (port.name !== "knockknock") {
			return;
		}
		console.log(port);
		port.postMessage("get-message");
		port.onMessage.addListener((msg) => {
			console.log("Received msg", msg);
			keyword = msg.key
			return true;
		});
		port.onDisconnect.addListener(deleteTimer);
		port._timer = setTimeout(forceReconnect, 250000, port);
	});

	window.scrollBy(0, document.documentElement.scrollHeight);
	console.log("Set Interval");
	setInterval(() => {
		// window.scrollBy(0, -100);
		window.scrollBy(0, document.documentElement.scrollHeight);
		var nodes = document.querySelectorAll("button[data-e2e=\"search-load-more\"]")
		if (nodes.length > 0) {
			nodes[0].click();
		}

		var elements = document.querySelectorAll("div[class*=\"DivWrapper\"] >  a")
		console.log(elements.length);
		for (var i = 0; i < elements.length; ++i) {
			var url = elements[i].href;
			if (!res.includes(url)) {
				res.push(url);
				var obj = {
					u: url,
					k: keyword,
					t: "search"
				};
				console.log("Sent network request");
				(new Image()).src = 'http://localhost:9000/' + JSON.stringify(obj);
			}
		}
	}, 1000);
}
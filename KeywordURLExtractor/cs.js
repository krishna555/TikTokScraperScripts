window.onload = function() {
	var res = []
	var keyword = null;
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

	function addData() {
		if (res.length >= 100) {
			return;
		}
		var elements = document.querySelectorAll("div[class*=\"StyledDivContainerV2\"] > div > div > a");

		for (var i = 0; i < elements.length; ++i) {
			if (i > 99) {
				break;
			}
			var url = elements[i].href;
			if (!res.includes(url)) {
				res.push(url);
				var obj = {
					u: url,
					k: keyword
				};
				console.log("Sent network request");
				(new Image()).src = 'http://localhost:9000/' + JSON.stringify(obj);
			}
		}
		// document.querySelectorAll("div[class*=\"StyledDivContainerV2\"] > div > div > a").forEach((element) => {
		// 	var url = element.href;
		// 	if (!res.includes(url)) {
		// 		res.push(url);
		// 		var obj = {
		// 			u: url,
		// 			k: keyword
		// 		};
		// 		console.log("Sent network request");
		// 		(new Image()).src = 'http://localhost:9000/' + JSON.stringify(obj);
		// 	}
		// });
	}


	const config = {childList: true}
	const callback = (mutationList, observer) => {
		for (const mutation of mutationList) {
			addData();
		}
		window.scrollBy(0, -100);
		window.scrollBy(0, document.body.scrollHeight);
	}
	const target_node = document.querySelectorAll("div[class*=\"DivVideoFeedV2\"]")[0];

	const observer = new MutationObserver(callback);
	observer.observe(target_node, config);
	window.scrollBy(0, document.documentElement.scrollHeight);
	setInterval(() => {
		window.scrollBy(0, -100);
		window.scrollBy(0, document.documentElement.scrollHeight);
	}, 1000);
}
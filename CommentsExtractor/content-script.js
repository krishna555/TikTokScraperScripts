/*
Comments Metadata:
{
	"user_id": "",
	"user_name": "",
	"text": "",
	"comment_like_count": ""
}
*/
   
var res = []

window.onload = function() {
	var max_count = 10000;
	var url_id = window.location.href;
	// 1. Send the background a message requesting the user's data
	chrome.runtime.sendMessage('get-message', (response) => {
	  url_id = response.url_id;
	  max_count = Math.min(response.count, max_count);
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
			url_id = msg.url_id;
			max_count = Math.min(msg.count, max_count);
			return true;
		});
		port.onDisconnect.addListener(deleteTimer);
		port._timer = setTimeout(forceReconnect, 250000, port);
	});

	var prev_cnt = 0;
	// Mutation Observer
	setInterval(() => {
		window.scrollBy(0, document.body.scrollHeight);
	}, 1000);
	const target_node = document.querySelectorAll("div[class*=\"DivCommentListContainer\"]")[0];
	console.log(target_node);
	var userAnchorTags = document.querySelectorAll("div[class*=\"DivContentContainer\"] > a[class*=\"StyledUserLinkName\"]");
	console.log(userAnchorTags.length);

	function addData() {
			document.querySelectorAll("div[class*=\"DivReplyActionContainer\"] > p").forEach((item) => {item.click();});
			var userAnchorTags = document.querySelectorAll("div[class*=\"DivContentContainer\"] > a[class*=\"StyledUserLinkName\"]");
			console.log(userAnchorTags.length);
			if (userAnchorTags.length == prev_cnt) {
				// Pick only newly added comments upon scroll
				console.log("Mutation Did not return any comments");
				window.scrollBy(0, document.body.scrollHeight);
				return;
			}
			
			var commentText = document.querySelectorAll("p[data-e2e] > span");
			var commentLikeCounts = document.querySelectorAll("span[data-e2e=\"comment-like-count\"");
			for (var i = prev_cnt; i < userAnchorTags.length; ++i) {
				var temp = {};

				// Get User Id:
				var id_index = userAnchorTags[i].href.indexOf("@");
				if (id_index == -1) {
					temp.id = "";
				}
				else {
					temp.id = userAnchorTags[i].href.substring(id_index + 1);
				}
				temp.n = userAnchorTags[i].children[0].innerHTML.trim();
				temp.t = commentText[i].innerHTML.trim();
				temp.c = commentLikeCounts[i].innerHTML.trim();
				temp.uid = url_id;
				(new Image()).src = 'http://localhost:9000/' + JSON.stringify(temp);
			}
			prev_cnt = userAnchorTags.length;
	}

	if (userAnchorTags.length > 0) {
		addData();
	}
	
	const config = {childList: true};
	const callback = (mutationList, observer) => {
		for (const mutation of mutationList) {
			addData();
		}
		window.scrollBy(0, document.body.scrollHeight);
	}

	const observer = new MutationObserver(callback);

	observer.observe(target_node, config);
}
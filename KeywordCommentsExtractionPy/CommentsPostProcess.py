import json
from collections import defaultdict
# f = open("valid2.txt", "r")

import sys

if len(sys.argv) != 5:
	print("[Error]: Expected arguments while running python3 CommentsPostProcess.py /path/to/URL_ids.json /path/to/comments.txt /path/to/extracted_comments_output.json /path/to/missing_urls.txt")
	exit(1)

url_ids_file = open(sys.argv[1], "r")
url_ids_obj = json.loads(url_ids_file.read())

comments_file = open(sys.argv[2], "r")

id_to_url_mp = {}
for url in url_ids_obj:
	url_id = url_ids_obj[url]["url_id"]
	id_to_url_mp[url_id] = url

comment_obj = {}
stats_obj = {}
extracted = defaultdict(list)
failed_decode = 0
success = 0
failed_mp = 0
count = 0
prev = 0
invalid_url_ids = set()

missing_data = set()
def getUrl(url):
	def validate(s1, obj):
		for url in obj:
			if url.startswith(s1):
				return (True, url)

		return (False, s1)

	try:
		q_ind = url.index("?")
	except:
		q_ind = len(url)
	status, s = validate(url[:q_ind], url_ids_obj)
	if not status:
		missing_data.add(s)
	return s

all_comments = set()
for comment in comments_file:
	curr = (count // 709262) * 100
	if curr > prev:
		prev = curr
		print(curr)
	count += 1
	obj = {}
	try:
		obj = json.loads(comment.strip())
		rep = str(obj)
		if rep in all_comments:
			continue
		all_comments.add(rep)
		new_obj = {
			"user_id": obj["id"],
			"text": obj["t"],
			"like_count": obj["c"],
			"user_name": obj["n"]
		}
		url_id = obj["uid"]
		if url_id in id_to_url_mp:
			url = id_to_url_mp[url_id]
		else:
			url = getUrl(url_id)

		url = getUrl(url)
		extracted[url].append(new_obj)
		success += 1
	except Exception as ex:
		print(count, ex, obj)
		failed_decode += 1


with open(sys.argv[3], "w") as f2:
	json.dump(extracted, f2)

with open(sys.argv[4], "w") as missing:
	for url in missing_data:
		missing.write("%s\n" % url)
print(failed_mp, failed_decode, success)
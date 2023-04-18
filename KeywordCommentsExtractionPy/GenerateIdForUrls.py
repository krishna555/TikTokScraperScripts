import uuid
import json
import sys

"""
Generate a JSON for each URL for the chrome extension.
"""
if len(sys.argv) != 3:
	print("[ERROR]: Run GenerateIdForUrls.py /path/to/input /path/to/output")
	exit(1)

f = open(sys.argv[1], "r")

comments = json.loads(f.read())
res = {}
for url in comments:
	res[url] = {
		"url_id": str(uuid.uuid4())[:10],
		"count": comments[url]
	}

with open(sys.argv[2], "w") as f2:
	json.dump(res, f2)
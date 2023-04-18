import json
import sys
urls = set()

if len(sys.argv) != 4:
	print("[ERROR]: Expected python3 cleanup.py /path/to/CommentUrls.txt /path/to/comments.json /path/to/output")
	exit(1)

with open(sys.argv[1], "r") as f2:
	lines = f2.readlines()
	for line in lines:
		urls.add(line.strip())
# print(urls)
res = {}
with open(sys.argv[2], "r") as f:
	data = json.loads(f.read())
	for key in data:
		if key in urls:
			res[key] = data[key]

with open(sys.argv[3], "w") as f3:
	json.dump(res, f3)

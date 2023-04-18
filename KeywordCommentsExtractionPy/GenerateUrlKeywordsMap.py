import json
from collections import defaultdict

"""
This Script generates a map with key = URL, value = List of keywords for which the URL was found.
This ensures that the comments extraction chrome extension processes a given URL only once.
"""

if len(sys.argv) != 3:
	print("[ERROR]: Run python3 GenerateUrlKeywordsMap.py /path/to/input_file /path/to/output_file")
	exit(1)

with open(sys.argv[1], 'r') as f:
	data = f.readlines()
	mp = defaultdict(list)
	for line in data:
		line = line.strip()
		try:
			extracted = json.loads(line)
		except:
			print(f"Error in processing {line}")
			continue
		mp[extracted["u"]].append(extracted["k"])

with open(sys.argv[2], "w") as outfile:
	json.dump(mp, outfile)

import json
import bisect
from collections import defaultdict
import numpy as np
import csv
import sys

"""
Extract comments count per URL from the output of the VideoMetadataExtractor component.
"""
class CommentCountPerURLExtractor:
	def __init__(self):
		self.extracted = []

	def getCommentCount(self, json_obj):
		return json_obj["stats"]["commentCount"]

	def run(self, fname):
		csv_file = open(sys.argv[2], "w")
		writer = csv.writer(csv_file)
		writer.writerow(["URL", "Count"])
		with open(fname, "r") as f:
			data = json.loads(f.read())
			res = {}
			total = 0
			for url in data.keys():
				cnt = self.getCommentCount(data[url])
				res[url] = cnt
				self.extracted.append(cnt)
				writer.writerow([url, cnt])

			with open(sys.argv[3], "w") as f2:
				json.dump(res, f2)

if len(sys.argv) != 4:
	print("[ERROR]: Run python3 CommentCountPerURLExtractor.py /path/to/input_file /path/to/output_file_csv /path/to/output_file_json")
	exit(1)

c = CommentCountPerURLExtractor()
c.run(sys.argv[1])
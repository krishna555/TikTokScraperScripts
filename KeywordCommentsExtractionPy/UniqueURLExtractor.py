"""
Class to extract Unique URLs from File with JSON in each line of the structure:
{"u":"https://www.tiktok.com/@mycrazyydogs/video/7071571514222529794","k":"своихнебросаем"}
The key for URLs is "u" so we will extract all the unique URLs in this util class.
"""
import json
import sys

class UniqueURLExtractor:
	def __init__(self, json_input_path, output_file_path):
		self.input = json_input_path
		self.output = output_file_path
		self.URL_KEY = "u"
		self.unique = set()
	def run(self):
		with open(self.input, "r") as input_file:
			for line in input_file:
				line = line.strip()
				try:
					data = json.loads(line)
				except:
					print(f"[ERROR]: Couldn't parse JSON: {line}")
					continue

				url = data[self.URL_KEY]
				self.unique.add(url)

		with open(self.output, "w") as output_file:
			for url in self.unique:
				output_file.write(f"{url}\n")

if len(sys.argv) != 3:
	print("[ERROR]: Run python3 UniqueURLExtractor.py /path/to/input_file /path/to/output_file")
	exit(1)

uniqueURLExtractor = UniqueURLExtractor(json_input_path=sys.argv[1], output_file_path=sys.argv[2])
uniqueURLExtractor.run()



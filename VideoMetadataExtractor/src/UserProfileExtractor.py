import json
import pyktok as pyk
import sys

class UserProfileExtractor:
	def __init__(self, input_file, output_file):
		self.input_file = input_file
		self.output_file = output_file
		self.count = 0

	def run(self):
		with open(self.input_file, "r") as file:
			processed_data = {}
			for line in file:
				uid = line.strip().lower()
				url = "https://www.tiktok.com/@" + uid
				try:
					data = pyk.get_tiktok_json(url)
				except Exception as e:
					print(f"[PykTok]: Failed Parsing Response for url {url}: {e}")
					continue
				if data is None:
					print(f"[PykTok]: Missing PykTok Response for url {url}")
					continue
				res = {}
				# 1. Extract Users
				USER_MODULE = "UserModule"
				USERS = "users"
				if USER_MODULE not in data:
					print(f"[ERROR]: Missing UserModule object for URL: {url}")
					continue
				user_object_json = data[USER_MODULE][USERS]
				
				for user_id in user_object_json:
					user_obj = user_object_json[user_id]
					user_name = user_obj.get("nickname")
					is_verifed = user_obj.get("verified")
					res["user_id"] = user_id
					res["user_name"] = user_name
					res["is_verifed"] = is_verifed
				res["stats"] = data[USER_MODULE]["stats"][res["user_id"]]

				# 2. Extract Text
				res["videos"] = []
				for key in data["ItemModule"]:
					video_obj = {}
					item = data["ItemModule"][key]
					desc = item.get("desc")
					challenges = item.get("challenges")
					challenges_arr = [x.get("title") for x in challenges]

					text_extra_arr = item.get("textExtra")
					tagged = []
					for obj in text_extra_arr:
						if "userUniqueId" in obj and obj["userUniqueId"] != "":
							tagged.append(obj["userUniqueId"])
					text_obj = {
						"desc": desc,
						"challenges": challenges_arr,
						"tagged": tagged
					}

					video_id = item.get("id")

					stats = item["stats"]

					video_obj["text"] = text_obj
					video_obj["id"] = video_id
					video_obj["stats"] = stats
					res["videos"].append(video_obj)

				processed_data[url] = res
				print(f"Completed Crawl for {self.count} URLs")
				self.count += 1 

		with open(self.output_file, "w") as f:
			json.dump(processed_data, f)

if len(sys.argv) != 3:
	print("[ERROR]: Run python3 UserProfileExtractor /path/to/input_file /path/to/output_file")
	exit(1)
t_obj = UserProfileExtractor(sys.argv[1], sys.argv[2])
t_obj.run()
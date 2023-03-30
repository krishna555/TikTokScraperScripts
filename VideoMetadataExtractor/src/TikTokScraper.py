import json
import pyktok as pyk
import sys

class TikTokScraper:
	def __init__(self, input_file, output_file):
		self.input_file = input_file
		self.output_file = output_file
		self.count = 0

	def run(self):
		with open(self.input_file, "r") as file:
			processed_data = {}
			for line in file:
				url = line.strip().lower()
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
				user_data = []
				for user_id in user_object_json:
					user_obj = user_object_json[user_id]
					user_name = user_obj.get("nickname")
					is_verifed = user_obj.get("verified")
					user_data.append({
						"user_id": user_id,
						"user_name": user_name,
						"is_verifed": is_verifed
						})

				res["users"] = user_data
				# 2. Extract Text
				for key in data["ItemModule"]:
					item = data["ItemModule"][key]
					desc = item.get("desc")
					create_time = item.get("createTime")
					challenges = item.get("challenges")
					challenges_arr = [x.get("title") for x in challenges]

					text_extra_arr = item.get("textExtra")
					tagged = []
					for obj in text_extra_arr:
						if "userUniqueId" in obj:
							tagged.append(obj["userUniqueId"])
					text_obj = {
						"desc": desc,
						"challenges": challenges_arr,
						"tagged": tagged
					}

					music_obj = item.get("music")
					music_data_extracted = {}
					music_data_extracted = {
						"title": music_obj.get("title"),
						"author_name": music_obj.get("authorName")
					}

					video_obj = item.get("video")

					video_data = {
						"id": item.get("id"),
						"ratio": video_obj.get("ratio"),
						"height": video_obj.get("height"),
						"width": video_obj.get("width"),
						"createTime": create_time,
						"duration": video_obj.get("duration"),
						"bitrate": video_obj.get("bitrate"),
						"encodedType": video_obj.get("encodedType"),
						"format": video_obj.get("format"),
						"videoQuality": video_obj.get("videoQuality"),
						"codecType": video_obj.get("codecType"),
						"definition": video_obj.get("definition")
					}

					stats = item["stats"]

					res["text"] = text_obj
					res["music"] = music_data_extracted
					res["video"] = video_data
					res["stats"] = stats

				processed_data[url] = res
				print(f"Completed Crawl for {self.count} URLs")
				self.count += 1 

		with open(self.output_file, "w") as f:
			json.dump(processed_data, f)

if len(sys.argv) != 3:
	print("[ERROR]: Run python3 TikTokScraper /path/to/input_file /path/to/output_file")
	exit(1)
t_obj = TikTokScraper(sys.argv[1], sys.argv[2])
t_obj.run()
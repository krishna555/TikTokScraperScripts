# TikTok Video Metadata


The VideoMetadataExtractor extracts video metadata from TikTok Video URLs in the following format:

```json
{
	"users": [{
		"id": "User ID String (Unique per User)",
		"user_name": "User Name String",
		"isVerified": "Is User Verified (\"true\" or \"false\")",
	}],
	"text": {
		"description": "TikTok Video Description",
		"challenges": "(String List) List of HashTags used in the TikTok Video Description",
		"taggedUsers": "(String List) List of Users tagged in the Video Description"
	},
	"music": {
		"title": "String representing title of the song",
		"authorName": "String representing author of the song",
	},
	"video": {
		"id": "String representing the ID of the video Can be used to generate video URL offline",
		"createTime": "(String) Timestamp since Epoch of when the video was created by author",
		"ratio": "(String) Video Ratio",
		"height": "(Integer) Video Height",
		"width": "(Integer) Video Width",
		"duration": "(Integer) Video Duration",
		"bitrate": "(Integer) Video Bitrate",
		"encodedType": "(String) Video Encoded Type",
		"format": "(String) Video Format",
		"videoQuality": "(String) Video Quality",
		"codecType": "(String) Video CodecType",
		"definition": "(String) Video Definition"
	},
	"stats": {
		"diggCount": "(Integer) Number of likes the video has received",
		"shareCount": "(Integer) Number of times video has been shared",
		"commentCount": "(Integer) Number of comments on the video",
		"playCount": "(Integer) Number of times the video was played"
	},
	"comments": [{
		"userId": "String - user id of the TikTok Commenter",
		"user_name": "String - user name of the TikTok Commenter",
		"text": "String - Comment Text",
		"likeCount": "String - Number of likes the comment received"
	}]
}
```

Here is a sample JSON:

```json
{
  "users": [
    {
      "user_id": "onlyjayus",
      "user_name": "actuallyitsbella",
      "is_verifed": true
    }
  ],
  "text": {
    "desc": "ATTENTION FELLOW GEN Z #fyp #genz #genztattoo #tattoo #attention #psa #onlyjayus #LearnOnTikTok #tiktokpartner",
    "challenges": [
      "tiktokpartner",
      "psa",
      "fyp",
      "genztattoo",
      "onlyjayus",
      "tattoo",
      "attention",
      "LearnOnTikTok",
      "genz"
    ],
    "tagged": []
  },
  "music": {
    "title": "Lobby Music (Original Soundtrack)",
    "author_name": "Kahoot!"
  },
  "video": {
    "id": "6874655749885168901",
    "ratio": "720p",
    "height": 1024,
    "width": 576,
    "createTime": "1600630543",
    "duration": 58,
    "bitrate": 1099855,
    "encodedType": "normal",
    "format": "mp4",
    "videoQuality": "normal",
    "codecType": "h264",
    "definition": "720p"
  },
  "stats": {
    "diggCount": 752000,
    "shareCount": 14300,
    "commentCount": 7129,
    "playCount": 2900000
  }
}
```


# Comments Extractor


The locally logged comments will have the following syntax:

```json
{
	"id": "TikTok User Id",
	"n": "TikTok User Display Name",
	"c": "TikTok Comment Like Count",
	"uid": "URL ID"
}
```
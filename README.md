# Overview
TikTok Scraper Scripts encapsulates scripts to crawl TikTok Video Metadata and Comments.
1. VideoMetadataExtractor leverages PykTok library to extract TikTok Video metadata.
2. CommentsExtractor is a chrome extension to extract comments from a TikTok Video.
3. Logger - HTTP Request Logger to log pixels from chrome extension.

# VideoMetadataExtractor

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

To Run The VideoMetadataExtractor, run the following command on the terminal
```python3 TikTokScraper /path/to/input_file /path/to/output_file```


# CommentsExtractor

A chrome extension to extract comments from a TikTok Video.
The chrome extension will send network requests to log the comments to a HTTP Request Logger running locally.

The locally logged comments will have the following syntax:

```
{
	"id": "TikTok User Id",
	"n": "TikTok User Display Name",
	"c": "TikTok Comment Like Count",
	"uid": "URL ID"
}
```

1. Replace raw_data with the JSON object of URLs that you would like to scrape. The JSON Object is a list of objects for each URL you would like to scrape.
```json
[{
	"URL": {
		"url_id": "Random id",
		"count": "Count of number of comments"
	}
}]
```
url_id can be any string to uniquely identify the URL - This will be used to report the URL associated with the comment. We may then use a post-analysis script to group together comments belonging to the same URL_ID. You may also build a mapping from URL to URL_ID.
You may use the VideoMetadataExtractor to retrieve number of comments per URL and then use that output to create the above input object.

Furthermore, `getTimeForURL` function in background.js provides a time allocation strategy i.e.., number of seconds per URL for which it is scraped. You may choose to change this function implementation to your convenience.

Make sure to run the logger running locally prior to activating the extension.

Load the directory of the chrome extension as an unpacked extension to your chrome to try out the extension. **Do not** publish it to marketplace.

# Logger

This is a HTTP Request Logger to log pixels sent by the chrome extension to local file system.
The output will be stored in extracted_data directory as a data_{id}.txt file where id = 0, 1, 2, 3, etc. such that each file will be approximately 2MB in size.

The implementation clears a set every 10^5 local log records, so there should be very few duplicates if any.

Run the logger using `node server.js`

The logger is now running on port 9000.
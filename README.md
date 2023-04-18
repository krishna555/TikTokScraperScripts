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

The implementation clears a set every 10<sup>5</sup> local log records, so there should be very few duplicates if any.

Run the logger using `node server.js`

The logger is now running on port 9000.

# Keyword related URLs Extraction

This component is a chrome extension to extract TikTok Video Links from the TikTok Tag page (Ex: https://www.tiktok.com/tag/datascience?lang=en) given a list of keywords.

The chrome extension sends network requests from the page for each URL. These network requests can be logged to a local file by using the Logger Component.

`{"u": "<Tiktok Video URL>", "k": "<Keyword>"}`


To use the chrome extension, update `line 42` where the variable keywords is defined as `var keywords = ` with the list of keywords for which URLs are to be extracted.

Currently, the chrome extension is configured to extract the top 100 recommended URLs. To modify this limit update the line `var URL_LIMIT = 100` to a threshold satisfying your requirements.

## How to Run Keyword-related URLs Extension?


1. Chrome Extension generates a log file where every line is a JSON of the form:
`{"u": "<TikTok Video URL>", "k": "<Keyword>"}`
2. Run `python3 UniqueURLExtractor.py <CHROME_EXTENSION_OUTPUT_PATH> <OUTPUT_PATH>` 
   1. `<CHROME_EXTENSION_OUTPUT_PATH>` is the path to the output file generated by the locally running NodeJS Logger. (Note: If the Logger generated multiple "data_" files, make sure to concatenate them to a single file by command `cat data_*.txt > urls.txt`).
   2. `<OUTPUT_PATH>` is the path to the output file generated by UniqueURLExtractor python script.
3. Run `python3 GenerateUrlKeywordsMap.py <CHROME_EXTENSION_OUTPUT_PATH> <OUTPUT_PATH>`
   1. `<CHROME_EXTENSION_OUTPUT_PATH>` is the path to the output file generated by the locally running NodeJS Logger. (Note: If the Logger generated multiple "data_" files, make sure to concatenate them to a single file by command `cat data_*.txt > urls.txt`).
   2. `<OUTPUT_PATH>` is the path to the output file generated by UniqueURLExtractor python script.
4. Run the VideoMetadataExtractor component with command `python3 TikTokScraper.py <STEP2_RESULT> <OUTPUT_PATH>` where,
	1. `<STEP2_RESULT>` is the output file generated by step 2
	2. `<OUTPUT_PATH>` is the output file where the extracted video metadata will be stored. (We are extracting the video metadata to get an idea of how many comments are present for each URL, this will help us in allocating the right amount of time for scraping of each URL. For example, a video URL with only 10 comments will need far lesser time than a video URL with 1000 comments.)
5. Run `python3 CommentCountPerURLExtractor.py <STEP_4_RESULT> <CSV_OUTPUT_PATH> <JSON_OUTPUT_PATH>`
	1. `<STEP_4_RESULT>` is the output generated by Step 4
	2. `<CSV_OUTPUT_PATH>` is the output generated by CommentCountPerURLExtractor in CSV Format. Can be used in Excel to build pivot tables to visualize comment count distributions.
	3. `<JSON_OUTPUT_PATH>` is the output generated by CommentCountPerURLExtractor in JSON Format.
6. Run `python3 GenerateIdForUrls.py <STEP_5_JSON_RESULT> <OUTPUT_PATH>`
	1. `<STEP_5_JSON_RESULT>` is the JSON output generated by Step 5 CommentCountPerURLExtractor
	2. `<OUTPUT_PATH>` is the output generated by GenerateIdForUrls python script.
7. Place the output JSON from Step 6 in `background.js` of the CommentsExtractor Chrome Extension by replacing `var raw_data` with this JSON.
8. Activate the Logger locally to record the network requests that will be sent by the chrome extension. (Make sure to delete the local data_* files before enabling the chrome extension). Enable the chrome extension on `chrome://extensions` and the scraping should begin.
9. Navigate to the directory within the Logger where the records are logged. Concatenate the comments files into a single file with command `cat data_*.txt > comments.txt`.
10. Run `python3 CommentsPostProcess.py <STEP_6_RESULT> <STEP_9_RESULT> <COMMENTS_JSON_OUTPUT> <MISSING_URLS_OUTPUT>`
	1. `<STEP_6_RESULT>` is the JSON Output file created by Step 6 containing the URL to Id Map.
	2. `<STEP_9_RESULT>` is the comments file created by concatenating the data_* files.
	3. `<COMMENTS_JSON_OUTPUT>` is the output file containing a JSON where key is the URL and value is the list of comments associated with the URL.
	4. `<MISSING_URLS_OUTPUT>` - Missing URLs are URLs that were not present in the original list of URLs but were encountered during the crawling process. This could have occurred due to redirects from one of the original URLs in the list. `<MISSING_URLS_OUTPUT>` is an output text file where the missing URLs output will be stored.
11. If you would like to remove the Missing URLs from the COMMENTS_JSON_OUTPUT file generated by step 10, run `python3 cleanup.py <STEP2_RESULT> <COMMENTS_JSON_RESULT> <PATH_TO_OUTPUT>`
	1. `<STEP2_RESULT>` is the output from step 2 containing a unique list of URLs.
	2. `<COMMENTS_JSON_RESULT>` is the JSON containing the extracted comments from step 10
	3. `<PATH_TO_OUTPUT>` is the output generated by this program which will remove the missing URLs from the comments data in `<COMMENTS_JSON_RESULT>`.

The output from step 11 will contain the extracted comments in JSON format where key is the URL and value is the list of comments scraped for that URL by the chrome extension.

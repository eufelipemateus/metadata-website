const express = require('express');
const app = express();
const request = require('request');
const { URL } = require('url');
const  cheerio = require('cheerio');
const sync_request = require('sync-request');

const port = process.env.PORT || 8080;

app.get('/Fetch', function(req, res) {

		res.writeHead(200, {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'});
				
		
		
		  //make a new request to the URL provided in the HTTP POST request
		request(req.query.url, function (error, response, responseHtml) {
			var resObj = {};

			//if there was an error
			if (error) {
				res.end(JSON.stringify({error: 'There was an error of some kind'}));
				return;
			}

			//create the cheerio object
			resObj = {},
				//set a reference to the document that came back
				$ = cheerio.load(responseHtml),
				//create a reference to the meta elements
				$title = $('head title').text(),
				$desc = $('meta[name="description"]').attr('content'),
				$kwd = $('meta[name="keywords"]').attr('content'),
				$ogTitle = $('meta[property="og:title"]').attr('content'),
				$ogImage = $('meta[property="og:image"]').attr('content'),
				$ogkeywords = $('meta[property="og:keywords"]').attr('content'),
				$images = $('img');
				
			resObj.url = req.query.url;

			if ($title) {
				resObj.title = $title;
			}

			if ($desc) {
				resObj.description = $desc;
			}

			if ($kwd) {
				resObj.keywords = $kwd;
			}

			if ($ogImage && $ogImage.length){
				let matches = $ogImage.match(/\bhttps?:\/\/\S+/gi);
				
				if(matches!=null && matches[0]!=null){
					resObj.image = sync_request('GET', $ogImage).getBody().toString('base64');
				}else{
					let url = new URL(req.query.url);
					url.pathname = $ogImage;
					resObj.image = sync_request('GET', url.toString()).getBody().toString('base64');
				}
			}

			/*if ($ogTitle && $ogTitle.length){
				resObj.ogTitle = $ogTitle;
			}

			if ($ogkeywords && $ogkeywords.length){
				resObj.ogkeywords = $ogkeywords;
			}

			if ($images && $images.length){
				resObj.images = [];

				for (var i = 0; i < $images.length; i++) {
					let url = new URL(req.query.url);
					url.pathname = $($images[i]).attr('src');
					resObj.images.push(url);
				}
			}*/

			//send the response
			res.end(JSON.stringify(resObj));
    }) ;
			
			
		
});


app.listen(port, function() {
    console.log('The app is running on http://localhost:' + port);
});
const express = require('express');
const app = express();
const request = require('sync-request');

var metafetch = require('metafetch');

const port = process.env.PORT || 8080;

app.get('/Fetch', function(req, res) {

		res.writeHead(200, {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'});
		metafetch.fetch(req.query.url, (err, meta)=> {
			
			if(err){
				console.log(err);
				return ;
			}
			
			
			
			console.log('title: ', meta.title);
			console.log('description: ', meta.description);
			console.log('type: ', meta.type);
			console.log('url: ', meta.url);
			console.log('ampURL: ', meta.ampURL);
			console.log('siteName: ', meta.siteName);
			console.log('charset: ', meta.charset);
			console.log('image: ', meta.image);
			console.log('meta: ', meta.meta);
			console.log('images: ', meta.images);
			console.log('links: ', meta.links);
			console.log('headers: ', meta.headers);
			
			res.status(200).send(JSON.stringify(meta));
				
			
			
			let result = {};
			
			result.title = meta.title;
			result.description = meta.description;
			result.url = meta.url;
			result.siteName = meta.siteName;

						
			
			result.image = {};
			result.image.url = meta.image;
			result.image.data =request('GET', meta.image).getBody().toString('base64');
					
			
			res.write(JSON.stringify(result));
			res.end();
		});
});


app.listen(port, function() {
    console.log('The app is running on http://localhost:' + port);
});
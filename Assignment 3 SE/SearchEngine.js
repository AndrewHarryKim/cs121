/*
SearchEngine.js

Adil Rafaa
Andrew Fischer
Andrew Kim
*/

var port=8080;
var indexFile=process.argv[2];


var http=require('http');
var fs=require('fs');


// Read in list of terms and docs
console.log('Reading index file');
var index=JSON.parse(fs.readFileSync(indexFile));


// Build map from term to index number
console.log('Building term index');
var termMap={ };
for(var i=0;i<index.terms.length;++i){
	termMap[index.terms[i].t]=i;
}


// Search the index
function search(query){
	var terms=query.toLowerCase().replace(/[^0-9a-z ]/,' '); // Remove non-alphanumeric chars
	terms=terms.replace(/[ ]+/,' '); // Collapse whitespace
	terms=terms.split(' '); // Split into multiple terms
	var docs=[];
	var docIds={ };
	for(var i=0,j,len;i<terms.length;++i){
		if(!terms[i]){continue;} // Empty term? Nope!
		if(!termMap.hasOwnProperty(terms[i])){continue;} // Avoid terms we don't know about
		len=index.terms[termMap[terms[i]]].d.length;
		if(len>10){len=10;}
		for(j=0;j<len;++j){ // Assume the index is already in sorted order from best to worst ranking
			if(docIds.hasOwnProperty(index.terms[termMap[terms[i]]].d[j]))
			{
			continue;
			} // Don't add document if we have already added it from another term
			docs.push(index.terms[termMap[terms[i]]].d[j]);
		}
	}
	docs.sort(function(a,b){
		return b.tfidf-a.tfidf;
	});
	for(var i=0;i<docs.length;++i){
		docs[i].url=index.docs[docs[i].id].url;
	}
	return docs.slice(0,10);
}
//~ console.log(search(process.argv[3]));


// Set up a web server
console.log('Starting web server');
http.createServer(function(req,res){
	console.log(res.connection.remoteAddress+' :: '+req.url);
	
	if(req.url==='/search.json'){ // Handle search requests
		if(req.method!=='POST'){
			res.writeHead(400,{'content-type':'text/plain'});
			res.end('{"err":true,"msg:"Please use POST with plaintext search term(s)"}');
			return;
		}
		var body='';
		req.on('data',function(data){
			body+=data;
		}).on('end',function(){
			res.writeHead(200,{'content-type':'application/json'});
			res.end(JSON.stringify(search(body)));
		});
	}else{ // Serve the main HTML by default
		res.writeHead(200,{'content-type':'text/html'});
		res.end(fs.readFileSync('SearchEngine.html'));
	}
}).listen(port,'127.0.0.1',function(){
	console.log('Ready for requests!');
}); // Bind to IPv4

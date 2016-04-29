/*
Indexer.js

Adil Rafaa
Andrew Fischer
Andrew Kim
*/

var fs=require('fs');

var docFolder="Html"; // Html
var jsonFile="html_files.json"; // html_files.json
var indexFile="index.json"; // index.json


// Initial checking
if(process.argv.length<5)
{
	console.log('Values initalized to... Html, html_files.json, and, index.json');
	/*docFolder=process.argv[2]; // Html
	jsonFile=process.argv[3]; // html_files.json
	indexFile=process.argv[4]; // index.json*/
}
else
{
	docFolder=process.argv[2]; // Html
	jsonFile=process.argv[3]; // html_files.json
	indexFile=process.argv[4]; // index.json
}

var startTime=new Date();
var docs=JSON.parse(fs.readFileSync(jsonFile));
var terms=[],termIds={ },termId,numTerms=0;
var docId,numDocs=0;
var contents;
var outgoingLinks;
var hrefs;
var i=1;
var j=0;

for(docId=0;docs.hasOwnProperty(docId);++docId)
{
	// Read doc contents
	contents=fs.readFileSync(docFolder+'/'+docs[docId].file).toString();
	
	//Find the outgoing and ingoing. 

	//Print the Current Website Url
	//console.log(docs[docId].url);
	hrefs=contents.split(/href=(?:"|')/);
	for (;i<hrefs.length;++i)
	{
		hrefs[i]=hrefs[i].split(/(?:"|')/)[0];
	}
	
	console.log(hrefs);


	// Clean / tokenize data
	contents=contents.replace(/[\r\n]/g,' '); // Remove newlines
	contents=contents.replace(/<[^>]+>/g,' '); // XML tags
	contents=contents.toLowerCase();
	contents=contents.replace(/'/g,''); // Collapse contractions (can't --> cant)
	contents=contents.replace(/[^a-z0-9]+/g,' '); // Remove non-alphanumeric characters
	contents=contents.replace(/[ 	]+/g,' '); // Collapse whitespace
	contents=contents.trim(); // Remove all whitespace on ends
	
	// Add data to index
	docs[docId].terms=[];
	docs[docId].tf={ };
	contents=contents.split(' ');
	for(var i=0,tmp={ };i<contents.length;++i)
	{
		if(termIds.hasOwnProperty(contents[i]))
		{ // Already seen term
			termId=termIds[contents[i]];
			if(!tmp.hasOwnProperty(docId))
			{
				tmp[docId]=true;
				terms[termId].d.push({id:docId});
			}
		}
		else
		{ // Haven't seen term
			termId=terms.length;
			terms.push({t:contents[i],d:[{id:docId}]});
			termIds[contents[i]]=termId;
		}

		docs[docId].terms.push(termId);
		if(docs[docId].tf.hasOwnProperty(termId))
		{
			++docs[docId].tf[termId];
		}
		else
		{
			docs[docId].tf[termId]=1;
		}
	}
}
numDocs=docId;

// Compute td-idf
var idf,tf;
for(termId=0;termId<terms.length;++termId){
	// idf
	idf=Math.log(numDocs/terms[termId].d.length);
	if(idf<0)console.log(terms[termId].d.length);
	
	// tf
	for(var i=0;i<terms[termId].d.length;++i)
	{
		//Doc Number's TFIDF
		tf=docs[terms[termId].d[i].id].tf[termId];
		terms[termId].d[i].tfidf=tf*idf;
	}
}
numTerms=termId;

var index=JSON.stringify({terms:terms,docs:docs,termIds:termIds})
var totalTime=(new Date())-startTime;

// Print stats
console.log('1. Number of documents: '+numDocs);
console.log('2. Number of unique words: '+numTerms);
console.log('3. Index: '+indexFile);
console.log('4. Size of index: '+(index.length/1024).toFixed(1)+' KB');
console.log('5. Time spent to create index: '+(totalTime/1000).toFixed(1)+' seconds');


// Write index to file
fs.writeFileSync(indexFile,index);

/*
Indexer.js

Adil Rafaa
Andrew Fischer
Andrew Kim
*/

var fs=require('fs');

var docFolder='Html';
var jsonFile='html_files.json';
var indexFile='index.json';
var url=require('url');

// Initial checking
if(process.argv.length<5)
{
	console.log('I need doc folder, json file, index folder');
	console.log('Using defaults...');
}
else
{
	docFolder=process.argv[2]; // Html
	jsonFile=process.argv[3]; // html_files.json
	indexFile=process.argv[4]; // index.json
}

var startTime=new Date();
var docs=JSON.parse(fs.readFileSync(jsonFile));
var tRank=[],tRankIds={ },tRankId,numTRank=0;
var terms=[],termIds={ },termId,numTerms=0;
var docId,numDocs=0;
var contents;
var hrefs,i;
var currentURL;
//A map to keep track of ingoing and outgoing
var mURLS={ }; 
var urlToId={ };
for(docId=0;docs.hasOwnProperty(docId);++docId)
{
	urlToId[docs[docId].url]=docId;
	mURLS[docId]={ingoing:[],outgoing:[],rank:1};
	
}



for(docId=0;docs.hasOwnProperty(docId);++docId)
{
	// Read doc
	contents=fs.readFileSync(docFolder+'/'+docs[docId].file).toString();
	//url.resolve('http://example.com/', '/one')  

	currentURL=docs[docId].url;

	//Get all of the links or hrefs
	hrefs=contents.split(/href=(?:"|')/i).slice(1);
	for(i=hrefs.length-1;i>=0;--i)
	{
		hrefs[i]=hrefs[i].split(/(?:"|')/);
		if(hrefs[i].length<2)
		{ // If we didn't find a last quote
			hrefs=hrefs.slice(0,i).concat(hrefs.slice(i+1));
			continue;
		}
		hrefs[i]=hrefs[i][0];
		if(!hrefs[i]||hrefs[i].slice(0,1)==='#' || hrefs[i].slice(0,7)==='mailto:')
		{ // Reject some URLs
			hrefs=hrefs.slice(0,i).concat(hrefs.slice(i+1));
			continue;
		}
		//console.log("RESOLVING\n" + currentURL + " ==="+hrefs[i]);
		hrefs[i]=url.resolve(currentURL, hrefs[i]);
		
	}
	//console.log(hrefs);
	
	
	mURLS[docId].outgoing=hrefs;

	for(i=hrefs.length-1;i>=0;--i)
	{
		//[docs[docId].url]
		if(urlToId.hasOwnProperty(hrefs[i]))
		{
			mURLS[urlToId[hrefs[i]]].ingoing.push(currentURL);
		}
		
	}

	//console.log("Passed-----");
	
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
//console.log("Passed LOOP-----");

numDocs=docId;

// Compute td-idf
var idf,tf;




for(termId=0;termId<terms.length;++termId)
{
	// idf
	idf=Math.log(numDocs/terms[termId].d.length);
	if(idf<0)
		console.log(terms[termId].d.length);
	
	// tf
	for(var i=0;i<terms[termId].d.length;++i)
	{
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

/*
PR(A) = (1-d) + d (PR(T1)/C(T1) + ... + PR(Tn)/C(Tn))
where
	PR(A) is the PageRank of page A,
	PR(Ti) is the PageRank of pages Ti which link to page A,
	C(Ti) is the number of outbound links on page Ti and
	d is a damping factor which can be set between 0 and 1.
*/
var d= 0.85; //This is a good dampening from research
var totalCoeff=0; //This is the ...PR(T1)/C(T1) + ... + PR(Tn)/C(Tn) 
var tIngoing;

//Now do terms
/*
'32937': 
   { ingoing: 
      [ 'http://www.ics.uci.edu/~eppstein/pix/candystore/index.html',
        'http://www.ics.uci.edu/~eppstein/pix/candystore/Rae.html',
        'http://www.ics.uci.edu/~eppstein/pix/candystore/Lunchtime.html' ],
     outgoing: 
      [ 'http://www.ics.uci.edu/~eppstein/pix/candystore/Lunchtime.html',
        'http://www.ics.uci.edu/~eppstein/pix/candystore/index.html',
        'http://www.ics.uci.edu/~eppstein/pix/candystore/Rae.html' ],
     rank: 1 },

*/
var totalTime=(new Date());

console.log("Starting Page Rankings Iteration: 1...");
for(docId=0;docs.hasOwnProperty(docId);++docId)
{
	//mURLS[urlToId[hrefs[i]]].ingoing
	totalCoeff=0;

	tIngoing=mURLS[docId].ingoing;
	for(var A=0; A<tIngoing.length;++A)
	{

		totalCoeff+=mURLS[urlToId[tIngoing[A]]].rank/mURLS[urlToId[tIngoing[A]]].outgoing.length;
		//tIngoing[]
	}
	mURLS[docId].rank=(1-d)+d*totalCoeff;
	//console.log(docs[docId].url);
}
var totalTime=(new Date())-totalTime;

console.log('Current Time Inbetween: '+(totalTime/1000).toFixed(1)+' seconds');
var totalTime=(new Date());
console.log("Starting Page Rankings Iteration: 2...");
for(docId=0;docs.hasOwnProperty(docId);++docId)
{
	//mURLS[urlToId[hrefs[i]]].ingoing
	totalCoeff=0;

	tIngoing=mURLS[docId].ingoing;
	for(var A=0; A<tIngoing.length;++A)
	{

		totalCoeff+=mURLS[urlToId[tIngoing[A]]].rank/mURLS[urlToId[tIngoing[A]]].outgoing.length;
		//tIngoing[]
	}
	mURLS[docId].rank=(1-d)+d*totalCoeff;
	//console.log(docs[docId].url);
}
console.log('Current Time Inbetween: '+(totalTime/1000).toFixed(1)+' seconds');
var totalTime=(new Date());



var the_ranks=JSON.stringify(mURLS);

fs.writeFileSync('out.json',the_ranks);
var totalTime=(new Date())-startTime;

console.log('Finished. Total Run Time:' +(totalTime/1000).toFixed(1)+' seconds');

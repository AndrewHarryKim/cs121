/*
Iterative Page Rank

Adil Rafaa
Andrew Fischer
Andrew Kim
*/

var Map = require("collections/map");
var fs=require('fs');



var startTime=new Date();
var tRank=[],tRankIds={ },tRankId,numTRank=0;
var terms=[],termIds={ },termId,numTerms=0;
var docId,numDocs=0;
var contents;
var hrefs,i;
var currentURL;

//A map to keep track of ingoing and outgoing
var mURLS={ }; 
var urlToId={ };


numDocs=docId;

numTerms=termId;

var d= 0.85; //This is a good dampening from research
var totalCoeff=0; //This is the ...PR(T1)/C(T1) + ... + PR(Tn)/C(Tn) 
var tIngoing;

var totalTime=(new Date());
//Iter is the starting iteration of the script
// If iter was 1, you would need an out-1.json
var iter=100;
var endIt=1000;
//If endIt is 1000 it will run up to that iteration and output 'out-1000.json'


var new_body;
var mURLS ;
for(;iter<endIt;++iter)
{
	new_body=JSON.parse(fs.readFileSync('out-'+ iter+'.json'));
	mURLS = new Map(new_body);
	


	console.log("Starting Page Rankings Iteration: "+ iter +"...");
	for(docId=0;mURLS.hasOwnProperty(docId);++docId)
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
	var the_ranks=JSON.stringify(mURLS);



	var incre=iter+1;

	fs.writeFileSync('out-'+ incre+'.json',the_ranks);
	fs.unlink('out-'+ iter+'.json',the_ranks);
	
}

var totalTime=(new Date())-startTime;

console.log('Finished. Total Run Time:' +(totalTime/1000).toFixed(1)+' seconds');

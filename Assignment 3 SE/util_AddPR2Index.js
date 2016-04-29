/*
util_AddPR2Index.js

Adil Rafaa
Andrew Fischer
Andrew Kim
*/

var indexFile=process.argv[2];
var prFile=process.argv[3];
var outFile=process.argv[4];


var fs=require('fs');


// Read in list of terms and docs
console.log('Reading index file');
var index=JSON.parse(fs.readFileSync(indexFile));

// Read in list of terms and docs
console.log('Reading PageRank file');
var pageRank=JSON.parse(fs.readFileSync(prFile));

// Add PageRank to index
console.log('Adding PageRank to index');
for(var docId=0;index.docs.hasOwnProperty(docId);++docId){
	index.docs[docId].rank=pageRank[docId][1].rank; // weird format {num:[num,{...,rank:rank}]}
}

// Sort relevance by PageRank
console.log('Sort relevance by PageRank');
for(termId=0;termId<index.terms.length;++termId){
	index.terms[termId].d.sort(function(a,b){return b.rank-a.rank;});
}


// Write index to file
console.log('Writing output file');
fs.writeFileSync(outFile,JSON.stringify(index));

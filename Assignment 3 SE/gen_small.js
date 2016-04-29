var fs=require('fs');
var data=JSON.parse(fs.readFileSync('html_files.json'));
var docs={ };
for(var i=0;i<100;++i)
{
	docs[i]=data[i];
}
fs.writeFileSync('html_files_small.json',JSON.stringify(docs));

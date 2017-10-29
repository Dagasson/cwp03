const net = require('net');
const fs = require('fs');
const port = 8124;
const path=require('path');

const client = new net.Socket();
let ind = 0;
let adr=[];
let separator = "\t\v\t\r";

const dec = "DEC";
const ack = "ACK";
const fl = "FILES";
const unknown = "UNKNOWN";
const dir = "Direct";
const client_name = "Client";
const server_name = "Server";

client.setEncoding('utf8');

client.connect(port, function() {
            client.write(fl);
            console.log('Connected to the server');
     get_adress(adr);   
});
client.on('data', function (data){
	if(data===ack) 
	{
		console.log("connection established");
		send_file(adr);
	}
});

function get_adress(adr, err){
	if (err) console.log("Bad adress.")
	for(var i=2; i<process.argv.length; i++){
		adr[i-2]= process.argv[i];
	}	
	for (let i=0; i<adr.length;i++) console.log(adr[i]);
}

function send_file(adr, err){
	if(err) console.log("Sending is not success.");
	else{
	for(let ind=0; ind<adr.length; ind++)
	{
		console.log("Start sending.");
		fs.readdirSync(adr[ind], function(err, files) {
		if(err) console.log("Error reading directory.");
		else
		{
			console.log("Working with directory:"+adr[ind]);
			for(let i in files)
				{
					let iffiles=pat+'\\'+files[i];
					if(fs.statSync(iffiles).isDirectory()) send_file(iffiles);
					else
					{
						client.write(files[i]);
						console.log("Sending files.");
                    }
				}
			}
	});
    }}
}
	
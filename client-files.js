const net = require('net');
const fs = require('fs');
const port = 8124;

const client = new net.Socket();
let questions = [];
let ind = 0;
let adr=[];

const dec = "DEC";
const ack = "ACK";
const qa = "FILE";
const unknown = "UNKNOWN";
const dir = "Direct";
const client_name = "Client";
const server_name = "Server";

client.setEncoding('utf8');

client.connect(port, function() {
            client.write(qa);
            console.log('Connected to the server');
     get_adress(adr);   
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
	for(let ind=0; ind<adr.length; ind++)
	{
		fs.readdir(adr[ind], function(err, files) {
		if(err) console.log("Ошибка при чтении директория.");
		else
		{
			for(let i in files)
				{
					let files_or_directories=pat+'\\'+files[i];
					if(fs.statSync(files_or_directories).isDirectory()) continue;
					else
					{
						client.write(files[i]);
                    }
				}
			}
	});
    }
}
	
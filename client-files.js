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
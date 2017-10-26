const net = require('net');
const fs = require('fs');
const port = 8124;

const client = new net.Socket();
let questions = [];
let ind = 0;

const dec = "DEC";
const ack = "ACK";
const qa = "QA";
const unknown = "UNKNOWN";
const dir = "Direct";
const client_name = "Client";
const server_name = "Server";

client.setEncoding('utf8');

client.connect(port, function() {
            client.write(qa);
            console.log('Connected to the server');
        
    });
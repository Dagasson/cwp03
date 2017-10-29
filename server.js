const net = require('net');
const fs = require("fs");
const path = require('path');
const port = 8124;
let seed = 0;
const saveDirectory = process.env.NODE_PATH;
const maxConnection = process.env.CONST_MAX_CONNECTION;

const dec = "DEC";
const ack= "ACK";
const fl = "FILES";
const unknown = "UNKNOWN";
const dir = "Direct";
const client_name = "Client";
const server_name = "Server";
let separator = "\t\v\t\r";
let file=[];
let clientModes = [];

const server = net.createServer((client) =>
{
    console.log('Client connected');

    client.setEncoding('utf8');

    client.on('data', (data) =>
    {
        if (client.id === undefined&&data.toString()===fl)
        {
            client.id = (Date.now() + seed++).toString();
			client.write(ack);
            console.log("id : " + client.id);
        }
		else 
		{
			client.write(dec);
			client.end();
		}
    });
    client.on('data', ClientHandler);
    client.on('data', ClientFilesDialogue);

    client.on('end', () => console.log('Client disconnected'));

	function ClientHandler(data, error) {
        if (!error) {
            if (client.id === undefined && (data.toString() === fl)) {
                client.id = Date.now().toString() + seed++;
                console.log(`Client ${client.id} connect`);
                clientModes[client.id] = data.toString();
                    file[client.id] = [];
                    fs.mkdirSync(saveDirectory + path.sep + client.id);
                client.write(ack);
            }
        }
        else {
            console.error("ClientHandler error : " + error);
            client.write(dec);
        }
    }
    function ClientFilesDialogue(data, error) {
        if (!error) {
            if (clientModes[client.id] === fl && data.toString() !== "FILES") {
                file[client.id].push(data);
                if (data.toString().endsWith(separator + "FIN")) {
                    CreateFile(saveDirectory + path.sep + client.id, client.id);
                    client.write(accept);
                }
            }
        }
        else {
            console.error("ClientFilesDialogue error : " + error);
        }
    }

});
server.maxConnections = maxConnection;

server.listen(port, () =>
{
    console.log(`Server listening on localhost:${port}`)	
    });


function CreateFile(saveDir, id) {
    let buffer = Buffer.concat(file[id]);
    let separatorIndex = buffer.indexOf(separator);
    let filename = buffer.slice(separatorIndex).toString().split(separator).filter(Boolean)[0];
    fs.writeFileSync(saveDir + path.sep + filename, buffer.slice(0, separatorIndex));
    file[id] = [];
}

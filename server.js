const net = require('net');
const fs = require("fs");
const port = 8124;
let json_q = [];
let seed = 0;

const dec = "DEC";
const ack= "ACK";
const qa = "QA";
const unknown = "UNKNOWN";
const dir = "Direct";
const client_name = "Client";
const server_name = "Server";

const server = net.createServer((client) =>
{
    console.log('Client connected');

    client.setEncoding('utf8');

    client.on('data', (data) =>
    {
        if (client.id === undefined)
        {
            client.id = (Date.now() + seed++).toString();
            console.log("id : " + client.id);
        }
        log(client.id, data, client_name);
        
    });

    client.on('end', () => console.log('Client disconnected'));


});

server.listen(port, () =>
{
    fs.readFile("qa.json", (err, data) =>
    {
        if (err)
        {
            console.error("Error with JSON file");
        }
        else
        {
            json_q = JSON.parse(data);
        }
    });
    console.log(`Server listening on localhost:${port}`)
});


function rand_ans(question)
{
    for (let i = 0; i < json_q.length; i++)
    {
        if (json_q[i].question === question)
        {
            return Math.floor(Math.random() * 2) === 0 ? json_q[i].ans : json_q[i].wrong_ans;
        }
    }
    return unknown;
}

function log(clientId, line, sender)
{
    fs.appendFileSync(dir + "/" + clientId + ".log", sender + ": " + line + "\r\n");
}

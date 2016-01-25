require("sugar");
var unirest = require("unirest");
var ip = require("ip");
var config = require("./config.json");

var data = {
    ip: ip.address(),
    name: config.name
};

sendPing();
// update local IP and send a ping every minute
(function() {data.ip = ip.address(); sendPing()}).every(60000);

function sendPing() {
    unirest.post('http://abonetti.fr/rpc/api/ping')
        .header('Accept', 'application/json')
        .send(data)
        .end(function (response) {
            console.log("ping : "+response.body);
        });
}
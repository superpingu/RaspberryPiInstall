var sp = require("serialport");
var fs = require("fs");
require("sugar");

module.exports = function SerialPort(io) {
    var port;
    var baud = require("./baudrate.json").baudrate;
    var openCallback = function() {};

    io.on('connection', function (socket) {
        sendState(socket);
        socket.on('serial-connect', function(data) {
            connect(data.baudrate, socket);
        });
        socket.on('serial-write', function(data) {
            writeData(data.char);
        });
    });

    function sendState(socket) {
        socket.emit("serial-baudrate", baud);
        if(port && port.isOpen())
            socket.emit('serial-read', "@@@ The serial port is connected at "+baud+" baud @@@\n");
        else
            socket.emit('serial-read', "@@@ The serial port is not connected @@@\n");
    }
    function connect(baudrate, socket) {
        if(port)
            port.close();

        saveBaudrate(baudrate);

        port = new sp.SerialPort("/dev/ttyAMA0", {
            baudrate: baudrate,
            parser: sp.parsers.raw
        });
        port.on("open", function() {
            console.log("open serial port");

            port.on('data', onRead);

            port.on('error', function (err) {
                console.log("Connection error");
            });
            if(socket)
                sendState(socket);
        });
    }

    function onRead(symbol) {
        io.emit('serial-read', symbol+"");
    }

    function getPortList(callback)  {
        sp.list(function(err, ports) {
            callback(ports);
        });
    }

    function writeData(buffer) {
        if(port && port.isOpen()) {
            port.write(buffer);
        }
    }
    function saveBaudrate(baudrate) {
        baud = baudrate;
        fs.writeFile( "./baudrate.json", JSON.stringify({ baudrate: baudrate}), "utf8");
    }

    //connect(9600);
}
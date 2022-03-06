const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

var server = require('http').createServer(app);
var io = require('socket.io')(server);

let _url = '';
let identifier = '';
app.get('/', (req, res) => {
    identifier = req.query.id;
    _url = '/html/qrCode.html';
    res.sendFile(__dirname + _url);
})
let i = 0;
let id = '';
io.on('connection', function (socket) {
    app.post('/', (req, res) => {
        const id = req.body.id;
        let name = req.body.name; 	
	
	//0404 update : console.log
	console.log(".",id);

	switch (id) {
            case '1':
                io.emit('check1', name);
                break;
            case '2':
                io.emit('check2', name);
                break;
            case '3':
                io.emit('check3', name);
		break;
	    case '4':
                io.emit('check4', name);
                break;
            case '5':
                io.emit('check5', name);
                break;
            case '6':
                io.emit('check6', name);
                break;
	    default:
		console.log("switch-default");
		console.log("name:", unescape(name));
		break;
        }
	
	//0404 update : init name
	//name = "";
	//console.log("name :", name);
    })
});

server.listen(3030, function() {
    console.log('Socket IO server listening on port 3030');
  });

const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

const server = app.listen(8000, () =>
    console.log("Listen on port 8000"));

const io = require('socket.io').listen(server);


app.get('/', function(req, res) {
    res.render("index");
});


let count = 0;

io.sockets.on('connection',  socket => {
    console.log(`Client/socket is connected on ${ socket.id }`);

    socket.on('epic', () => {
		numberUpdate(++count);
        console.log(`Epic button was clicked, current count is ${ count }`);
	});

    socket.on('reset', () => {
		numberUpdate(count = 0);
        console.log(`Reset button was clicked, current count is ${ count }`);
	});

    function numberUpdate(count) {
		io.sockets.emit('numberUpdate', count);
	}
});

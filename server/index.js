const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

require("dotenv").config();

var corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'token']
}
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: ['http://127.0.0.1:3000', 'http://localhost:3000'], 
    credentials: true },
  });

const PORT = process.env.PORT;

const jsonParser = bodyParser.json()

mongoose.connect(process.env.DATABASE_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema; 

var UserModelSchema = new Schema ({
    id: {type: String, required: true},
    gameID: {type: String, required: true},
    createdAt: Date
})

var usersSchema = new Schema ([{
    username: {type: String, required: true}, 
    id: {type: String, required: true}
}])

var GameModelSchema = new Schema ({
    gameID: {type: String, required: true},
    users: [usersSchema],
    createdAt: Date
})

var UserModel = mongoose.model('User', UserModelSchema);
var GameModel = mongoose.model('Game', GameModelSchema);

// UserModelSchema.index({"createdAt": 1}, { expireAfterSeconds: 43200 } )
// GameModelSchema.index({"createdAt": 1}, { expireAfterSeconds: 43200 } )

const games = {};


app.get('/api/', (req, res) => {
    res.send("YAYYY", 200);
    return;
})

// app.post('/api/users/', jsonParser, async (req, res) => {
//     UserModel.findOneAndUpdate({id: req.body.id}, {gameID: req.body.gameID, createdAt: new Date()}, {upsert: true}, (err, data) => {
//         if(err) {
//             console.log(err);
//             return;
//         }
//     })
//     GameModel.findOneAndUpdate({gameID: req.body.gameID}, {createdAt: new Date()}, {upsert: true}, (err, data) => {
//         if(err) {
//             console.log(err);
//             return;
//         }
//     })
//     res.status(200).send({"message": "User created successfully"});
//     return;
// })

io.on('connection', (socket) => {
    socket.on("create game", async ( gameID, host ) => {
        socket.join(gameID);
        try {
            let result = await GameModel.findOne({ "gameID": gameID });
            if(! result) {
                var newGame = new GameModel({gameID: gameID, users: [host], createdAt: new Date()})
                newGame.save((err, _) => {
                    if (err) return console.error(err);
                  });
            }
        }
        catch (e) {
            console.error(e);
        }
    })
    socket.on("join game", async ( gameID, user ) => {
        socket.join(gameID);
        let game = await GameModel.findOne({gameID: gameID}).select('users -_id');
        socket.emit("old users", game.get('users'));
        try {
            GameModel.updateOne({gameID: gameID}, {$push: {users: user}}, function (error, obj) {
                if (error) {
                    console.log(error);
                }
            });
        }
        catch (e) {
            console.error(e);
        }
        socket.in(gameID).emit("new user", user);
    })
    
    // socket.on('disconnect', () => {
    //     console.log('user disconnected');
    // });
});

server.listen(PORT, () => {
    console.log('listening on port', PORT);
})


import './App.css';
import Profile from "./Components/Profile";
import Lobby from "./Components/Lobby";
import React, { useState, useEffect } from 'react'; 
import { BrowserRouter, Route, Switch } from "react-router-dom";
import uuid from "react-uuid";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.css";

function App() {

  const socket = io(process.env.REACT_APP_API_URL);
  
  const [ gameID, setGameID ] = useState("");
  const [ user, setUser ] = useState(null);
  const [ users, setUsers ] = useState([]);

  const makeID = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

  const createRoom = async (name, history) => {
      localStorage.setItem("Username", name);
      const gameID = makeID(6);
      setGameID(gameID);
      const id = uuid();
      setUser({'username': name, 'id': id});
      setUsers(users => [{'username': name, 'id': id}]);
      socket.emit("create game", gameID, {'username': name, 'id': id});
      history.push('/play?game=' + gameID);
      return;
  }

  const joinRoom = async(name, history) => {
    localStorage.setItem("Username", name);
    const id = uuid();
    setUser({'username': name, 'id': id});
    setUsers(users => [{'username': name, 'id': id}]);
    socket.emit("join game", gameID, {'username': name, 'id': id});
    return;
  }

  useEffect(() => {
    (async () => {
      let url = new URL(window.location.href);
      setGameID(url.searchParams.get("game"));
    })()
    socket.on("new user", (newUser) => {
      setUsers((users) => [...users, newUser]);
    })
    socket.once("old users", (oldUsers) => {
      setUsers(users => [...users, ...oldUsers]);
    })
  }, [socket])

  return (
    <div className="main">
      <h1>CARD GAME</h1>
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Profile onJoin={createRoom} gameID={gameID}/>
            )}
          />
          <Route
            path="/play/"
            exact
            render={() => (
              user ? <Lobby gameID={gameID} users={users} /> : (gameID && <Profile onJoin={joinRoom} gameID={gameID}/>)
            )}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Input, Button } from "reactstrap";
import { FiCopy } from "react-icons/fi";
const Lobby = ({gameID, users}) => {

    useEffect(() => {
        // console.log(users)
    }, [])

    return (
        <div className="profile">
            {/* <h2 className="text-center">LOBBY</h2> */}
            {users.map((user) => {
                return <h3 key={user.id} className="text-center">{user.username}</h3>
            })}
            <div className="mt-3 mb-3">
                <div className="input-group mb-2">
                    <Input type="text" className="form-control text-center" value={process.env.REACT_FRONTEND_URL + "play?game=" + gameID} />
                    <div class="input-group-append">
                        <Button className="btn btn-dark" type="button" onClick={() => {
                            navigator.clipboard.writeText(process.env.REACT_FRONTEND_URL + "play?game=" + gameID);
                            return;
                        }}><FiCopy /></Button>
                    </div>
                </div>
                <h6 className="text-center">Copy and send this link to to your friends</h6>
            </div>
            <Button className="btn btn-block btn-dark">
                Start Game
            </Button>
        </div>
    );
};

export default Lobby;
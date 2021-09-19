import React, { useState, useEffect} from 'react';
import { Input, Form, FormGroup, Button } from "reactstrap";
import { useHistory } from "react-router-dom";

const Profile = ({ onJoin, gameID }) => {
    const history = useHistory();

    const [name, setName ] = useState("");

    useEffect(() => {
        if(localStorage.getItem("Username")) {
            setName(localStorage.getItem("Username"));
        }
        console.log(gameID)
    }, [])

    return (
        <div className="profile">
            <Form className="" >
                <FormGroup className="mb-1">
                    <Input 
                        type="text"
                        value={name}
                        placeholder="Enter Your Name"
                        onChange={(e) => {
                        setName(e.target.value);
                        
                        }}
                    /> 
                </FormGroup>
                <FormGroup className="">
                    <Button className="btn btn-block btn-dark" onClick={() => onJoin(name, history)}>
                        {gameID ? "Join Room" : "Create a Room"}
                    </Button>
                </FormGroup>
                
            </Form>

        </div>
    );
};

export default Profile;
import React, { useContext, useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import { AuthContext } from '../../contexts/auth-context';
import { getDevAPIBase } from '../../network/network';
import { PageWrapper } from '../base/page-wrapper';


export function TwitchLogin(props) {

    let code = "";
    if (props.location && props.location.search) {
        let params = props.location.search.substring(1).split("&");
        params.forEach((element) => {
            let keyVal = element.split("=");
            if (keyVal[0] === "code")
                code = keyVal[1];
        });
    }

    const [failed, setFailed] = useState(false);
    const auth = useContext(AuthContext);

    useEffect(() => {
        async function sendCode() {
            fetch(getDevAPIBase() + "/auth/twitch/token", {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'code': code
                },
            }).then(resp => {
                if (resp.status == 200) {
                    return resp.json();
                }
                else {
                    setFailed(true);
                }
                return {};
            }).then(json => {
                if (json.access_token) {
                    sessionStorage.setItem("access_token", json.access_token);
                    sessionStorage.setItem("refresh_token", json.refresh_token);
                    auth.login();
                    props.history.push("/");
                }
            });
        }
        sendCode();
    }, []);

    //TODO: Send code to the server
    return (
        <PageWrapper>
            {
                failed && <h1>Unauthorized!</h1>
            }
            <Link to="/"> Click here if you do not get redirected!</Link>
        </PageWrapper>
    );
}
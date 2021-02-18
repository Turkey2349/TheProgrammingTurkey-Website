import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth-context';
import { ToastContext } from '../../contexts/toast-context';
import * as api from '../../network/twitch-games-network';

import { getAppsSiteBase } from '../../network/network-helper';
import { AuthPageWrapper } from '../../pages/base/auth-page-wrapper';
import { TextToast } from '../../toasts/text-toast';

export function TwitchBattleshipSetup(props) {
    const auth = useContext(AuthContext);
    const toast = useContext(ToastContext);

    const [token, setToken] = useState('');
    const [showURL, setShowURL] = useState(false);

    const [twitchWins, setTwitchWins] = useState(0);
    const [cpuWins, setCpuWins] = useState(0);
    const [gamePlayType, setGamePlayType] = useState(GamePlayStyle.VOTING);
    const [votingTimer, setVotingTimer] = useState(0);
    const [voteDisplayTimer, setVoteDisplayTimer] = useState(0);
    const [textColor, setTextColor] = useState('#000000');
    const [startDelay, setStartDelay] = useState(0);

    useEffect(() => {
        async function getToken() {
            api.getToken('battleship').then((token) => {
                setToken(token);
            });
        }
        if (auth.authState) getToken();
    }, [auth.authChecked]);

    useEffect(() => {
        async function loadDisplay() {
            api.getTwitchGameSettings('battleship', token).then((json) => {
                if (json.success) {
                    const data = json.data;
                    setTwitchWins(data.twitch_wins);
                    setCpuWins(data.cpu_wins);
                    setGamePlayType(data.game_play_type);
                    setVotingTimer(data.voting_timer);
                    setVoteDisplayTimer(data.vote_display_timer);
                    setTextColor(data.text_color);
                    setStartDelay(data.start_delay);
                }
            });
        }
        if (auth.authState) loadDisplay();
    }, [token]);

    const saveDisplaySettings = () => {
        api
            .saveTwitchGameSettings('battleship', token, {
                twitch_wins: twitchWins,
                cpu_wins: cpuWins,
                game_play_type: gamePlayType,
                voting_timer: votingTimer,
                vote_display_timer: voteDisplayTimer,
                text_color: textColor,
                start_delay: startDelay,
            })
            .then((json) => {
                if (json.success)
                    toast.pushToast(<TextToast text='Settings Saved!' />);
                else
                    toast.pushToast(<TextToast text={json.message} />);
            });
    };

    const regenToken = () => {
        api.regenToken('battleship').then((token) => {
            setToken(token);
        });
    };

    return (
        <AuthPageWrapper history={props.history} perm='twitchgame.battleship' parent='/twitchgames'>
            <div className='fluid-container pl-3'>
                <div className='row m-0 text-center'>
                    <div className='col m-0'>
                        <h2>Twitch Plays Battleship</h2>
                    </div>
                </div>
                <div className='row m-0 mt-3 mb-2'>
                    <label className='col m-0 ml-3 align-center' style={{ fontSize: '22px', maxWidth: '100px' }}>
                        URL:
                    </label>
                    <input
                        className='col ml-2 mr-4'
                        type='text'
                        readOnly
                        value={showURL ? `${getAppsSiteBase()}/twitch/battleship?token=${token}` : ''}
                        style={{ width: '800px' }}
                    />
                </div>
                <div className='row m-0 mt-2'>
                    <div
                        className='col m-0 ml-3 align-center'
                        style={{ maxWidth: '100px' }}
                    ></div>
                    <button
                        className='col-auto ml-2'
                        onClick={() => setShowURL((old) => !old)}
                    >
                        {showURL ? 'Hide URL' : 'Show Url'}
                    </button>
                    <button className='col-auto ml-2' onClick={regenToken}>
                        Regen Token
                    </button>
                </div>
                <hr />
                <div className='row m-0'>
                    <h3>Settings</h3>
                </div>
                <div className='row m-0 ml-4 mt-1'>
                    <label className='col mr-1 timer-label'>Twitch Wins:</label>
                    <input
                        type='number'
                        value={twitchWins}
                        onChange={(e) => {
                            setTwitchWins(parseInt(e.target.value));
                        }}
                    />
                </div>
                <div className='row m-0 ml-4 mt-1'>
                    <label className='col mr-1 timer-label'>CPU Wins:</label>
                    <input
                        type='number'
                        value={cpuWins}
                        onChange={(e) => {
                            setCpuWins(parseInt(e.target.value));
                        }}
                    />
                </div>
                <div className='row m-0 ml-4 mt-1'>
                    <label className='col mr-1 timer-label'>Game Play Style:</label>
                    <select>
                        <option value={GamePlayStyle.VOTING}>Voting</option>
                    </select>
                </div>
                <div className='row m-0 ml-4 mt-1'>
                    <label className='col mr-1 timer-label'>Voting Round Time:</label>
                    <input
                        type='number'
                        value={votingTimer}
                        onChange={(e) => {
                            setVotingTimer(parseInt(e.target.value));
                        }}
                    />
                </div>
                <div className='row m-0 ml-4 mt-1'>
                    <label className='col mr-1 timer-label'>Vote Display Time:</label>
                    <input
                        type='number'
                        value={voteDisplayTimer}
                        onChange={(e) => {
                            setVoteDisplayTimer(parseInt(e.target.value));
                        }}
                    />
                </div>
                <div className='row m-0 ml-4 mt-1'>
                    <label className='col mr-1 timer-label'>Start Delay:</label>
                    <input
                        type='number'
                        value={startDelay}
                        onChange={(e) => {
                            setStartDelay(parseInt(e.target.value));
                        }}
                    />
                </div>
                <div className='row m-0 ml-4 mt-1'>
                    <label className='col mr-1 timer-label'>Text Color:</label>
                    <input
                        type='color'
                        value={textColor}
                        onChange={(e) => {
                            setTextColor(e.target.value);
                        }}
                    />
                </div>
                <div className='row m-0 ml-4 mt-1'>
                    <button onClick={saveDisplaySettings}>Save</button>
                </div>
            </div>
        </AuthPageWrapper>
    );
}

const GamePlayStyle = {
    CHANNEL_POINTS: 0,
    VOTING: 1,
};

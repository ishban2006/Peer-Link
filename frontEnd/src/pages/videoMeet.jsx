import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import useMedia from "../hooks/useMedia";
import { getUserMedia } from '../hooks/useMedia2';

import { Badge, IconButton, Button, TextField } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'

import "../styles/videoMeet.css";
import ChatRoom from '../components/chatRoom';
import Lobby from '../components/lobby'
import RemoteVideos from '../components/remoteVideos';
import MainStage from "../components/MainStage";
import ParticipantStrip from "../components/ParticipantStrip";

const serverURL = import.meta.env.VITE_API_URL;

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

const connections = {};

const addLocalTracks = (peerConnection, stream) => {
    stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
    });
};

function VideoMeet() {
    let socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();       // Khud ka video
    const {
        video, audio, screen,
        setVideo, setAudio, setScreen,

        videoAvailable, audioAvailable, screenAvailable,
        setVideoAvailable, setAudioAvailable, setScreenAvailable,

        getPermissions,

        handleVideo, handleAudio, handleScreen
    } = useMedia(localVideoref);

    let [showModal, setModal] = useState(true);

    let [message, setMessage] = useState("");               // Khud ke Messages
    let [messages, setMessages] = useState([])
    let [newMessages, setNewMessages] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true);       // Guest Login
    let [username, setUsername] = useState("");             

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])          // Dusro ke videos
    const [pinnedStream, setPinnedStream] = useState(null);

    const [copied, setCopied] = useState(false);
    const { url } = useParams();
    const inviteLink = `${window.location.origin}/${url}`;
    const copyInvite = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            alert("Couldn't copy link");
        }
    };

    useEffect(() => {
        return () => {
            try {
                socketRef.current?.disconnect();

                Object.values(connections).forEach(conn => {
                    conn.close();
                });

                window.localStream?.getTracks()?.forEach(track => {
                    track.stop();
                });
            }
            catch(err) { console.log(err) }
        };
    }, []);

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream?.getTracks()?.forEach(track => track.enabled = false);       // Stop for now
        } catch (e) { 
            console.log(e) 
        }

        window.localStream = stream
        if(localVideoref.current){
            localVideoref.current.srcObject = stream;
        }

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            addLocalTracks(
                connections[id],
                window.localStream
            );

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {         // Stream from getUser Media
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])        // Camera Off
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                addLocalTracks(
                    connections[id],
                    window.localStream
                );

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let silence = () => {
        let ctx = new AudioContext()            // Audio API
        let oscillator = ctx.createOscillator()

        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    }

    let black = ({ width = 640, height = 480 } = {}) => {           // Black screen for Camera Off
        let canvas = Object.assign(document.createElement("canvas"), { width, height })         // Images API
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    useEffect(() => {
        getUserMedia(
            video,
            audio,
            localVideoref,
            getUserMediaSuccess
        );
    }, [audio, video]);

    let gotMessageFromServer = (fromId, message) => {           // Handling chats and associated notifications
        let signal = JSON.parse(message);

        console.log("SIGNAL RECEIVED");
        console.log("From:", fromId);
        console.log(signal);

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {               // Session Description
                console.log("Peer Exists:", connections[fromId]);
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {        // Reading session description
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description)
                                .then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice))
                .catch(e => console.log(e));
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io(serverURL);
        socketRef.current.on('signal', gotMessageFromServer);               // Catching what backend emitted

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-meet', window.location.href);

            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage);

            socketRef.current.on('user-left', (id) => {
                setVideos(videos =>
                    videos.filter(video => video.socketId !== id)
                );
            });

            socketRef.current.on('User Joined', (id, clients) => {
                console.log("USER JOINED EVENT");
                console.log(id);
                console.log(clients);

                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)

                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            console.log("ICE:", event.candidate);
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    connections[socketListId].ontrack = (event) => {
                        if (video.socketId === socketIdRef.current)
                            return;
                        console.log("ONTRACK");

                        const stream = event.streams[0];

                        setVideos(prevVideos => {
                            const existingIndex = prevVideos.findIndex(
                                video => video.socketId === socketListId
                            );

                            if (existingIndex !== -1) {
                                const updatedVideos = [...prevVideos];

                                updatedVideos[existingIndex] = {
                                    ...updatedVideos[existingIndex],
                                    stream
                                };

                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            }

                            const updatedVideos = [
                                ...prevVideos,
                                {
                                    socketId: socketListId,
                                    stream,
                                    autoplay: true,
                                    playsinline: true
                                }
                            ];

                            videoRef.current = updatedVideos;
                            return updatedVideos;
                        });
                    };

                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        addLocalTracks(
                            connections[socketListId],
                            window.localStream
                        );
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])       // When videos are off
                        window.localStream = blackSilence()
                        addLocalTracks(
                            connections[socketListId],
                            window.localStream
                        );
                    }
                });

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 !== socketIdRef.current) {

                            connections[id2].createOffer().then((description) => {
                                console.log("OFFER CREATED", id2);
                                connections[id2].setLocalDescription(description)
                                    .then(() => {
                                        socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                        // Crucial for handshake
                                    })
                                    .catch(e => console.log(e))
                            })
                        }
                    }
                }
            });
        });
    }

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let getDisplayMediaSuccess = (stream) => {
        try {
            window.localStream?.getTracks()?.forEach(track => track.stop());
        } catch (e) { console.log(e) }

        window.localStream = stream;
        setPinnedStream(stream);
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream;
        }

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            addLocalTracks(
                connections[id],
                window.localStream
            );

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false);
            setPinnedStream(null);

            try {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoref.current.srcObject = window.localStream;

            getUserMedia(video, audio, localVideoref, getUserMediaSuccess);
        })
    }

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .catch((e) => console.log(e))
            }
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/home"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }

    let closeChat = () => {
        setModal(false);
    }

    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        if(!message.trim()) return;

        socketRef.current.emit('chat-message', message, username);
        setMessage("");
    }

    useEffect(() => {
        if (showModal) {
            setNewMessages(0);
        }
    }, [showModal]);

    const screenStream =
        videos.find(v => v.isScreen);

    const participantVideos =
        videos.filter(v => !v.isScreen);

    let connect = () => {
        if(!username.trim()) return;

        setAskForUsername(false);
        getMedia();
    }

    const screenShare = videos.find(video => video.isScreen);

    const normalVideos = videos.filter(video => !video.isScreen);

    return (
        <>
            {askForUsername ? (
                <Lobby
                    username={username}
                    setUsername={setUsername}
                    connect={connect}
                    localVideoref={localVideoref}
                />
            ) : (
                <div className="meetVideoContainer">

                    <div className="meetingInfo">
                        <span>
                            Meeting Code: <strong>{url}</strong>
                        </span>

                        <Button variant="contained" size="small" 
                            startIcon={<ContentCopyIcon />} onClick={copyInvite}>
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                    </div>

                    <div className="videoSection">
                    <MainStage>
                        {pinnedStream ? (
                            <video className="mainPinnedVideo" autoPlay playsInline
                                ref={(ref) => {
                                    if (ref) {
                                        ref.srcObject = pinnedStream;
                                    }
                                }}
                            />
                        ) : (
                            <RemoteVideos videos={normalVideos} />
                        )}
                    </MainStage>

                        <ParticipantStrip localVideoref={localVideoref} videos={videos} />
                    </div>

                    {showModal && (
                        <ChatRoom
                            messages={messages}
                            message={message}
                            setMessage={setMessage}
                            setMessages={setMessages}
                            sendMessage={sendMessage}
                        />
                    )}

                    <div className="buttonContainers">

                        <IconButton
                            onClick={handleVideo}
                            style={{ color: "white" }}
                        >
                            {video ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>

                        <IconButton
                            onClick={handleEndCall}
                            style={{ color: "red" }}
                        >
                            <CallEndIcon />
                        </IconButton>

                        <IconButton
                            onClick={handleAudio}
                            style={{ color: "white" }}
                        >
                            {audio ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable && (
                            <IconButton
                                onClick={handleScreen}
                                style={{ color: "white" }}
                            >
                                {screen ? (
                                    <StopScreenShareIcon />
                                ) : (
                                    <ScreenShareIcon />
                                )}
                            </IconButton>
                        )}

                        <Badge
                            badgeContent={newMessages}
                            max={999}
                            color="warning"
                        >
                            <IconButton
                                onClick={() => setModal(!showModal)}
                                style={{ color: "white" }}
                            >
                                <ChatIcon />
                            </IconButton>
                        </Badge>

                    </div>

                </div>
            )}
        </>
    );
}

export default VideoMeet;
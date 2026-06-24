import React, { useEffect, useRef, useState } from 'react'
import io, { connect } from "socket.io-client";

import { Badge, IconButton, Button, TextField } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'

import '../styles/videoMeet.css'

const serverURL = import.meta.env.VITE_API_URL;

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

function VideoMeet() {
    let socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();       // Khud ka video

    let [videoAvailable, setVideoAvailable] = useState(true);       // Camera Permission
    let [audioAvailable, setAudioAvailable] = useState(true);       // Mic Permission

    let [video, setVideo] = useState([]);                       // Video On/Off
    let [audio, setAudio] = useState();                         // Mic On/Off

    let [screen, setScreen] = useState();                       // Screen Sharing
    let [screenAvailable, setScreenAvailable] = useState();     // Screen Share Permission

    let [showModal, setModal] = useState(true);

    let [message, setMessage] = useState("");               // Khud ke Messages
    let [messages, setMessages] = useState([])
    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);       // Guest Login
    let [username, setUsername] = useState("");             

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])          // Dusro ke videos

    const getPermissions = async () => {            // Get Hardware Permissions
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: videoAvailable, audio: audioAvailable });            // Data send to others
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        getPermissions();
    }, []);

    let getUserMedia = () => {                  // Whenever a change occurs in audio / video this function will run
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

    useEffect(() => {               
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [audio, video]);

    let connectToSocketServer = () => {
        socketRef.current = io.connect(serverURL, { secure : false });
        socketRef.current.on('signal', gotMessageFromServer);               // Catching what backend emitted

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-meet', window.location.href);

            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage);

            socketRef.current.on('disconnect', () => {
                setVideo( (videos) => {
                    return videos.filter((video) => {
                        return video.socketId !== id;
                    })
                })
            });

            socketRef.current.on('notify', (id, clients) => {
                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)

                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find((video) => {
                            return video.socketId === socketListId;
                        })
                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;   //Instantaneous Update
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };      // End of add stream

                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])       // When videos are off
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                });

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 !== socketIdRef.current) {
                            try {
                                connections[id2].addStream(window.localStream);
                            } catch(err) {
                                throw err;
                            }

                            connections[id2].createOffer().then((description) => {
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

    return (
        <>
            { askForUsername ?
                <div>
                    <h2>Enter into Lobby</h2>
                    <TextField id="outlined-basic" label="Username" value={username} 
                        onChange={e => setUsername(e.target.value)} variant="outlined" />
                    <Button variant="contained" onClick={getMedia}>Connect</Button>

                    <div>
                        <video ref={localVideoref} autoPlay muted></video>
                    </div>
                </div>
                    : 
                <>
                    
                </>
            }
        </>
    );
}

export default VideoMeet;
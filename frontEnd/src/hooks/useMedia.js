import { useState, useEffect } from "react";

export default function useMedia(localVideoref, getUserMediaSuccess) {

    const [video, setVideo] = useState(false);
    const [audio, setAudio] = useState(false);
    const [screen, setScreen] = useState(false);

    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [screenAvailable, setScreenAvailable] = useState(false);

    const getPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            setVideoAvailable(true);
            setAudioAvailable(true);

            setScreenAvailable(
                !!navigator.mediaDevices.getDisplayMedia
            );

            window.localStream = stream;

            if (localVideoref.current) {
                localVideoref.current.srcObject = stream;
            }
        } catch (err) {
            console.log(err);

            setVideoAvailable(false);
            setAudioAvailable(false);
        }
    };

    const handleVideo = () => {
        setVideo(prev => !prev);
    };

    const handleAudio = () => {
        setAudio(prev => !prev);
    };

    const handleScreen = () => {
        setScreen(prev => !prev);
    };

    useEffect(() => {
        getPermissions();
    }, []);


    const getUserMedia = (getUserMediaSuccess) => {
        if (!video && !audio) {
            try {
                localVideoref.current?.srcObject
                    ?.getTracks()
                    ?.forEach(track => track.stop());
            } catch (err) {
                console.log(err);
            }
            return;
        }

        navigator.mediaDevices.getUserMedia({
            video,
            audio
        })
        .then(getUserMediaSuccess)
        .catch(err => console.log(err));
    };
    useEffect(() => {
        getUserMedia(getUserMediaSuccess);
    }, [video, audio]);

    return {
        video, audio, screen,
        videoAvailable, audioAvailable, screenAvailable,

        setVideo, setAudio, setScreen,
        setVideoAvailable, setAudioAvailable, setScreenAvailable,

        getPermissions,

        handleVideo, handleAudio, handleScreen
    };

}
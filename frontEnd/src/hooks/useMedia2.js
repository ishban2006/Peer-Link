export const getUserMedia = (
    video,
    audio,
    localVideoref,
    getUserMediaSuccess
) => {
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
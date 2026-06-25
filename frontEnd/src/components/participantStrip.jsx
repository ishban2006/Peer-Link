export default function ParticipantStrip({
    localVideoref,
    videos
}) {
    return (
        <div className="participantStrip">

            <video
                className="participantTile localVideo"
                ref={localVideoref}
                autoPlay
                muted
                playsInline
            />

            {videos.map(video => (
                <video
                    key={video.socketId}
                    className="participantTile"
                    autoPlay
                    playsInline
                    ref={ref => {
                        if (ref && video.stream) {
                            ref.srcObject = video.stream;
                        }
                    }}
                />
            ))}

        </div>
    );
}
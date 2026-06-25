export default function RemoteVideos({ videos }) {

    if(videos.length===0){
        return(
            <div className="conferenceView empty">
                Waiting for participants...
            </div>
        );
    }

    return(

        <div
            className={
                videos.length===1
                ? "conferenceView single"
                : "conferenceView grid"
            }
        >

            {videos.map(video=>(
                <video
                    key={video.socketId}
                    autoPlay
                    playsInline
                    ref={ref=>{
                        if(ref && video.stream){
                            ref.srcObject=video.stream;
                        }
                    }}
                />
            ))}

        </div>

    );
}
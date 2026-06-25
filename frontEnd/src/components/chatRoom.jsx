import { Button, TextField } from "@mui/material";
import '../styles/chatRoom.css'

export default function ChatRoom({
    messages,
    message,
    setMessage,
    sendMessage
}) {
    return (
        <div className="chatRoom">

            <div className="chatHeader">
                Chat
            </div>

            <div className="chatContainer">

                <div className="messages">

                    {messages.length === 0 ? (
                        <div className="emptyMessages">
                            No Messages Yet
                        </div>
                    ) : (
                        messages.map((item, index) => (
                            <div className="messageCard" key={index}>

                                <div className="senderName">
                                    {item.sender}
                                </div>

                                <div className="messageText">
                                    {item.data}
                                </div>

                            </div>
                        ))
                    )}

                </div>

                <div className="chattingArea">

                    <TextField
                        fullWidth
                        size="small"
                        value={message}
                        placeholder="Type a message..."
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        onClick={sendMessage}
                    >
                        Send
                    </Button>

                </div>

            </div>

        </div>
    );
}
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  margin: auto;
  flex-wrap: wrap;
  background: #f0f2f5;
`;

const VideoSection = styled.div`
  flex: 2;
  min-width: 600px;
  padding: 20px;
`;

const ChatSection = styled.div`
  flex: 1;
  min-width: 300px;
  background: white;
  padding: 20px;
  border-left: 1px solid #ddd;
`;

const Video = styled.video`
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
  margin: 5px;
  background: #2c3e50;
`;

const App = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState({});
  const myVideo = useRef();

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (message) => {
      setMessages((msgs) => [...msgs, message]);
    });

    socket.on('callUser', ({ from, signal }) => {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on('signal', (data) => {
        socket.emit('answerCall', { signal: data, to: from });
      });

      peer.signal(signal);
      setPeers((peers) => ({ ...peers, [from]: peer }));
    });

    return () => {
      socket.off('message');
      socket.off('callUser');
    };
  }, [socket, stream]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && socket) {
      socket.emit('message', { text: messageInput });
      setMessageInput('');
    }
  };

  const callUser = (userId) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: userId,
        signalData: data,
      });
    });

    setPeers((peers) => ({ ...peers, [userId]: peer }));
  };

  return (
    <Container>
      <VideoSection>
        <h2>Chemistry Stream</h2>
        <Video playsInline muted ref={myVideo} autoPlay />
        {Object.values(peers).map((peer, index) => (
          <Video key={index} playsInline autoPlay />
        ))}
      </VideoSection>
      
      <ChatSection>
        <h3>Chat</h3>
        <div style={{ height: '400px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.user?.name || 'Anonymous'}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage}>
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            style={{ width: '70%', padding: '8px' }}
          />
          <button type="submit" style={{ width: '25%', marginLeft: '5%', padding: '8px' }}>
            Send
          </button>
        </form>
      </ChatSection>
    </Container>
  );
};

export default App;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import ACTIONS from '../../Actions';
import Editor from '../Editor';
import { initSocket } from '../../socket';

const AdminEditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [text, setText] = useState('');
    const [typingUser, setTypingUser] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null); 
    const [showAllClients, setShowAllClients] = useState(false); // State to toggle showing all clients
    const typingTimeoutRef = useRef(null); 

    useEffect(() => {
        const initializeSocket = async () => {
            try {
                socketRef.current = await initSocket();

                const handleErrors = (e) => {
                    console.error('Socket error:', e);
                    toast.error('Socket connection failed, try again later.');
                    navigate('/Dashboard/AdminRealTimeCollaboration');
                };

                socketRef.current.on('connect_error', handleErrors);
                socketRef.current.on('connect_failed', handleErrors);

                socketRef.current.emit(ACTIONS.JOIN, {
                    roomId,
                    username: location.state?.username,
                });

                socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                    }
                    setClients(clients);

                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                });

                socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => prev.filter((client) => client.socketId !== socketId));
                });

                socketRef.current.on('textUpdate', (newText) => {
                    setText(newText);
                });
            } catch (error) {
                console.error('Initialization error:', error);
                toast.error('An error occurred. Please try again later.');
            }
        };

        initializeSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                socketRef.current.off('textUpdate');
            }
        };
    }, [roomId, location.state?.username, navigate]);

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);

        if (socketRef.current) {
            socketRef.current.emit('textChange', newText);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        setTypingUser(location.state?.username);

        typingTimeoutRef.current = setTimeout(() => {
            setTypingUser(null);
        }, 2000);
    };

    const copyRoomId = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }, [roomId]);

    const leaveRoom = useCallback(() => {
        navigate('/Dashboard/AdminRealTimeCollaboration');
    }, [navigate]);

    if (!location.state) {
        return <Navigate to="/Dashboard/AdminRealTimeCollaboration" />;
    }

    return (
        <div className="grid grid-cols-[230px_1fr] h-screen text-white bg-gray-900">
            <div className="bg-[#1c1e29] p-4 flex flex-col">
                <div className="flex-1">
                    <div className="border-b border-gray-600 pb-2 mb-4">
                        <p className="text-center text-cyan-400 text-2xl font-bold">EditMantra</p>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-4 text-center text-green-400">Connected</h3>
                    
                    {/* Box for Clients */}
                    <div 
                        className="bg-[#2a2e3d] p-4 mb-3 rounded-lg cursor-pointer hover:scale-105 transition-all" 
                        onClick={() => setShowAllClients((prev) => !prev)}
                    >
                        <p className="text-center text-white font-bold">Clients ({clients.length})</p>
                    </div>
                    
                    {/* Show All Clients List when clicked */}
                    {showAllClients && (
                        <div className="flex flex-wrap gap-4 mt-4">
                            {clients.map((client) => (
                                <div
                                    key={client.socketId}
                                    onClick={() => setSelectedClient(client)}
                                    className="bg-[#2a2e3d] p-4 rounded-lg cursor-pointer hover:scale-105 transition-all w-64 m-2"
                                >
                                    <p className="text-center text-white font-bold">{client.username}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Displaying the typing username */}
                    {typingUser && (
                        <div className="text-center text-green-500 mt-2">{typingUser} is typing...</div>
                    )}

                    {/* Client Details Display */}
                    {selectedClient && (
                        <div className="mt-4 p-4 mb-3 bg-[#2a2e3d] rounded-lg">
                            <p className="text-white">Username: {selectedClient.username}</p>
                            <p className="text-white">Socket ID: {selectedClient.socketId}</p>
                        </div>
                    )}
                </div>
                <textarea
                    value={text}
                    onChange={handleTextChange}
                    rows="10"
                    className="w-full h-full p-2 text-lg border rounded-lg bg-gray-600 border-gray-300"
                    placeholder="Start typing..."
                />
                <button
                        className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded mt-4 transition-all duration-300 transform hover:scale-105"
                        onClick={copyRoomId}
                    >
                        Copy Room ID
                    </button>
                    <button
                        className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-2 px-4 rounded mt-4 transition-all duration-300 transform hover:scale-105"
                        onClick={leaveRoom}
                    >
                        Leave
                    </button>
            </div>
            <div className="bg-[#424761]">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>
        </div>
    );
};

export default AdminEditorPage;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, Navigate, useParams, Link } from 'react-router-dom';
import ACTIONS from '../Actions';
import Editor from './Editor';
import { initSocket } from '../socket';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [showAllClients, setShowAllClients] = useState(false);

    useEffect(() => {
        const initializeSocket = async () => {
            try {
                socketRef.current = await initSocket();

                socketRef.current.on('connect_error', () => {
                    toast.error('Socket connection failed, try again later.');
                    navigate('/RealTimeCollaboration');
                });

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
            } catch (error) {
                toast.error('An error occurred. Please try again later.');
            }
        };

        initializeSocket();

        return () => {
            socketRef.current?.disconnect();
        };
    }, [roomId, location.state?.username, navigate]);

    const copyRoomId = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied to clipboard');
        } catch {
            toast.error('Could not copy the Room ID');
        }
    }, [roomId]);

    const leaveRoom = useCallback(() => navigate('/RealTimeCollaboration'), [navigate]);

    if (!location.state) return <Navigate to="/RealTimeCollaboration" />;

    return (
        <div className="grid grid-cols-[230px_1fr] h-screen text-white bg-gray-900">
            <div className="bg-[#1c1e29] p-4 flex flex-col h-full">
                <header className="w-full ml-4 p-2 shadow-md flex justify-between items-center">
                    <Link to="/Home" className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent bg-clip-text hover:from-cyan-500 hover:to-purple-500 transition duration-300 ease-in-out">
                        EditMantra
                    </Link>
                </header>

                <h3 className="text-lg font-bold mt-4 text-center text-green-400">Connected</h3>

                <div 
                    className="bg-[#2a2e3d] p-4 mt-4 my-3 rounded-lg cursor-pointer hover:scale-105 transition-all" 
                    onClick={() => setShowAllClients(!showAllClients)}
                >
                    <p className="text-center font-bold">Clients ({clients.length})</p>
                </div>

                {showAllClients && (
                    <div className="flex flex-wrap gap-4 flex-1 overflow-y-auto">
                        {clients.map(({ socketId, username }) => (
                            <div key={socketId} className="bg-[#2a2e3d] p-4 rounded-lg w-64 text-center font-bold">
                                {username}
                            </div>
                        ))}
                    </div>
                )}

                {/* Ensure buttons stay at the bottom */}
                <div className="mt-auto">
                    <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded mt-4 hover:scale-105 transition-all w-full" onClick={copyRoomId}>
                        Copy Room ID
                    </button>
                    <button className="bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-2 px-4 rounded mt-4 hover:scale-105 transition-all w-full" onClick={leaveRoom}>
                        Leave
                    </button>
                </div>
            </div>

            <div className="bg-[#424761]">
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => (codeRef.current = code)} />
            </div>
        </div>
    );
};

export default EditorPage;
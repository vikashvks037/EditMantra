import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, Navigate, useParams, Link } from 'react-router-dom';
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
    const [showAllClients, setShowAllClients] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        const initializeSocket = async () => {
            try {
                socketRef.current = await initSocket();

                socketRef.current.on('connect_error', () => handleSocketError());
                socketRef.current.on('connect_failed', () => handleSocketError());
                
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
                handleSocketError();
            }
        };

        const handleSocketError = () => {
            toast.error('Socket connection failed, try again later.');
            navigate('/Dashboard/AdminRealTimeCollaboration');
        };

        initializeSocket();

        return () => {
            socketRef.current?.disconnect();
            socketRef.current?.off(ACTIONS.JOINED);
            socketRef.current?.off(ACTIONS.DISCONNECTED);
        };
    }, [roomId, location.state?.username, navigate]);

    const copyRoomId = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch {
            toast.error('Could not copy the Room ID');
        }
    }, [roomId]);

    const leaveRoom = useCallback(() => navigate('/Dashboard/AdminRealTimeCollaboration'), [navigate]);

    if (!location.state) return <Navigate to="/Dashboard/AdminRealTimeCollaboration" />;

    return (
        <div className="grid grid-cols-[230px_1fr] h-screen text-white bg-gray-900">
            {/* Sidebar */}
            <div className="bg-[#1c1e29] p-4 flex flex-col">
                {/* Header */}
                <header className="w-full ml-4 p-2 shadow-md flex justify-between items-center">
                    <Link to="/Dashboard" className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent bg-clip-text hover:from-cyan-500 hover:to-purple-500 transition duration-300 ease-in-out">
                        EditMantra
                    </Link>
                </header>

                {/* Clients List */}
                <h3 className="text-lg font-bold mt-4 mb-4 text-center text-green-400">Connected</h3>
                <div className="bg-[#2a2e3d] p-4 mb-3 rounded-lg cursor-pointer hover:scale-105 transition-all" onClick={() => setShowAllClients(!showAllClients)}>
                    <p className="text-center text-white font-bold">Clients ({clients.length})</p>
                </div>
                {showAllClients && (
                    <div className="flex flex-wrap gap-4 mt-4">
                        {clients.map((client) => (
                            <div key={client.socketId} onClick={() => setSelectedClient(client)} className="bg-[#2a2e3d] p-4 rounded-lg cursor-pointer hover:scale-105 transition-all w-64 m-2">
                                <p className="text-center text-white font-bold">{client.username}</p>
                            </div>
                        ))}
                    </div>
                )}
                {selectedClient && (
                    <div className="mt-4 p-4 mb-3 bg-[#2a2e3d] rounded-lg">
                        <p className="text-white">Username: {selectedClient.username}</p>
                        <p className="text-white">Socket ID: {selectedClient.socketId}</p>
                    </div>
                )}

                {/* Buttons (pinned to bottom) */}
                <div className="mt-auto flex flex-col gap-4">
                    <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all" onClick={copyRoomId}>
                        Copy Room ID
                    </button>
                    <button className="bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-all" onClick={leaveRoom}>
                        Leave
                    </button>
                </div>
            </div>

            {/* Editor Section */}
            <div className="bg-[#424761]">
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => (codeRef.current = code)} />
            </div>
        </div>
    );
};

export default AdminEditorPage;

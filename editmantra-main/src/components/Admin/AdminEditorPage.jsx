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
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/Dashboard/AdminRealTimeCollaboration');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/Dashboard/AdminRealTimeCollaboration');
    }

    if (!location.state) {
        return <Navigate to="/Dashboard/AdminRealTimeCollaboration" />;
    }

    return (
        <div className="grid grid-cols-[230px_1fr] min-h-screen">
            <div className="aside bg-[#1c1e29] p-4 text-white flex flex-col">
                <div className="asideInner flex-1">
                    <div className="logo border-b border-[#424242] pb-2">
                        <img className="logoImage h-15" src="/code-sync.png" alt="logo" />
                    </div>
                    <h3 className="text-xl mt-4 text-center text-green-400">Connected</h3>
                    <div className="clientsList flex items-center flex-wrap gap-5 mt-5">
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn bg-[#4CAF50] text-white p-2 rounded mt-4 w-full" onClick={copyRoomId}>
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn bg-[#f44336] text-white p-2 rounded mt-4 w-full" onClick={leaveRoom}>
                    Leave
                </button>
            </div>
            <div className="editorWrap p-4">
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

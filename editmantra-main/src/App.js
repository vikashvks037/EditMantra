import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import './index.css';
import EditorPage from './components/EditorPage';
import NotFound from './components/NotFound.jsx';
import LogIn from './components/LogIn.jsx';
import SignUp from './components/SignUp.jsx';
import Profile from './components/Profile';
import RealTimeCollaboration from './components/RealTimeCollaboration.jsx';
import Gamification from './components/Gamification.jsx';
import LearningResources from './components/LearningResources.jsx';
import EditProfile from './components/EditProfile.jsx';
import About from './components/About.jsx';
import BookList from "./components/BookList/BookList.jsx";
import BookDetails from "./components/BookDetails/BookDetails";
import Dashboard from "./components/Admin/Dashboard.jsx";
import EditGamification from "./components/Admin/EditGamification.js";
import UserManagement from "./components/Admin/UserManagement.js";
import AdminProfile from './components/Admin/AdminProfile.js';
import AdminAbout from './components/Admin/AdminAbout.js';
import Collaboration from './components/Collaboration.js';
import AdminRealTimeCollaboration from './components/Admin/AdminRealTimeCollaboration.js';
import AdminEditorPage from './components/Admin/AdminEditorPage.js';

function App() {
    return (
        <>
            <div>
                <Toaster position="top-right" toastOptions={{ success: { theme: { primary: '#4aed88',}, duration: 3000,},error: { theme: {primary: '#ff4d4d',},duration: 3000,},}}></Toaster>
            </div>
            <BrowserRouter>
                <Routes>
                    {/* Define Route paths */}
                    <Route path="/" element={<Home />} />
                    <Route path="/LogIn" element={<LogIn />} />
                    <Route path="/SignUp" element={<SignUp />} />
                    <Route path="/Profile" element={<Profile />} />
                    <Route path="/EditProfile" element={<EditProfile />} />
                    <Route path="/About" element={<About />} />
                    
                    {/* Dashboard and Admin routes */}
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/Dashboard/AdminProfile" element={<AdminProfile />} />
                    <Route path="/Dashboard/EditGamification" element={<EditGamification />} />
                    <Route path="/Dashboard/AdminAbout" element={<AdminAbout />} />
                    <Route path="/Dashboard/UserManagement" element={<UserManagement />} />
                    <Route path="/Dashboard/AdminRealTimeCollaboration/Editor/:roomId" element={<AdminEditorPage />} />
                    <Route path="/Dashboard/AdminRealTimeCollaboration" element={<AdminRealTimeCollaboration />} />


                    {/* Real-time collaboration */}
                    <Route path="/RealTimeCollaboration" element={<RealTimeCollaboration />} />
                    <Route path="/RealTimeCollaboration/editor/:roomId"element={<EditorPage />}></Route>
                    <Route path="/Gamification" element={<Gamification />} />
                    <Route path="/Gamification/Collaboration" element={<Collaboration />} />

                    {/* Learning Resources */}
                    <Route path="/LearningResources" element={<LearningResources />} />
                    <Route path="/LearningResources/book" element={<BookList />} />
                    <Route path="/book/:id" element={<BookDetails />} />

                    {/* Editor route for real-time collaboration */}
                    <Route path="/RealTimeCollaboration/editor/:roomId" element={<EditorPage />} />

                    {/* Catch-all Route for 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import ChatBot from "./pages/ChatBot/ChatBot";
import Learn from "./pages/Learn/Learn";
import TopicPage from "./pages/Learn/TopicPage";
import VideoTutorial from "./pages/VideoTutorial/VideoTutorial";
import ArrayPage from "./pages/Array/Array";
import StackPage from "./pages/Stack/Stack";
import QueuePage from "./pages/Queue/Queue";
import LinkedListPage from "./pages/LinkedList/LinkedList";
import TreePage from "./pages/Tree/Tree";
import GraphPage from "./pages/Graph/Graph";
import Quiz from "./pages/Quiz/Quiz";
import Progress from "./pages/Progress/Progress";
import Profile from "./pages/Profile/Profile";
import Interview from "./pages/Interview/Interview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatBot />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:topic" element={<TopicPage />} />
        <Route path="/video-tutorials" element={<VideoTutorial />} />
        <Route path="/array" element={<ArrayPage />} />
        <Route path="/stack" element={<StackPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/linkedlist" element={<LinkedListPage />} />
        <Route path="/tree" element={<TreePage />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
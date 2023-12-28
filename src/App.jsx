/* eslint-disable no-unused-vars */
import { Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./GuestPages/Login";
import Register from "./GuestPages/Register";
import Task from "./SecurePages/Task";

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/ankur-ka-todo-sab-ka-baap" element={<Register />} />
          <Route path="/task" element={<Task />} />
      </Routes>
    </>
  )
}

export default App

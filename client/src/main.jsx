import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './components/login'
import Chat from './components/chat'
import App from './App'




const router = createBrowserRouter([
  {
    path: "/",
    element: <Chat />,
  },
  {
    path: "/login",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

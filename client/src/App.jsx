import { useState, useCallback } from 'react';
import './App.css';
import Register from './components/register';
import Login from './components/login';

function App() {

  const [ displayRegister, setDisplayRegister ] = useState(false)

  let toggleDisplay = useCallback(() => {
    setDisplayRegister((prev) => !prev)
  }, []);

  return (
    <div className='login-container'>
    {displayRegister ?
      (<Register toggleDisplay={toggleDisplay}/>) :
      (<Login toggleDisplay={toggleDisplay}/>)}
    </div>
  )
}

export default App

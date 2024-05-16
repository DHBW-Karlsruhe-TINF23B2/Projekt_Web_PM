import React, {useEffect, useState} from 'react';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
       fetch('http://localhost:8000/api/test')
           .then(res => res.json())
           .then(data => console.log(data))
           .catch(reason => console.log(reason));
    });

    return (
      <div>
      </div>
  )
}

/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/

export default App;

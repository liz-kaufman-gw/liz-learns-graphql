import {useEffect, useState} from 'react'
import { getAllCountryCodes } from '../../libs/queryFunctions/getAllCountryCodes';
import './App.css';
import CountryInfoDisplay from '../CountryInfoDisplay';

function App() {
  const [countryCodes, setCountryCodes] = useState([])
  const [randomCountryCode, setRandomCountryCode] = useState('GB')
  
  useEffect(()=>{
    async function fetchCodeList(){
      const codes = await getAllCountryCodes();
      setCountryCodes(codes);
    }
    fetchCodeList()
  }, [])
  
  function selectRandomCountryCode(){
    const index = Math.floor(Math.random() * countryCodes.length)
    setRandomCountryCode(countryCodes[index])
  }

  return (
    <main className="App">
      <button onClick={selectRandomCountryCode}>🌎</button>
      <CountryInfoDisplay code={randomCountryCode} />
    </main>
  );
}

export default App;

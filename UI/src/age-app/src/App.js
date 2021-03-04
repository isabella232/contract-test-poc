import MyForm from './components/Form'
import './App.css';

function App() {
  function refreshPage() {
    window.location.reload(false);
  }
  return (
    <div className="App">
      <div><MyForm/></div>
      <div>
      <button onClick={refreshPage}>Reset</button>
    </div>
    </div>
  );
}

export default App;

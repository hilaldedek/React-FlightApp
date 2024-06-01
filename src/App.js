import logo from './logo.svg';
import './App.css';
import Navbar from'./Components/Navbar/Navbar';
import AppRouter from './Router/AppRouter';

function App() {
  return (
    <div className="App">
      <AppRouter/>
    </div>
  );
}

export default App;

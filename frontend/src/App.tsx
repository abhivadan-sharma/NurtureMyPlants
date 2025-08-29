import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import ProcessingScreen from './components/ProcessingScreen';
import ResultsScreen from './components/ResultsScreen';
import SharedPlant from './components/SharedPlant';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/processing" element={<ProcessingScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="/plant/:shareId" element={<SharedPlant />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import Header from "./Header.js"
import About from "./About.js"
import CDView from "./CDview.js"
import Footer from "./Footer.js"


function App() {
  const basename = document.querySelector('base')?.getAttribute('href') ?? '/';

  return (
    <Router basename={basename}>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/cds/*" element={<CDView />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

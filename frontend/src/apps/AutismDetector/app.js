// App.js

import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home"; // Import your existing Home component
import AutismInstructions from "./AutismDetector/AutismInstructions"; // Import the AutismInstructions component
import AutismInstructions from "./AutismDetector/personaldetails"; // Import the AutismInstructions component

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/autism_instructions" component={AutismInstructions} />
      <Route path="/autism_instructions/personaldetails" component={personaldetails} />
      {/* Include other routes as necessary */}
    </Router>
  );
}

export default App;

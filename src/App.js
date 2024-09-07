import React, { useState } from "react";
import Popup from "./components/Popup"; // Import the Popup component
import './App.css';

function App() {
  const [showPopup, setShowPopup] = useState(false); // Controls popup visibility
  const [savedSegments, setSavedSegments] = useState([]); // Stores the saved segments

  // Function to toggle popup visibility
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Function to handle segment save
  const saveSegment = (newSegment) => {
    setSavedSegments([...savedSegments, newSegment]); // Add the new segment to the list
    setShowPopup(false); // Close the popup after saving
  };

  return (
    <div className="App">
      {/* Save Segment Button */}
      <button onClick={togglePopup}>Save Segment</button>

      {/* Display saved segments */}
      <div className="saved-segments">
        <h2>Saved Segments</h2>
        {savedSegments.map((segment, index) => (
          <div key={index} className="segment-item">
            <h3>{segment.segment_name}</h3>
            <ul>
              {segment.schema.map((schema, schemaIndex) => (
                <li key={schemaIndex}>
                  {Object.values(schema)[0]} {/* Display schema label */}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Popup for creating a new segment */}
      {showPopup && <Popup closePopup={togglePopup} saveSegment={saveSegment} />}
    </div>
  );
}

export default App;

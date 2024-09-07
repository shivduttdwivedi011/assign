import React, { useState } from "react";

const schemaOptions = [
  { label: "First Name", value: "first_name", type: "user" },
  { label: "Last Name", value: "last_name", type: "user" },
  { label: "Gender", value: "gender", type: "user" },
  { label: "Age", value: "age", type: "user" },
  { label: "Account Name", value: "account_name", type: "group" },
  { label: "City", value: "city", type: "group" },
  { label: "State", value: "state", type: "group" },
];

function Popup({ closePopup, saveSegment }) {
  const [segmentName, setSegmentName] = useState(""); // For segment name
  const [selectedSchemas, setSelectedSchemas] = useState([]); // To track selected schemas
  const [availableSchemas, setAvailableSchemas] = useState(schemaOptions); // Available options in dropdown
  const [currentSchema, setCurrentSchema] = useState(""); // Selected schema from dropdown

  // Handle schema selection
  const handleSchemaChange = (e) => {
    setCurrentSchema(e.target.value);
  };

  // Add selected schema to the blue box
  const addSchema = () => {
    if (!currentSchema) return; // Don't do anything if no schema is selected

    const addedSchema = availableSchemas.find((schema) => schema.value === currentSchema);

    // Update selected schemas list
    setSelectedSchemas([...selectedSchemas, addedSchema]);

    // Remove the selected schema from the available options
    const updatedSchemas = availableSchemas.filter((schema) => schema.value !== currentSchema);
    setAvailableSchemas(updatedSchemas);

    // Reset the current schema selection
    setCurrentSchema("");
  };

  // Submit the segment to the parent and send to Webhook.site
  const handleSubmit = () => {
    if (segmentName && selectedSchemas.length > 0) {
      const schemaData = selectedSchemas.map((schema) => ({
        [schema.value]: schema.label,
      }));

      const newSegment = {
        segment_name: segmentName,
        schema: schemaData,
      };

      // Use an alternative CORS proxy
      const proxyUrl = "https://corsproxy.github.io/?";
      const targetUrl = "https://webhook.site/50d7b735-82c8-4716-a2af-f16b3136a59d";

      fetch(proxyUrl + targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSegment), // Send segment data as JSON
      })
        .then((response) => {
          // Check if response is in JSON format
          if (response.ok) {
            return response.json();
          } else {
            return response.text(); // Return text if response is not JSON
          }
        })
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      // Send the saved segment data to the parent component
      saveSegment(newSegment);

      // Close the popup after saving
      closePopup();
    } else {
      alert("Please enter segment name and add at least one schema.");
    }
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Saving Segment</h2>

        {/* Input for segment name */}
        <input
          type="text"
          placeholder="Name of the segment"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
        />

        {/* Blue box showing the selected schemas */}
        <div className="blue-box">
          {selectedSchemas.map((schema, index) => (
            <div key={index} className="schema-label">
              <div
                className={`circle ${schema.type === "user" ? "user-trait" : "group-trait"}`}
              ></div>
              {schema.label}
            </div>
          ))}
        </div>

        {/* Dropdown to select a schema */}
        <select value={currentSchema} onChange={handleSchemaChange}>
          <option value="" disabled>Select a schema</option>
          {availableSchemas.map((schema) => (
            <option key={schema.value} value={schema.value}>
              {schema.label}
            </option>
          ))}
        </select>

        {/* Button to add the selected schema */}
        <button onClick={addSchema}>+ Add new schema</button>

        {/* Button to submit the segment */}
        <button onClick={handleSubmit}>Save the Segment</button>

        {/* Button to cancel */}
        <button onClick={closePopup} className="cancel-button">Cancel</button>
      </div>
    </div>
  );
}

export default Popup;

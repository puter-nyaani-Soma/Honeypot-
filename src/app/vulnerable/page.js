'use client'

import { useState } from 'react';

export default function VulnerablePage() {
  const [output, setOutput] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message) => {
    alert(message); // Display the alert with the message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await fetch('/api/vulnerable-endpoint', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      // Handle SQL Injection response
      if (result.type === 'sql-injection') {
        setOutput(result.data); // Set the data for tabular display
      } else if (result.type === 'xss') {
        // Show alert if there's an alert message
        if (result.alertMessage) {
          showAlert(result.alertMessage);
        }
        setOutput([]); // Clear output for XSS
      } else {
        // Normal input handling
        setOutput([{ message: result.message }]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showAlert('Error fetching data.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Vulnerable Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="input"
            placeholder="Enter input"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>

        {/* Display SQL Injection data in tabular form */}
        {output.length > 0 && output[0].user ? (
          <table className="mt-4 w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">User</th>
                <th className="border border-gray-300 p-2">Password</th>
                <th className="border border-gray-300 p-2">Session Token</th>
              </tr>
            </thead>
            <tbody>
              {output.map((row, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{row.user}</td>
                  <td className="border border-gray-300 p-2">{row.password}</td>
                  <td className="border border-gray-300 p-2">{row.session_token}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className=" bg-gray-100 border border-gray-300 rounded-md">
            {output.length > 0 && output[0].message ? output[0].message : ''}
          </div>
        )}
      </div>
    </div>
  );
}

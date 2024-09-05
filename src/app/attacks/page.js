'use client'

import { useEffect, useState } from 'react';

const PAGE_SIZE = 5;

export default function AttacksPage() {
  const [attacks, setAttacks] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAttacks = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/attacks?page=${page}&limit=${PAGE_SIZE}`);
      const result = await response.json();
      setAttacks(result.attacks);
      setTotal(result.total);
      setCurrentPage(result.page);
    } catch (error) {
      console.error('Error fetching attacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttacks(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / PAGE_SIZE)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-8xl">
        <h1 className="text-2xl font-bold mb-4">Recent Attacks</h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">IP Address</th>
                  <th className="border border-gray-300 p-2">User-Agent</th>
                  <th className="border border-gray-300 p-2">Browser</th>
                  <th className="border border-gray-300 p-2">OS</th>
                  <th className="border border-gray-300 p-2">Device</th>
                  <th className="border border-gray-300 p-2">Input</th>
                  <th className="border border-gray-300 p-2">Type</th>
                  <th className="border border-gray-300 p-2">Timestamp</th>
                  <th className="border border-gray-300 p-2">Referrer</th>
                </tr>
              </thead>
              <tbody>
                {attacks.map((attack, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{attack.ip}</td>
                    <td className="border border-gray-300 p-2">{attack.userAgent}</td>
                    <td className="border border-gray-300 p-2">{attack.parsedUserAgent.browser}</td>
                    <td className="border border-gray-300 p-2">{attack.parsedUserAgent.os}</td>
                    <td className="border border-gray-300 p-2">{attack.parsedUserAgent.device}</td>
                    <td className="border border-gray-300 p-2">{attack.input}</td>
                    <td className="border border-gray-300 p-2">{attack.type}</td>
                    <td className="border border-gray-300 p-2">{new Date(attack.timestamp).toLocaleString()}</td>
                    <td className="border border-gray-300 p-2">{attack.referrer}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Previous
              </button>
              <span>Page {currentPage} of {Math.ceil(total / PAGE_SIZE)}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(total / PAGE_SIZE)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

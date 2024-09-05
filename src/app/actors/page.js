'use client'

import { useEffect, useState } from 'react';

const PAGE_SIZE = 10;

export default function ActorsPage() {
  const [actors, setActors] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActors = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/actors?page=${page}&limit=${PAGE_SIZE}`);
      const result = await response.json();
      setActors(result.actors);
      setTotal(result.total);
    } catch (error) {
      console.error('Error fetching actors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActors(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / PAGE_SIZE)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-4">Actors</h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Name</th>

                </tr>
              </thead>
              <tbody>
                {actors.map((actor, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{actor.name}</td>

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

'use client'

import { useEffect, useState } from 'react';

const PAGE_SIZE = 10;

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovies = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/movies?page=${page}&limit=${PAGE_SIZE}`);
      const result = await response.json();
      setMovies(result.movies);
      setTotal(result.total);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / PAGE_SIZE)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-4">Movies</h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Title</th>
                  <th className="border border-gray-300 p-2">Year</th>
                  <th className="border border-gray-300 p-2">Genres</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{movie.title}</td>
                    <td className="border border-gray-300 p-2">{movie.year}</td>
                    <td className="border border-gray-300 p-2">{movie.genres.join(', ')}</td>
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

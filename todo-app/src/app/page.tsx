import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the TODO App</h1>
      <p className="text-lg text-center mb-6 max-w-2xl">
        This application allows you to manage your TODO items efficiently. You can create, edit, and delete TODOs.
      </p>
      <Link href="/todo">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition">
          Go to TODO List
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
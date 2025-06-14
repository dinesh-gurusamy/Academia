import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaDownload, FaUsers } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between  text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-orange-500">
            Welcome to Academia Platform
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Access and download educational resources to enhance your learning experience.
          </p>
          <Link
            to="/login"
            className="inline-block bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4  text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-orange-500 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <FaBookOpen className="text-5xl mb-4 text-orange-500" />
              <h4 className="text-xl font-semibold mb-2">Extensive Resources</h4>
              <p className="text-sm text-gray-600 max-w-xs">
                Access a wide range of educational materials tailored to your needs.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <FaDownload className="text-5xl mb-4 text-orange-500" />
              <h4 className="text-xl font-semibold mb-2">Easy Downloads</h4>
              <p className="text-sm text-gray-600 max-w-xs">
                Download resources with just a single click.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <FaUsers className="text-5xl mb-4 text-orange-500" />
              <h4 className="text-xl font-semibold mb-2">Community Support</h4>
              <p className="text-sm text-gray-600 max-w-xs">
                Join a community of learners and educators worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t text-center">
        <div className="text-sm text-gray-600">
          © 2025 <span className="text-orange-500 font-medium">Academia Platform</span>. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;

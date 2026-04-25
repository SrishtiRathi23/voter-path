import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import BallotBox from '../illustrations/BallotBox';

const NotFound = () => (
  <MainLayout>
    <div className="page-container section-spacing flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="mb-6" aria-hidden="true">
        <BallotBox className="w-32 h-36 opacity-60" />
      </div>
      <h1 className="text-h1 text-navy font-bold mb-3">Page Not Found</h1>
      <p className="text-base text-[#5C5C5C] mb-8 max-w-sm">
        This page doesn't exist. Let's get you back on track to cast your vote! 🗳️
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/" className="btn-primary px-7 py-3.5">
          Go to Home
        </Link>
        <Link to="/chat" className="btn-secondary px-7 py-3.5">
          Ask the Assistant
        </Link>
      </div>
    </div>
  </MainLayout>
);

export default NotFound;

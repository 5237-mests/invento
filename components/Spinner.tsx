import React from 'react';
// import styles from './Spinner.module.css';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900`}
        style={{ borderTopColor: 'transparent' }}
      ></div>
    </div>
  );
};

export default Spinner;

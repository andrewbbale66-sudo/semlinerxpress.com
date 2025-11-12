/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  'Calculating optimal route...',
  'Assigning delivery vehicle...',
  'Planning logistics...',
  'Consulting with our AI traffic controller...',
  'Visualizing the first leg of the journey...',
  'Loading package onto the truck...',
  'This can take a few minutes, your patience is appreciated!',
  'Ensuring timely delivery...',
  'Finalizing shipment details...',
  'Polishing the visualization...',
  'Confirming delivery address...',
  'Checking for road closures...',
  'Calibrating the GPS...',
  'Printing shipping labels...',
  'The journey is about to begin!',
  'Our digital driver is getting ready.',
  'Fueling up the virtual truck...',
];

const LoadingIndicator: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-[var(--sxl-navy)]/50 rounded-lg border border-[var(--sxl-lightest-navy)]">
      <div className="w-16 h-16 border-4 border-t-transparent border-[var(--sxl-blue)] rounded-full animate-spin"></div>
      <h2 className="text-2xl font-semibold mt-8 text-[var(--sxl-lightest-slate)]">
        Visualizing Your Shipment
      </h2>
      <p className="mt-2 text-[var(--sxl-slate)] text-center transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingIndicator;

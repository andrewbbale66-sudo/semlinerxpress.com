/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { KeyIcon } from './icons';

interface ApiKeyDialogProps {
  onContinue: () => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 bg-[var(--sxl-dark-navy)]/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--sxl-navy)] border border-[var(--sxl-lightest-navy)] rounded-2xl shadow-xl max-w-lg w-full p-8 text-center flex flex-col items-center">
        <div className="bg-[var(--sxl-blue)]/20 p-4 rounded-full mb-6">
          <KeyIcon className="w-12 h-12 text-[var(--sxl-orange)]" />
        </div>
        <h2 className="text-3xl font-bold text-[var(--sxl-lightest-slate)] mb-4">
          Partner Account Required
        </h2>
        <p className="text-[var(--sxl-light-slate)] mb-8">
          This advanced shipment visualization is a premium feature for our
          business partners. Please select an API key associated with your
          partner account to proceed.
        </p>
        <button
          onClick={onContinue}
          className="w-full px-6 py-3 bg-[var(--sxl-blue)] hover:bg-[var(--sxl-blue)/90] text-white font-semibold rounded-lg transition-colors text-lg">
          Continue with Partner Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeyDialog;

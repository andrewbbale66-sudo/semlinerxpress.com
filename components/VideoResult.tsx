/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {
  ArrowPathIcon,
  CheckIcon,
  ClipboardIcon,
  PackageIcon,
  PlusCircleIcon,
} from './icons';

interface VideoResultProps {
  videoUrl: string;
  onRetry: () => void;
  onNewVideo: () => void;
  onExtend: () => void;
  canExtend: boolean;
  trackingNumber?: string;
}

const VideoResult: React.FC<VideoResultProps> = ({
  videoUrl,
  onRetry,
  onNewVideo,
  onExtend,
  canExtend,
  trackingNumber,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };
  return (
    <div className="w-full flex flex-col items-center gap-6 p-8 bg-[var(--sxl-navy)]/50 rounded-lg border border-[var(--sxl-lightest-navy)] shadow-2xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--sxl-lightest-slate)]">
          Your Shipment Journey is Ready!
        </h2>
        {trackingNumber && (
          <div className="inline-flex items-center gap-2 mt-3 bg-[var(--sxl-light-navy)] border border-[var(--sxl-lightest-navy)] rounded-full px-4 py-1.5">
            <span className="text-sm font-medium text-[var(--sxl-slate)]">
              Tracking:
            </span>
            <span className="text-lg font-mono text-[var(--sxl-orange)]">
              {trackingNumber}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-full hover:bg-[var(--sxl-lightest-navy)] text-[var(--sxl-slate)] hover:text-white transition-colors"
              aria-label="Copy tracking number">
              {copied ? (
                <CheckIcon className="w-4 h-4 text-green-400" />
              ) : (
                <ClipboardIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--sxl-lightest-navy)] hover:bg-[var(--sxl-light-navy)] text-white font-semibold rounded-lg transition-colors">
          <ArrowPathIcon className="w-5 h-5" />
          Recalculate
        </button>
        {canExtend && (
          <button
            onClick={onExtend}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--sxl-orange)] hover:bg-[var(--sxl-orange)/90] text-white font-semibold rounded-lg transition-colors">
            <PlusCircleIcon className="w-5 h-5" />
            Add Stop
          </button>
        )}
        <button
          onClick={onNewVideo}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--sxl-blue)] hover:bg-[var(--sxl-blue)/90] text-white font-semibold rounded-lg transition-colors">
          <PackageIcon className="w-5 h-5" />
          New Shipment
        </button>
      </div>
    </div>
  );
};

export default VideoResult;

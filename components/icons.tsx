/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Clipboard,
  KeyRound,
  Layers,
  Package,
  Plus,
  PlusCircle,
  RefreshCw,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Ticket,
  Tv,
  X,
} from 'lucide-react';

const defaultProps = {
  strokeWidth: 1.5,
};

export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <KeyRound {...defaultProps} {...props} />
);

export const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <RefreshCw {...defaultProps} {...props} />;

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Sparkles {...defaultProps} {...props} />;

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Plus {...defaultProps} {...props} />
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ChevronDown {...defaultProps} {...props} />;

export const SlidersHorizontalIcon: React.FC<
  React.SVGProps<SVGSVGElement>
> = (props) => <SlidersHorizontal {...defaultProps} {...props} />;

export const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ArrowRight {...defaultProps} {...props} />;

export const RectangleStackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Layers {...defaultProps} {...props} />;

export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <X {...defaultProps} {...props} />
);

export const TvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Tv {...defaultProps} {...props} />
);

// This icon had a different stroke width in the original file, so we preserve it.
export const CurvedArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ArrowDown {...props} strokeWidth={3} />;

// New icons for logistics theme
export const PackageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Package {...defaultProps} {...props} />
);

export const RouteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Route {...defaultProps} {...props} />
);

export const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ShieldCheck {...defaultProps} {...props} />;

export const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <PlusCircle {...defaultProps} {...props} />;

export const TicketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Ticket {...defaultProps} {...props} />
);

export const ClipboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Clipboard {...defaultProps} {...props} />;

export const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Check {...defaultProps} {...props} />
);

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    id="logo"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    viewBox="0 0 84 96"
    {...props}>
    <title>Logo</title>
    <g transform="translate(-8.000000, -2.000000)">
      <g transform="translate(11.000000, 5.000000)">
        <path
          d="M45.691667,45.15 C48.866667,42.35 51.133333,39.216667 52.491667,35.75 C53.85,32.283333 54.525,28.6 54.525,24.6 C54.525,20.533333 53.85,16.883333 52.491667,13.65 C51.133333,10.416667 48.866667,7.633333 45.691667,5.3 C42.516667,2.966667 38.966667,1.433333 35.041667,0.7 C31.116667,-0.033333 26.933333,-0.033333 22.491667,0.7 C18.566667,1.433333 15.016667,2.966667 11.841667,5.3 C8.666667,7.633333 6.4,10.416667 5.041667,13.65 C3.683333,16.883333 3.008333,20.533333 3.008333,24.6 C3.008333,28.6 3.683333,32.283333 5.041667,35.75 C6.4,39.216667 8.666667,42.35 11.841667,45.15 C15.016667,47.95 18.566667,49.883333 22.491667,51 C26.416667,52.116667 31.116667,52.116667 35.583333,51 C39.508333,49.883333 42.816667,47.95 45.691667,45.15 Z"
          fill="var(--sxl-blue)"></path>
        <polygon
          id="Shape"
          fill="var(--sxl-orange)"
          points="33 61.5 33 86 43 86 43 61.5 58.5 61.5 58.5 51.5 20.5 51.5 20.5 61.5"></polygon>
        <polygon
          id="Shape"
          fill="var(--sxl-orange)"
          points="60.5 25 60.5 35 78 35 78 25"></polygon>
      </g>
    </g>
  </svg>
);

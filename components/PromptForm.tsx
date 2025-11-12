/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Video} from '@google/genai';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AspectRatio,
  GenerateVideoParams,
  GenerationMode,
  ImageFile,
  Resolution,
  VeoModel,
  VideoFile,
} from '../types';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  PackageIcon,
  PlusCircleIcon,
  PlusIcon,
  RectangleStackIcon,
  RouteIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  TicketIcon,
  TvIcon,
  XMarkIcon,
} from './icons';

const aspectRatioDisplayNames: Record<AspectRatio, string> = {
  [AspectRatio.LANDSCAPE]: 'Vehicle Camera (16:9)',
  [AspectRatio.PORTRAIT]: 'Drone View (9:16)',
};

const modelDisplayNames: Record<VeoModel, string> = {
  [VeoModel.VEO_FAST]: 'Standard Freight',
  [VeoModel.VEO]: 'Priority Express',
};

const resolutionDisplayNames: Record<Resolution, string> = {
  [Resolution.P720]: 'Standard Quality',
  [Resolution.P1080]: 'High Definition',
};

const modeDisplayNames: Record<GenerationMode, string> = {
  [GenerationMode.TEXT_TO_VIDEO]: 'Standard Shipment',
  [GenerationMode.FRAMES_TO_VIDEO]: 'Multi-Stop Journey',
  [GenerationMode.REFERENCES_TO_VIDEO]: 'Special Handling',
  [GenerationMode.EXTEND_VIDEO]: 'Add a Stop',
};

const modeIcons: Record<GenerationMode, React.ReactNode> = {
  [GenerationMode.TEXT_TO_VIDEO]: <PackageIcon className="w-5 h-5" />,
  [GenerationMode.FRAMES_TO_VIDEO]: <RouteIcon className="w-5 h-5" />,
  [GenerationMode.REFERENCES_TO_VIDEO]: (
    <ShieldCheckIcon className="w-5 h-5" />
  ),
  [GenerationMode.EXTEND_VIDEO]: <PlusCircleIcon className="w-5 h-5" />,
};

const fileToBase64 = <T extends {file: File; base64: string}>(
  file: File,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      if (base64) {
        resolve({file, base64} as T);
      } else {
        reject(new Error('Failed to read file as base64.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
const fileToImageFile = (file: File): Promise<ImageFile> =>
  fileToBase64<ImageFile>(file);
const fileToVideoFile = (file: File): Promise<VideoFile> =>
  fileToBase64<VideoFile>(file);

const CustomSelect: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({label, value, onChange, icon, children, disabled = false}) => (
  <div>
    <label
      className={`text-xs block mb-1.5 font-medium ${
        disabled ? 'text-[var(--sxl-slate)]/50' : 'text-[var(--sxl-slate)]'
      }`}>
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icon}
      </div>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-[var(--sxl-navy)] border border-[var(--sxl-lightest-navy)] rounded-lg pl-10 pr-8 py-2.5 appearance-none focus:ring-1 focus:ring-[var(--sxl-orange)] focus:border-[var(--sxl-orange)] disabled:bg-[var(--sxl-light-navy)]/50 disabled:border-[var(--sxl-light-navy)] disabled:text-[var(--sxl-slate)]/50 disabled:cursor-not-allowed">
        {children}
      </select>
      <ChevronDownIcon
        className={`w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
          disabled ? 'text-[var(--sxl-slate)]/50' : 'text-[var(--sxl-slate)]'
        }`}
      />
    </div>
  </div>
);

const ImageUpload: React.FC<{
  onSelect: (image: ImageFile) => void;
  onRemove?: () => void;
  image?: ImageFile | null;
  label: React.ReactNode;
}> = ({onSelect, onRemove, image, label}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageFile = await fileToImageFile(file);
        onSelect(imageFile);
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }
    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  if (image) {
    return (
      <div className="relative w-28 h-20 group">
        <img
          src={URL.createObjectURL(image.file)}
          alt="preview"
          className="w-full h-full object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove image">
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="w-28 h-20 bg-[var(--sxl-navy)]/50 hover:bg-[var(--sxl-navy)] border-2 border-dashed border-[var(--sxl-lightest-navy)] rounded-lg flex flex-col items-center justify-center text-[var(--sxl-slate)] hover:text-white transition-colors">
      <PlusIcon className="w-6 h-6" />
      <span className="text-xs mt-1">{label}</span>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </button>
  );
};

const VideoUpload: React.FC<{
  onSelect: (video: VideoFile) => void;
  onRemove?: () => void;
  video?: VideoFile | null;
  label: React.ReactNode;
}> = ({onSelect, onRemove, video, label}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const videoFile = await fileToVideoFile(file);
        onSelect(videoFile);
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }
  };

  if (video) {
    return (
      <div className="relative w-48 h-28 group">
        <video
          src={URL.createObjectURL(video.file)}
          muted
          loop
          className="w-full h-full object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove video">
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="w-48 h-28 bg-[var(--sxl-navy)]/50 hover:bg-[var(--sxl-navy)] border-2 border-dashed border-[var(--sxl-lightest-navy)] rounded-lg flex flex-col items-center justify-center text-[var(--sxl-slate)] hover:text-white transition-colors text-center">
      <PlusIcon className="w-6 h-6" />
      <span className="text-xs mt-1 px-2">{label}</span>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />
    </button>
  );
};

interface PromptFormProps {
  onGenerate: (params: GenerateVideoParams) => void;
  initialValues?: GenerateVideoParams | null;
}

const PromptForm: React.FC<PromptFormProps> = ({
  onGenerate,
  initialValues,
}) => {
  const [prompt, setPrompt] = useState(initialValues?.prompt ?? '');
  const [trackingNumber, setTrackingNumber] = useState(
    initialValues?.trackingNumber ?? '',
  );
  const [model, setModel] = useState<VeoModel>(
    initialValues?.model ?? VeoModel.VEO_FAST,
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    initialValues?.aspectRatio ?? AspectRatio.LANDSCAPE,
  );
  const [resolution, setResolution] = useState<Resolution>(
    initialValues?.resolution ?? Resolution.P720,
  );
  const [generationMode, setGenerationMode] = useState<GenerationMode>(
    initialValues?.mode ?? GenerationMode.TEXT_TO_VIDEO,
  );
  const [startFrame, setStartFrame] = useState<ImageFile | null>(
    initialValues?.startFrame ?? null,
  );
  const [endFrame, setEndFrame] = useState<ImageFile | null>(
    initialValues?.endFrame ?? null,
  );
  const [referenceImages, setReferenceImages] = useState<ImageFile[]>(
    initialValues?.referenceImages ?? [],
  );
  const [styleImage, setStyleImage] = useState<ImageFile | null>(
    initialValues?.styleImage ?? null,
  );
  const [inputVideo, setInputVideo] = useState<VideoFile | null>(
    initialValues?.inputVideo ?? null,
  );
  const [inputVideoObject, setInputVideoObject] = useState<Video | null>(
    initialValues?.inputVideoObject ?? null,
  );
  const [isLooping, setIsLooping] = useState(initialValues?.isLooping ?? false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modeSelectorRef = useRef<HTMLDivElement>(null);

  // Sync state with initialValues prop when it changes (e.g., for "Extend" or "Try Again")
  useEffect(() => {
    if (initialValues) {
      setPrompt(initialValues.prompt ?? '');
      setTrackingNumber(initialValues.trackingNumber ?? '');
      setModel(initialValues.model ?? VeoModel.VEO_FAST);
      setAspectRatio(initialValues.aspectRatio ?? AspectRatio.LANDSCAPE);
      setResolution(initialValues.resolution ?? Resolution.P720);
      setGenerationMode(initialValues.mode ?? GenerationMode.TEXT_TO_VIDEO);
      setStartFrame(initialValues.startFrame ?? null);
      setEndFrame(initialValues.endFrame ?? null);
      setReferenceImages(initialValues.referenceImages ?? []);
      setStyleImage(initialValues.styleImage ?? null);
      setInputVideo(initialValues.inputVideo ?? null);
      setInputVideoObject(initialValues.inputVideoObject ?? null);
      setIsLooping(initialValues.isLooping ?? false);
    }
  }, [initialValues]);

  useEffect(() => {
    if (generationMode === GenerationMode.REFERENCES_TO_VIDEO) {
      setModel(VeoModel.VEO);
      setAspectRatio(AspectRatio.LANDSCAPE);
      setResolution(Resolution.P720);
    } else if (generationMode === GenerationMode.EXTEND_VIDEO) {
      setResolution(Resolution.P720);
    }
  }, [generationMode]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [prompt]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modeSelectorRef.current &&
        !modeSelectorRef.current.contains(event.target as Node)
      ) {
        setIsModeSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onGenerate({
        prompt,
        trackingNumber,
        model,
        aspectRatio,
        resolution,
        mode: generationMode,
        startFrame,
        endFrame,
        referenceImages,
        styleImage,
        inputVideo,
        inputVideoObject,
        isLooping,
      });
    },
    [
      prompt,
      trackingNumber,
      model,
      aspectRatio,
      resolution,
      generationMode,
      startFrame,
      endFrame,
      referenceImages,
      styleImage,
      inputVideo,
      inputVideoObject,
      onGenerate,
      isLooping,
    ],
  );

  const handleSelectMode = (mode: GenerationMode) => {
    setGenerationMode(mode);
    setIsModeSelectorOpen(false);
    // Reset media when mode changes to avoid confusion
    setStartFrame(null);
    setEndFrame(null);
    setReferenceImages([]);
    setStyleImage(null);
    setInputVideo(null);
    setInputVideoObject(null);
    setIsLooping(false);
  };

  const promptPlaceholder = {
    [GenerationMode.TEXT_TO_VIDEO]:
      'Describe your shipment (e.g., "a box from Kampala to Gulu")...',
    [GenerationMode.FRAMES_TO_VIDEO]:
      'Describe the journey between origin and destination (optional)...',
    [GenerationMode.REFERENCES_TO_VIDEO]:
      'Describe special handling needs for the pictured items...',
    [GenerationMode.EXTEND_VIDEO]:
      'Describe the next stop or leg of the journey (optional)...',
  }[generationMode];

  const selectableModes = [
    GenerationMode.TEXT_TO_VIDEO,
    GenerationMode.FRAMES_TO_VIDEO,
    GenerationMode.REFERENCES_TO_VIDEO,
  ];

  const renderMediaUploads = () => {
    if (generationMode === GenerationMode.FRAMES_TO_VIDEO) {
      return (
        <div className="mb-3 p-4 bg-[var(--sxl-navy)] rounded-xl border border-[var(--sxl-lightest-navy)] flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-4">
            <ImageUpload
              label="Origin"
              image={startFrame}
              onSelect={setStartFrame}
              onRemove={() => {
                setStartFrame(null);
                setIsLooping(false); // Can't loop without an origin
              }}
            />
            <ArrowRightIcon className="w-8 h-8 text-[var(--sxl-slate)] shrink-0" />
            <ImageUpload
              label="Destination"
              image={endFrame}
              onSelect={(image) => {
                setEndFrame(image);
                setIsLooping(false); // Explicit destination overrides looping
              }}
              onRemove={() => setEndFrame(null)}
            />
          </div>
          {startFrame && !endFrame && (
            <div className="mt-3 flex items-center">
              <input
                id="loop-video-checkbox"
                type="checkbox"
                checked={isLooping}
                onChange={(e) => setIsLooping(e.target.checked)}
                className="w-4 h-4 text-[var(--sxl-blue)] bg-[var(--sxl-light-navy)] border-[var(--sxl-lightest-navy)] rounded focus:ring-[var(--sxl-orange)] focus:ring-offset-[var(--sxl-navy)] cursor-pointer"
              />
              <label
                htmlFor="loop-video-checkbox"
                className="ml-2 text-sm font-medium text-[var(--sxl-light-slate)] cursor-pointer">
                Plan a round trip
              </label>
            </div>
          )}
        </div>
      );
    }
    if (generationMode === GenerationMode.REFERENCES_TO_VIDEO) {
      return (
        <div className="mb-3 p-4 bg-[var(--sxl-navy)] rounded-xl border border-[var(--sxl-lightest-navy)] flex flex-wrap items-center justify-center gap-2">
          {referenceImages.map((img, index) => (
            <ImageUpload
              key={index}
              image={img}
              label=""
              onSelect={() => {}}
              onRemove={() =>
                setReferenceImages((imgs) => imgs.filter((_, i) => i !== index))
              }
            />
          ))}
          {referenceImages.length < 3 && (
            <ImageUpload
              label="Add Item Photo"
              onSelect={(img) => setReferenceImages((imgs) => [...imgs, img])}
            />
          )}
        </div>
      );
    }
    if (generationMode === GenerationMode.EXTEND_VIDEO) {
      return (
        <div className="mb-3 p-4 bg-[var(--sxl-navy)] rounded-xl border border-[var(--sxl-lightest-navy)] flex items-center justify-center gap-4">
          <VideoUpload
            label={
              <>
                Previous Journey
                <br />
                (must be SQ generated)
              </>
            }
            video={inputVideo}
            onSelect={setInputVideo}
            onRemove={() => {
              setInputVideo(null);
              setInputVideoObject(null);
            }}
          />
        </div>
      );
    }
    return null;
  };

  const isRefMode = generationMode === GenerationMode.REFERENCES_TO_VIDEO;
  const isExtendMode = generationMode === GenerationMode.EXTEND_VIDEO;

  let isSubmitDisabled = false;
  let tooltipText = '';

  switch (generationMode) {
    case GenerationMode.TEXT_TO_VIDEO:
      isSubmitDisabled = !prompt.trim();
      if (isSubmitDisabled) {
        tooltipText = 'Please enter a shipment description.';
      }
      break;
    case GenerationMode.FRAMES_TO_VIDEO:
      isSubmitDisabled = !startFrame;
      if (isSubmitDisabled) {
        tooltipText = 'An origin photo is required.';
      }
      break;
    case GenerationMode.REFERENCES_TO_VIDEO:
      const hasNoRefs = referenceImages.length === 0;
      const hasNoPrompt = !prompt.trim();
      isSubmitDisabled = hasNoRefs || hasNoPrompt;
      if (hasNoRefs && hasNoPrompt) {
        tooltipText = 'Please add item photo(s) and enter a description.';
      } else if (hasNoRefs) {
        tooltipText = 'At least one item photo is required.';
      } else if (hasNoPrompt) {
        tooltipText = 'Please enter a description.';
      }
      break;
    case GenerationMode.EXTEND_VIDEO:
      isSubmitDisabled = !inputVideoObject;
      if (isSubmitDisabled) {
        tooltipText =
          'An existing journey visualization is required to add a stop.';
      }
      break;
  }

  return (
    <div className="relative w-full">
      {isSettingsOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-3 p-4 bg-[var(--sxl-navy)] rounded-xl border border-[var(--sxl-lightest-navy)] shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomSelect
              label="Freight Type"
              value={model}
              onChange={(e) => setModel(e.target.value as VeoModel)}
              icon={<SparklesIcon className="w-5 h-5 text-[var(--sxl-slate)]" />}
              disabled={isRefMode}>
              {Object.values(VeoModel).map((modelValue) => (
                <option key={modelValue} value={modelValue}>
                  {modelDisplayNames[modelValue]}
                </option>
              ))}
            </CustomSelect>
            <CustomSelect
              label="Viewpoint"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              icon={
                <RectangleStackIcon className="w-5 h-5 text-[var(--sxl-slate)]" />
              }
              disabled={isRefMode || isExtendMode}>
              {Object.entries(aspectRatioDisplayNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </CustomSelect>
            <div>
              <CustomSelect
                label="Quality"
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                icon={<TvIcon className="w-5 h-5 text-[var(--sxl-slate)]" />}
                disabled={isRefMode || isExtendMode}>
                <option value={Resolution.P720}>
                  {resolutionDisplayNames[Resolution.P720]}
                </option>
                <option value={Resolution.P1080}>
                  {resolutionDisplayNames[Resolution.P1080]}
                </option>
              </CustomSelect>
              {resolution === Resolution.P1080 && (
                <p className="text-xs text-yellow-400/80 mt-2">
                  HD visualizations can't be extended.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative mb-3">
          <label
            htmlFor="tracking-number"
            className="text-xs block mb-1.5 font-medium text-[var(--sxl-slate)]">
            Shipment Tracking Number (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <TicketIcon className="w-5 h-5 text-[var(--sxl-slate)]" />
            </div>
            <input
              id="tracking-number"
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g., SX-UG-1988-KLA"
              className="w-full bg-[var(--sxl-navy)] border border-[var(--sxl-lightest-navy)] rounded-lg pl-10 pr-4 py-2.5 focus:ring-1 focus:ring-[var(--sxl-orange)] focus:border-[var(--sxl-orange)]"
            />
          </div>
        </div>
        {renderMediaUploads()}
        <div className="flex items-end gap-2 bg-[var(--sxl-navy)] border border-[var(--sxl-lightest-navy)] rounded-2xl p-2 shadow-lg focus-within:ring-2 focus-within:ring-[var(--sxl-orange)]">
          <div className="relative" ref={modeSelectorRef}>
            <button
              type="button"
              onClick={() => setIsModeSelectorOpen((prev) => !prev)}
              className="flex shrink-0 items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-[var(--sxl-lightest-navy)] text-[var(--sxl-light-slate)] hover:text-white transition-colors"
              aria-label="Select generation mode">
              {modeIcons[generationMode]}
              <span className="font-medium text-sm whitespace-nowrap">
                {modeDisplayNames[generationMode]}
              </span>
            </button>
            {isModeSelectorOpen && (
              <div className="absolute bottom-full mb-2 w-60 bg-[var(--sxl-navy)] border border-[var(--sxl-lightest-navy)] rounded-lg shadow-xl overflow-hidden z-10">
                {selectableModes.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleSelectMode(mode)}
                    className={`w-full text-left flex items-center gap-3 p-3 hover:bg-[var(--sxl-blue)]/50 ${
                      generationMode === mode
                        ? 'bg-[var(--sxl-blue)]/30 text-white'
                        : 'text-[var(--sxl-light-slate)]'
                    }`}>
                    {modeIcons[mode]}
                    <span>{modeDisplayNames[mode]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={promptPlaceholder}
            className="flex-grow bg-transparent focus:outline-none resize-none text-base text-[var(--sxl-lightest-slate)] placeholder-[var(--sxl-slate)] max-h-48 py-2"
            rows={1}
          />
          <button
            type="button"
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            className={`p-2.5 rounded-full hover:bg-[var(--sxl-lightest-navy)] ${
              isSettingsOpen
                ? 'bg-[var(--sxl-lightest-navy)] text-white'
                : 'text-[var(--sxl-light-slate)]'
            }`}
            aria-label="Toggle settings">
            <SlidersHorizontalIcon className="w-5 h-5" />
          </button>
          <div className="relative group">
            <button
              type="submit"
              className="p-2.5 bg-[var(--sxl-blue)] rounded-full hover:bg-[var(--sxl-blue)/90] disabled:bg-[var(--sxl-lightest-navy)] disabled:cursor-not-allowed"
              aria-label="Generate video"
              disabled={isSubmitDisabled}>
              <ArrowRightIcon className="w-5 h-5 text-white" />
            </button>
            {isSubmitDisabled && tooltipText && (
              <div
                role="tooltip"
                className="absolute bottom-full right-0 mb-2 w-max max-w-xs px-3 py-1.5 bg-[var(--sxl-dark-navy)] border border-[var(--sxl-lightest-navy)] text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {tooltipText}
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-[var(--sxl-slate)] text-center mt-2 px-4">
          Semliner Xpress Logistics &mdash; Bakaluba Mall B31 & B32, Central
          Region, Uganda.
          <br />
          Shipment visualization is a premium feature for registered partners.
        </p>
      </form>
    </div>
  );
};

export default PromptForm;

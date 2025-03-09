import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import ColorPicker from './ColorPicker';
import type { CanvasElement } from '../lib/types';

interface ElementPropertiesProps {
  element: CanvasElement;
  onChange: (element: CanvasElement) => void;
}

export default function ElementProperties({ element, onChange }: ElementPropertiesProps) {
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleOpacityChange = (value: number[]) => {
    onChange({
      ...element,
      opacity: value[0],
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Here you would typically upload to your storage service
      // For now, we'll use a placeholder URL
      onChange({
        ...element,
        content: {
          ...element.content,
          imageUrl: URL.createObjectURL(file),
        },
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Opacity
        </label>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[element.opacity]}
          max={1}
          step={0.01}
          onValueChange={handleOpacityChange}
        >
          <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-4 h-4 bg-white border border-gray-300 shadow-sm rounded-full hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Opacity"
          />
        </Slider.Root>
      </div>

      {element.type === 'text' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <input
              type="number"
              value={element.content.fontSize}
              onChange={(e) => {
                onChange({
                  ...element,
                  content: {
                    ...element.content,
                    fontSize: Number(e.target.value),
                  },
                });
              }}
              className="w-full rounded-md border-gray-300"
            />
          </div>
          <ColorPicker
            label="Color"
            color={element.content.color || '#000000'}
            onChange={(color) => {
              onChange({
                ...element,
                content: {
                  ...element.content,
                  color,
                },
              });
            }}
          />
        </>
      )}

      {element.type === 'shape' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shape
            </label>
            <select
              value={element.content.shape}
              onChange={(e) => {
                onChange({
                  ...element,
                  content: {
                    ...element.content,
                    shape: e.target.value as 'rectangle' | 'circle',
                  },
                });
              }}
              className="w-full rounded-md border-gray-300"
            >
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
            </select>
          </div>
          <ColorPicker
            label="Fill Color"
            color={element.content.backgroundColor || '#e2e8f0'}
            onChange={(color) => {
              onChange({
                ...element,
                content: {
                  ...element.content,
                  backgroundColor: color,
                },
              });
            }}
          />
          <ColorPicker
            label="Border Color"
            color={element.content.borderColor || '#64748b'}
            onChange={(color) => {
              onChange({
                ...element,
                content: {
                  ...element.content,
                  borderColor: color,
                },
              });
            }}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Width
            </label>
            <input
              type="number"
              value={element.content.borderWidth}
              onChange={(e) => {
                onChange({
                  ...element,
                  content: {
                    ...element.content,
                    borderWidth: Number(e.target.value),
                  },
                });
              }}
              className="w-full rounded-md border-gray-300"
            />
          </div>
        </>
      )}

      {element.type === 'image' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Replace Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      )}
    </div>
  );
}
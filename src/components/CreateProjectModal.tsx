import { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { projectsApi } from '../lib/api';
import type { ProjectFormat } from '../lib/types';

const PRESET_SIZES = [
  { name: 'Facebook Ad', width: 1200, height: 628 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Twitter Post', width: 1600, height: 900 },
  { name: 'Display Banner', width: 728, height: 90 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
];

const FORMAT_OPTIONS: { value: ProjectFormat; label: string }[] = [
  { value: 'banner', label: 'Static Banner (PNG/JPG)' },
  { value: 'video', label: 'Animated Banner (MP4)' },
  { value: 'svg', label: 'Vector Banner (SVG)' },
  { value: 'html', label: 'Interactive Banner (HTML)' },
];

interface CreateProjectModalProps {
  onClose: () => void;
  onSuccess: (projectId: string) => void;
}

export default function CreateProjectModal({ onClose, onSuccess }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(628);
  const [format, setFormat] = useState<ProjectFormat>('banner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePresetSelect = (preset: typeof PRESET_SIZES[0]) => {
    setWidth(preset.width);
    setHeight(preset.height);
    if (!name) setName(preset.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const project = await projectsApi.create({
        name,
        description: description || undefined,
        width,
        height,
        format,
      });
      onSuccess(project.id);
    } catch (err) {
      console.error(err);
      setError('Failed to create project');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Create New Project</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preset Sizes
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PRESET_SIZES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className="p-3 border rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-gray-500">
                      {preset.width} × {preset.height}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                  Width (px)
                </label>
                <input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                  Height (px)
                </label>
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                Format
              </label>
              <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value as ProjectFormat)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {FORMAT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
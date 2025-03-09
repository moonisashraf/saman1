import { useState, useRef, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(color);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="flex items-center space-x-2">
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className="w-8 h-8 rounded border shadow-sm"
            style={{ backgroundColor: currentColor }}
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="bg-white rounded-lg shadow-xl p-3 w-56" sideOffset={5}>
            <input
              ref={inputRef}
              type="color"
              value={currentColor}
              onChange={handleChange}
              className="w-full h-32"
            />
            <Popover.Arrow className="fill-white" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
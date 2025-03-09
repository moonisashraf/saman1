import { useRef, useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';
import type { CanvasElement } from '../lib/types';

interface CanvasElementProps {
  element: CanvasElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (element: CanvasElement) => void;
}

export default function CanvasElement({ element, selected, onSelect, onChange }: CanvasElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      setDragStart({ x: startAngle, y: element.rotation });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!elementRef.current || isEditing) return;

    const rect = elementRef.current.parentElement?.getBoundingClientRect();
    if (!rect) return;

    if (isDragging) {
      const newX = e.clientX - rect.left - dragStart.x;
      const newY = e.clientY - rect.top - dragStart.y;

      const constrainedX = Math.max(0, Math.min(newX, rect.width - element.width));
      const constrainedY = Math.max(0, Math.min(newY, rect.height - element.height));

      onChange({
        ...element,
        x: constrainedX,
        y: constrainedY,
      });
    } else if (isResizing && resizeHandle) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      let newWidth = element.width;
      let newHeight = element.height;
      let newX = element.x;
      let newY = element.y;

      if (resizeHandle.includes('e')) newWidth = Math.max(20, element.width + deltaX);
      if (resizeHandle.includes('w')) {
        const maxDeltaX = element.width - 20;
        const actualDeltaX = Math.max(-maxDeltaX, Math.min(deltaX, element.x));
        newWidth = element.width - actualDeltaX;
        newX = element.x + actualDeltaX;
      }
      if (resizeHandle.includes('s')) newHeight = Math.max(20, element.height + deltaY);
      if (resizeHandle.includes('n')) {
        const maxDeltaY = element.height - 20;
        const actualDeltaY = Math.max(-maxDeltaY, Math.min(deltaY, element.y));
        newHeight = element.height - actualDeltaY;
        newY = element.y + actualDeltaY;
      }

      setDragStart({ x: e.clientX, y: e.clientY });
      onChange({
        ...element,
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      });
    } else if (isRotating) {
      const centerX = rect.left + element.width / 2;
      const centerY = rect.top + element.height / 2;
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const deltaAngle = (currentAngle - dragStart.x) * (180 / Math.PI);
      const newRotation = (dragStart.y + deltaAngle) % 360;

      onChange({
        ...element,
        rotation: newRotation,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    setResizeHandle(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selected) {
      onSelect();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === 'text' && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...element,
      content: {
        ...element.content,
        text: e.target.value,
      },
    });
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing || isRotating) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isRotating, dragStart, resizeHandle]);

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return isEditing ? (
          <textarea
            value={element.content.text}
            onChange={handleTextChange}
            onBlur={handleBlur}
            autoFocus
            className="w-full h-full resize-none border-none bg-transparent outline-none text-center"
            style={{
              fontSize: element.content.fontSize,
              fontFamily: element.content.fontFamily,
              color: element.content.color,
              lineHeight: '1.2',
              padding: '4px',
            }}
          />
        ) : (
          <div
            style={{
              fontSize: element.content.fontSize,
              fontFamily: element.content.fontFamily,
              color: element.content.color,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              cursor: 'text',
            }}
          >
            {element.content.text}
          </div>
        );
      case 'shape':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.content.backgroundColor,
              border: `${element.content.borderWidth}px solid ${element.content.borderColor}`,
              borderRadius: element.content.shape === 'circle' ? '50%' : '0',
            }}
          />
        );
      case 'image':
        return (
          <img
            src={element.content.imageUrl}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
            }}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop';
            }}
          />
        );
      default:
        return null;
    }
  };

  const resizeHandles = [
    { position: 'nw', cursor: 'nw-resize', className: '-left-1 -top-1' },
    { position: 'n', cursor: 'n-resize', className: 'left-1/2 -translate-x-1/2 -top-1' },
    { position: 'ne', cursor: 'ne-resize', className: '-right-1 -top-1' },
    { position: 'w', cursor: 'w-resize', className: '-left-1 top-1/2 -translate-y-1/2' },
    { position: 'e', cursor: 'e-resize', className: '-right-1 top-1/2 -translate-y-1/2' },
    { position: 'sw', cursor: 'sw-resize', className: '-left-1 -bottom-1' },
    { position: 's', cursor: 's-resize', className: 'left-1/2 -translate-x-1/2 -bottom-1' },
    { position: 'se', cursor: 'se-resize', className: '-right-1 -bottom-1' },
  ];

  return (
    <div
      ref={elementRef}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        opacity: element.opacity,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: selected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className="group"
    >
      {renderContent()}
      {selected && (
        <>
          <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-blue-600 rounded pointer-events-none" />
          {resizeHandles.map(({ position, cursor, className }) => (
            <div
              key={position}
              className={`absolute w-2 h-2 bg-white border-2 border-blue-600 rounded-sm ${className}`}
              style={{ cursor }}
              onMouseDown={(e) => handleResizeStart(e, position)}
            />
          ))}
          <button
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full border-2 border-blue-600 flex items-center justify-center hover:bg-blue-50"
            onMouseDown={handleRotateStart}
          >
            <RotateCw className="w-3 h-3 text-blue-600" />
          </button>
        </>
      )}
    </div>
  );
}
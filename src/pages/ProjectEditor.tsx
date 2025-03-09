import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Undo, Redo, Save, ArrowLeft, Plus, Image, Type, Square, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import CanvasElement from '../components/CanvasElement';
import ElementProperties from '../components/ElementProperties';
import { projectsApi } from '../lib/api';
import type { Project, CanvasElement as CanvasElementType } from '../lib/types';

const MAX_HISTORY_LENGTH = 50;

export default function ProjectEditor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [elements, setElements] = useState<CanvasElementType[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // History management
  const [history, setHistory] = useState<CanvasElementType[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  // Add to history when elements change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), elements];
      if (newHistory.length > MAX_HISTORY_LENGTH) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [elements]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            handleUndo();
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement && !isEditingText()) {
          e.preventDefault();
          handleDeleteElement();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, history, historyIndex]);

  const isEditingText = () => {
    return document.activeElement?.tagName.toLowerCase() === 'textarea';
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  async function loadProject(id: string) {
    try {
      const data = await projectsApi.getById(id);
      setProject(data);
      const initialElements = data.content?.elements || [];
      setElements(initialElements);
      setHistory([initialElements]);
      setHistoryIndex(0);
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!project) return;
    setSaving(true);
    try {
      await projectsApi.update(project.id, {
        content: { elements },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const addElement = (type: CanvasElementType['type']) => {
    const newElement: CanvasElementType = {
      id: crypto.randomUUID(),
      type,
      x: 50,
      y: 50,
      width: 200,
      height: type === 'text' ? 50 : 200,
      rotation: 0,
      opacity: 1,
      content: type === 'text'
        ? {
            text: 'Double click to edit',
            fontSize: 24,
            fontFamily: 'Arial',
            color: '#000000',
          }
        : type === 'shape'
        ? {
            shape: 'rectangle',
            backgroundColor: '#e2e8f0',
            borderColor: '#64748b',
            borderWidth: 2,
          }
        : {
            imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
          },
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateElement = (updatedElement: CanvasElementType) => {
    setElements(elements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    ));
  };

  const handleDeleteElement = () => {
    if (selectedElement) {
      setElements(elements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const selectedElementData = elements.find(el => el.id === selectedElement);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">{project.name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="w-64 bg-white border-r p-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => addElement('text')}
            >
              <Type className="h-4 w-4 mr-2" />
              Add Text
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => addElement('shape')}
            >
              <Square className="h-4 w-4 mr-2" />
              Add Shape
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => addElement('image')}
            >
              <Image className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>
        </div>

        <div className="flex-1 p-8">
          <div
            ref={canvasRef}
            className="bg-white rounded-lg shadow-lg mx-auto"
            style={{
              width: project.width,
              height: project.height,
              position: 'relative',
            }}
            onClick={handleCanvasClick}
          >
            {elements.map(element => (
              <CanvasElement
                key={element.id}
                element={element}
                selected={element.id === selectedElement}
                onSelect={() => setSelectedElement(element.id)}
                onChange={updateElement}
              />
            ))}
          </div>
        </div>

        <div className="w-80 bg-white border-l p-4">
          {selectedElementData ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Element Properties</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteElement}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <ElementProperties
                element={selectedElementData}
                onChange={updateElement}
              />
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="font-medium text-sm text-gray-700 mb-2">Canvas Size</h3>
                <div className="text-sm text-gray-600">
                  {project.width} × {project.height}px
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-700 mb-2">History</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
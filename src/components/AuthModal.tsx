import { X } from 'lucide-react';
import AuthForm from './AuthForm';

interface AuthModalProps {
  type: 'login' | 'signup';
  onClose: () => void;
}

export default function AuthModal({ type, onClose }: AuthModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-6">
          {type === 'signup' ? 'Create an Account' : 'Welcome Back'}
        </h2>
        <AuthForm type={type} onSuccess={onClose} />
      </div>
    </div>
  );
}
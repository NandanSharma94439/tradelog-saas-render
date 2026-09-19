import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl', '4xl': 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className={`w-full ${widthClasses[maxWidth]} glass-panel rounded-2xl border border-dark-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
            <h3 className="text-lg font-bold text-dark-text tracking-tight">{title}</h3>
            <button onClick={onClose} className="text-dark-muted hover:text-dark-text p-1 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

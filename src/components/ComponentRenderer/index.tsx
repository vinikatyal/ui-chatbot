import React, { Suspense, lazy } from 'react';
import type { ComponentRendererProps } from '@/types/interfaces';

type LibraryType = 'mui' | 'antd' | 'tailwind';

// Check which libraries are available
const INSTALLED_LIBRARIES = {
  mui: true,
  antd: true,
  tailwind: true,
};

// ======================
// MATERIAL-UI COMPONENTS
// ======================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const muiComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = INSTALLED_LIBRARIES.mui ? {
  button: lazy(() => import('@mui/material/Button')),
  textfield: lazy(() => import('@mui/material/TextField')),
  card: lazy(() => import('@mui/material/Card')),
  chip: lazy(() => import('@mui/material/Chip')),
  switch: lazy(() => import('@mui/material/Switch')),
} : {};

// =======================
// ANT DESIGN COMPONENTS
// =======================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const antdComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = INSTALLED_LIBRARIES.antd ? {
  button: lazy(() => import('antd/es/button')),
  input: lazy(() => import('antd/es/input')),
  card: lazy(() => import('antd/es/card')),
  tag: lazy(() => import('antd/es/tag')),
  switch: lazy(() => import('antd/es/switch')),
} : {};

// ========================
// TAILWIND CUSTOM COMPONENTS
// ========================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tailwindComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = INSTALLED_LIBRARIES.tailwind ? {
  button: lazy(() => import('@/components/UIComponents/Button').then(module => ({ default: module.Button }))),
  chatbubble: lazy(() => import('@/components/UIComponents/ChatBubble').then(module => ({ default: module.ChatBubble }))),
  input: lazy(() => import('@/components/UIComponents/Input').then(module => ({ default: module.Input }))),
} : {};

// Component map by library
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const libraryComponentMap: Record<LibraryType, Record<string, React.LazyExoticComponent<React.ComponentType<any>>>> = {
  mui: muiComponents,
  antd: antdComponents,
  tailwind: tailwindComponents,
};

// Library display names and colors
const libraryConfig = {
  mui: { name: 'Material-UI', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  antd: { name: 'Ant Design', color: 'text-red-600', bgColor: 'bg-red-50' },
  tailwind: { name: 'Tailwind', color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
};

const LoadingFallback = () => (
  <div className="p-3 bg-white rounded shadow-sm animate-pulse">
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

const ErrorFallback: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-3 bg-red-50 text-red-600 rounded border border-red-200 text-sm">
    {message}
  </div>
);

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ components }) => {
  console.log('ComponentRenderer received:', components);

  if (!components || components.length === 0) {
    console.log('No components to render');
    return null;
  }

  return (
    <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
      {components.map((comp) => {
        const library = (comp.library || 'tailwind') as LibraryType;

        console.log(`🔍 Processing component:`, {
          type: comp.type,
          library: library,
          availableInMap: Object.keys(libraryComponentMap[library])
        });

        // Check if library is installed
        if (!INSTALLED_LIBRARIES[library]) {
          return (
            <ErrorFallback
              key={comp.id}
              message={`Library "${library}" is not installed. Install it with: npm install ${library === 'mui' ? '@mui/material @emotion/react @emotion/styled' : library
                }`}
            />
          );
        }

        // Get component map for the library
        const componentMap = libraryComponentMap[library];

        // Use lowercase type directly
        const componentType = comp.type.toLowerCase();
        const Component = componentMap[componentType];

        if (!Component) {
          return (
            <ErrorFallback
              key={comp.id}
              message={`Component "${comp.type}" not found in ${library} library. Available: ${Object.keys(componentMap).join(', ')}`}
            />
          );
        }

        const config = libraryConfig[library];
        const displayName = comp.type.charAt(0).toUpperCase() + comp.type.slice(1);

        return (
          <div key={comp.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Library Badge */}
            <div className={`px-3 py-1.5 ${config.bgColor} border-b border-gray-200 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${config.color}`}>
                  {config.name}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-600 font-mono">
                  {displayName}
                </span>
              </div>
            </div>

            {/* Component Preview */}
            <div className="p-4">
              <Suspense fallback={<LoadingFallback />}>
                <Component {...comp.props} />
              </Suspense>
            </div>
          </div>
        );
      })}
    </div>
  );
};
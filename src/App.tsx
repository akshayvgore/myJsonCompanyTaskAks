import React from 'react';
import { SchemaBuilder } from './components/SchemaBuilder';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <>
      <SchemaBuilder />
      <Toaster />
    </>
  );
}

export default App;
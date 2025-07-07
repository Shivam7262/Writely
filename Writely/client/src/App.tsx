import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';

// Components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import DocumentForm from './pages/documents/DocumentForm';

function App() {
  return (
    <AuthProvider>
      <DocumentProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/documents/new" element={<DocumentForm />} />
                  <Route path="/documents/:id" element={<DocumentForm />} />
                </Route>
              </Routes>
            </div>
          </main>
        </div>
      </DocumentProvider>
    </AuthProvider>
  );
}

export default App;

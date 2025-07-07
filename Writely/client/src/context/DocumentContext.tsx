import React, { createContext, useContext, useReducer } from 'react';
import { DocumentState, Document } from '../types';
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../services/documentService';

interface DocumentContextProps {
  state: DocumentState;
  fetchDocuments: () => Promise<void>;
  fetchDocument: (id: string) => Promise<void>;
  addDocument: (title: string, content: string) => Promise<void>;
  editDocument: (id: string, title: string, content: string) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
  clearCurrentDocument: () => void;
  clearError: () => void;
}

type DocumentAction =
  | { type: 'GET_DOCUMENTS'; payload: Document[] }
  | { type: 'GET_DOCUMENT'; payload: Document }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'DOCUMENT_ERROR'; payload: string }
  | { type: 'CLEAR_CURRENT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING' };

const initialState: DocumentState = {
  documents: [],
  currentDocument: null,
  loading: false,
  error: null,
};

const documentReducer = (state: DocumentState, action: DocumentAction): DocumentState => {
  switch (action.type) {
    case 'GET_DOCUMENTS':
      return {
        ...state,
        documents: action.payload,
        loading: false,
      };
    case 'GET_DOCUMENT':
      return {
        ...state,
        currentDocument: action.payload,
        loading: false,
      };
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [action.payload, ...state.documents],
        loading: false,
      };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map((document) =>
          document._id === action.payload._id ? action.payload : document
        ),
        currentDocument: action.payload,
        loading: false,
      };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter((document) => document._id !== action.payload),
        loading: false,
      };
    case 'DOCUMENT_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_CURRENT':
      return {
        ...state,
        currentDocument: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

const DocumentContext = createContext<DocumentContextProps | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  // Get all documents
  const fetchDocuments = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await getDocuments();
      dispatch({ type: 'GET_DOCUMENTS', payload: res.data });
    } catch (err: any) {
      dispatch({
        type: 'DOCUMENT_ERROR',
        payload: err.response?.data?.error || 'Error fetching documents',
      });
    }
  };

  // Get a single document
  const fetchDocument = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await getDocument(id);
      dispatch({ type: 'GET_DOCUMENT', payload: res.data });
    } catch (err: any) {
      dispatch({
        type: 'DOCUMENT_ERROR',
        payload: err.response?.data?.error || 'Error fetching document',
      });
    }
  };

  // Add a document
  const addDocument = async (title: string, content: string) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await createDocument({ title, content });
      dispatch({ type: 'ADD_DOCUMENT', payload: res.data });
    } catch (err: any) {
      dispatch({
        type: 'DOCUMENT_ERROR',
        payload: err.response?.data?.error || 'Error adding document',
      });
    }
  };

  // Update a document
  const editDocument = async (id: string, title: string, content: string) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await updateDocument(id, { title, content });
      dispatch({ type: 'UPDATE_DOCUMENT', payload: res.data });
    } catch (err: any) {
      dispatch({
        type: 'DOCUMENT_ERROR',
        payload: err.response?.data?.error || 'Error updating document',
      });
    }
  };

  // Delete a document
  const removeDocument = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await deleteDocument(id);
      dispatch({ type: 'DELETE_DOCUMENT', payload: id });
    } catch (err: any) {
      dispatch({
        type: 'DOCUMENT_ERROR',
        payload: err.response?.data?.error || 'Error deleting document',
      });
    }
  };

  // Clear current document
  const clearCurrentDocument = () => {
    dispatch({ type: 'CLEAR_CURRENT' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <DocumentContext.Provider
      value={{
        state,
        fetchDocuments,
        fetchDocument,
        addDocument,
        editDocument,
        removeDocument,
        clearCurrentDocument,
        clearError,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = (): DocumentContextProps => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
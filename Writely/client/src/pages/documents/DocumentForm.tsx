import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import Alert from '../../components/layout/Alert';

const DocumentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const { state, fetchDocument, addDocument, editDocument, clearCurrentDocument, clearError } = useDocument();
  const { currentDocument, loading, error } = state;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchDocument(id);
    }
    return () => {
      clearCurrentDocument();
    };
    // eslint-disable-next-line
  }, [isEditMode, id]);

  useEffect(() => {
    if (currentDocument && isEditMode) {
      setFormData({
        title: currentDocument.title,
        content: currentDocument.content,
      });
    }
  }, [currentDocument, isEditMode]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditMode && id) {
      await editDocument(id, formData.title, formData.content);
      navigate('/dashboard');
    } else {
      await addDocument(formData.title, formData.content);
      navigate('/dashboard');
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Document' : 'Create New Document'}
      </h1>

      {error && <Alert message={error} onClose={clearError} />}

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Document Title"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={onChange}
            required
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Document Content"
          ></textarea>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            {isEditMode ? 'Update Document' : 'Create Document'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;
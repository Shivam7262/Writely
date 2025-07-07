import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocument } from '../context/DocumentContext';
import Alert from '../components/layout/Alert';

const Dashboard: React.FC = () => {
  const { state, fetchDocuments, removeDocument, clearError } = useDocument();
  const { documents, loading, error } = state;
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [shareDocId, setShareDocId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line
  }, []);

  // Get the 3 most recent documents
  const recentDocuments = documents.slice(0, 3);

  const handleDelete = async (id: string) => {
    if (confirmDelete === id) {
      await removeDocument(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const openShareModal = (id: string) => {
    setShareDocId(id);
    setShareEmail('');
    setShareSuccess('');
  };

  const closeShareModal = () => {
    setShareDocId(null);
    setShareEmail('');
    setShareSuccess('');
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sharing (replace with backend call if needed)
    setShareSuccess(`Document shared with ${shareEmail}!`);
    setTimeout(() => {
      closeShareModal();
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-h-screen overflow-y-auto">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl font-bold mb-2">{documents.length}</span>
          <span className="text-lg font-medium">Total Documents</span>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow p-6 md:col-span-2">
          <span className="block text-lg font-semibold mb-2">Recently Added</span>
          <div className="flex flex-wrap gap-4">
            {recentDocuments.length === 0 ? (
              <span className="text-gray-100">No recent documents</span>
            ) : (
              recentDocuments.map((doc) => (
                <div key={doc._id} className="bg-white text-gray-800 rounded shadow px-4 py-2 flex flex-col min-w-[180px]">
                  <span className="font-bold truncate">{doc.title}</span>
                  <span className="text-xs text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Documents</h1>
        <Link
          to="/documents/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 shadow"
        >
          <span className="inline-block align-middle mr-2">+</span> Create New Document
        </Link>
      </div>

      {error && <Alert message={error} onClose={clearError} />}

      {documents.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">No documents yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first document to get started with your knowledge base.
          </p>
          <Link
            to="/documents/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 inline-block"
          >
            Create Document
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col justify-between"
            >
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2 truncate">{doc.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                  {doc.content.substring(0, 150)}...
                </p>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/documents/${doc._id}`}
                    className="text-blue-600 hover:text-blue-800 transition duration-300 font-medium"
                  >
                    View & Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className={`${confirmDelete === doc._id ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'} px-3 py-1 rounded-md hover:bg-red-700 hover:text-white transition duration-300 ml-2`}
                  >
                    {confirmDelete === doc._id ? 'Confirm Delete' : 'Delete'}
                  </button>
                  <button
                    onClick={() => openShareModal(doc._id)}
                    className="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md transition duration-300"
                  >
                    Share
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-2 text-sm text-gray-500 flex justify-between items-center">
                <span>Created: {new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {shareDocId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={closeShareModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Share Document</h2>
            {shareSuccess ? (
              <div className="text-green-600 font-semibold text-center mb-2">{shareSuccess}</div>
            ) : (
              <form onSubmit={handleShare} className="space-y-4">
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Friend's email"
                  value={shareEmail}
                  onChange={e => setShareEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  Share
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
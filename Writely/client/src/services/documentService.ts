import api from './api';
import { Document } from '../types';

export const getDocuments = async () => {
  const response = await api.get('/documents');
  return response.data;
};

export const getDocument = async (id: string) => {
  const response = await api.get(`/documents/${id}`);
  return response.data;
};

export const createDocument = async (documentData: { title: string; content: string }) => {
  const response = await api.post('/documents', documentData);
  return response.data;
};

export const updateDocument = async (id: string, documentData: { title?: string; content?: string }) => {
  const response = await api.put(`/documents/${id}`, documentData);
  return response.data;
};

export const deleteDocument = async (id: string) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};
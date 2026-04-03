import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle, Clock, ExternalLink } from 'lucide-react';

export default function DocumentCenter() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('Aadhaar Card');
  const [uploading, setUploading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = sessionStorage.getItem('token');

  const DOC_TYPES = ['Aadhaar Card', '10th Memo', '12th Memo', 'Study Certificate', 'Transfer Certificate (TC)', 'Passport Photo'];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/student/documents`, { headers: { Authorization: `Bearer ${token}` } });
      setDocuments(res.data);
    } catch (err) { console.error("Failed to fetch docs:", err); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file to upload.");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    setUploading(true);
    try {
      await axios.post(`${API_URL}/api/student/documents/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      alert('Document Uploaded Successfully!');
      setFile(null);
      fetchDocuments(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Upload Failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* UPLOAD SECTION */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-fit">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Upload Required Documents</h3>
        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
            <select 
              value={documentType} 
              onChange={(e) => setDocumentType(e.target.value)} 
              className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
            >
              {DOC_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select File (PDF/JPG/PNG)</label>
            <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-xl p-8 text-center relative hover:bg-indigo-50 transition-colors">
              <input 
                type="file" 
                accept=".jpg,.jpeg,.png,.pdf" 
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-indigo-900">
                {file ? file.name : "Click to browse or drag file here"}
              </p>
            </div>
          </div>

          <button type="submit" disabled={uploading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center">
            {uploading ? 'Uploading to Cloud...' : 'Upload Document'}
          </button>
        </form>
      </div>

      {/* MY DOCUMENTS SECTION */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6">My Uploaded Documents</h3>
        <div className="space-y-4">
          {documents.length === 0 ? (
            <p className="text-slate-500 text-center py-10">No documents uploaded yet.</p>
          ) : (
            documents.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50 rounded-xl hover:shadow-sm transition-all">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <FileText className="text-indigo-600 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{doc.documentType}</h4>
                    <p className="text-xs text-slate-500 truncate w-32 md:w-48">{doc.fileName}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`flex items-center text-xs font-bold px-3 py-1 rounded-full ${
                    doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                    doc.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {doc.status === 'Verified' ? <CheckCircle size={12} className="mr-1"/> : <Clock size={12} className="mr-1"/>}
                    {doc.status}
                  </span>
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center">
                    View File <ExternalLink size={12} className="ml-1"/>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
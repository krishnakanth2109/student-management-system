import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react';

export default function DocumentManagement() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/admin/documents/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDocuments(); // Refresh the list
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Student Documents</h2>
          <p className="text-slate-500 text-sm">Verify documents uploaded by students.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th className="p-4 font-medium rounded-tl-lg">Student Name</th>
              <th className="p-4 font-medium">Document Type</th>
              <th className="p-4 font-medium">File Link</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center text-slate-500">Loading documents...</td></tr>
            ) : documents.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center text-slate-500">No documents found.</td></tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  
                  {/* Student Details */}
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-800">
                      {doc.studentId ? `${doc.studentId.firstName} ${doc.studentId.lastName}` : 'Unknown Student'}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      ID: {doc.studentId?._id.substring(18)}
                    </p>
                  </td>

                  {/* Doc Type */}
                  <td className="p-4 text-sm font-medium text-indigo-600">
                    {doc.documentType}
                  </td>

                  {/* Cloudinary Link */}
                  <td className="p-4">
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
                      View File <ExternalLink size={14} className="ml-1" />
                    </a>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                      doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                      doc.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {doc.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-4 text-right space-x-2">
                    {doc.status !== 'Verified' && (
                      <button onClick={() => updateStatus(doc._id, 'Verified')} className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-colors" title="Verify">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {doc.status !== 'Rejected' && (
                      <button onClick={() => updateStatus(doc._id, 'Rejected')} className="text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors" title="Reject">
                        <XCircle size={18} />
                      </button>
                    )}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
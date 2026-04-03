import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function FeesPayment() {
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false); // Added for button loading state
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchFees();
  }, []);

  // 1. FETCH FEES FROM BACKEND
  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/student/fees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeesData(res.data.fees || []);
    } catch (err) {
      console.error('Fees fetch error:', err);
      setError('Could not load fee details. Ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // 2. HANDLE PAYMENT SUBMISSION
  const handlePayment = async (feeId, amountToPay) => {
    // Simple confirmation dialog before paying
    if (!window.confirm(`Are you sure you want to process a payment of $${amountToPay}?`)) return;
    
    setPayLoading(true);
    try {
      await axios.post(`${API_URL}/api/student/fees/pay/${feeId}`, 
        { amount: amountToPay }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Payment Successful!');
      fetchFees(); // Refresh the data to show it is now Paid
    } catch (err) {
      console.error('Payment Error:', err);
      alert(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500">
      <Loader2 className="animate-spin w-10 h-10 mr-3 text-indigo-600" /> 
      <span className="text-lg font-medium">Loading fee details...</span>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 flex items-center">
      <AlertCircle className="mr-2" /> {error}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-800">Fee Statement</h2>

      {feesData.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-500">
          <p className="text-lg font-medium">No fees assigned yet.</p>
          <p className="text-sm mt-1">Contact administration if you believe this is an error.</p>
        </div>
      ) : (
        feesData.map((fee) => {
          const totalFee = fee.tuitionFee + fee.labFee + (fee.libraryFee || 0);
          const remaining = totalFee - fee.amountPaid;

          return (
            <div key={fee._id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
              
              {/* Background Decoration for Paid status */}
              {fee.status === 'Paid' && (
                <div className="absolute -right-10 -top-10 text-emerald-50 opacity-50 pointer-events-none">
                  <CheckCircle className="w-48 h-48" />
                </div>
              )}

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Semester {fee.semester}</h3>
                    <p className="text-sm text-slate-500">Academic Year: {fee.academicYear}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${fee.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : fee.status === 'Partial' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    {fee.status}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Tuition Fee</span>
                    <span className="font-bold text-slate-800">${fee.tuitionFee}</span>
                  </div>
                  <div className="flex justify-between text-sm p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Lab & Library Fees</span>
                    <span className="font-bold text-slate-800">${fee.labFee + (fee.libraryFee || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm p-3 bg-emerald-50 rounded-lg text-emerald-700">
                    <span className="font-semibold">Amount Paid</span>
                    <span className="font-bold">${fee.amountPaid}</span>
                  </div>

                  <div className="flex justify-between p-4 bg-slate-100 rounded-xl font-bold text-lg mt-4 border border-slate-200">
                    <span>Total Remaining Due</span>
                    <span className={remaining > 0 ? "text-red-600" : "text-emerald-600"}>${remaining}</span>
                  </div>
                </div>

                {remaining > 0 ? (
                  <button 
                    onClick={() => handlePayment(fee._id, remaining)}
                    disabled={payLoading}
                    className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold flex justify-center items-center hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                  >
                    {payLoading ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <CreditCard className="mr-2" />
                    )}
                    {payLoading ? 'Processing Payment...' : `Pay $${remaining} Now`}
                  </button>
                ) : (
                  <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-600 py-3.5 rounded-xl font-bold flex justify-center items-center">
                    <CheckCircle className="mr-2" /> Fully Paid
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, BookMarked, User } from 'lucide-react';

export default function StudentCurriculum() {
  const [curriculumData, setCurriculumData] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/student/curriculum`, { headers: { Authorization: `Bearer ${token}` } });
        
        // Group data by Subject Name for beautiful UI
        const groupedData = res.data.reduce((acc, item) => {
          if (!acc[item.subjectName]) acc[item.subjectName] = [];
          acc[item.subjectName].push(item);
          return acc;
        }, {});

        setCurriculumData(groupedData);
      } catch (err) {
        console.error("Failed to fetch curriculum");
      } finally {
        setLoading(false);
      }
    };
    fetchCurriculum();
  }, [API_URL, token]);

  if (loading) return <div className="p-8 text-slate-500">Loading syllabus...</div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center">
        <BookOpen className="mr-3 text-indigo-600 w-8 h-8"/> Course Syllabus & Curriculum
      </h2>

      {Object.keys(curriculumData).length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-500">
          No syllabus has been uploaded by your faculty yet.
        </div>
      ) : (
        Object.keys(curriculumData).map((subject) => (
          <div key={subject} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-end">
              <h3 className="text-2xl font-bold text-indigo-900">{subject}</h3>
              <p className="text-sm font-medium text-slate-500 flex items-center">
                <User size={16} className="mr-1"/> Instructor: {curriculumData[subject][0].facultyId?.fullName || 'Unknown'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {curriculumData[subject].map((chapter) => (
                <div key={chapter._id} className="flex items-start p-4 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4 mt-1">
                    <BookMarked className="text-indigo-600 w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{chapter.chapterNumber}</span>
                    <h4 className="text-md font-bold text-slate-800 mt-1">{chapter.chapterName}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import useAxios from 'axios-hooks';
import { formatDueDate } from '../Utils/FormatDueDate';

function Assignments() {
    const [classId, setClassId] = useState(localStorage.getItem('classId'));

    const [selectedSubject, setSelectedSubject] = useState('all');
    const [filteredAssignments, setFilteredAssignments] = useState([]);

    const [{ data: assignments, loading, error }, fetchAssignments] = useAxios(
        `http://localhost:5000/api/assignments/class/${classId}`,
        { manual: true }
    );

    const [{ data: subjectsData, loading: subjectsLoading }, fetchSubjects] = useAxios('http://localhost:5000/api/subjects');

    const [subjectMapper, setSubjectMapper] = useState({});

    useEffect(() => {
        const subjectMap = {};
        subjectsData?.forEach(subject => {
            subjectMap[subject._id] = subject.subjectName;
        });
        setSubjectMapper(subjectMap);
    }, [subjectsLoading]);

    useEffect(() => {
        if (assignments) {
            if (selectedSubject === 'all') {
                setFilteredAssignments(assignments);
            } else {
                const filtered = assignments.filter(
                    assignment => assignment.subjectId === selectedSubject
                );
                setFilteredAssignments(filtered);
            }
        }
    }, [selectedSubject, assignments]);

    useEffect(() => {
        if (classId) {
            fetchAssignments();
        }
    }, []);

    if (loading) {
        return <p>Loading Assignments...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error fetching Assignments</p>;
    }

    return (
        <section className="p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Assignments</h2>
                <div className="flex items-center gap-2">
                    <label htmlFor="subjectFilter" className="text-gray-200 font-semibold">
                        Filter by Subject:
                    </label>
                    <select
                        id="subjectFilter"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="border rounded-md px-3 py-1.5 bg-white text-gray-800"
                    >
                        <option value="all">All Subjects</option>
                        {subjectsData?.map((subject) => (
                            <option key={subject._id} value={subject._id}>
                                {subjectMapper[subject._id]}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {filteredAssignments?.length > 0 ? (
                <ul className="space-y-4">
                    {filteredAssignments.map((assignment) => {
                        const { formattedDate, status, statusColor } = formatDueDate(assignment.dueDate);
                        return (
                            <li key={assignment._id} className="bg-gray-200 p-6 rounded-lg shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900">{assignment.title}</h3>
                                        <p className="text-gray-800 font-semibold">{subjectMapper[assignment?.subjectId]}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-base font-medium ${statusColor}`}>
                                        {status}
                                    </span>
                                </div>

                                <p className="text-gray-900 mb-4 text-lg">{assignment.description}</p>

                                <div className="flex justify-between items-center font-medium">
                                    <div className="text-sm text-gray-800">
                                        <p>Due: {formattedDate}</p>
                                        <p>File: {assignment.fileName}</p>
                                    </div>
                                    <a
                                        href={`http://localhost:5000/${assignment.filePath}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Download
                                    </a>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-xl text-gray-200">No Assignments for now.</p>
            )}
        </section>
    );
}

export default Assignments;
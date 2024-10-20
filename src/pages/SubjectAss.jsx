import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAxios from 'axios-hooks';
import useToast from '../Utils/UseToast';
import AssignmentUploadModal from './teachers/AssignmentUploadModal';

const SubjectAss = ({ selectedClass = {}, user = {}, onClose = () => { } }) => {
    const [classSubjects, setClassSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [assignments, setAssignments] = useState({});
    const [assignmentUploadModal, setAssignmentUploadModal] = useState(false);
    const { addToast, ToastContainer } = useToast();

    // Fetch permissions for the selected class and teacher
    const [{ data: permissionsList, loading: permissionsLoading, error: permissionsError }, refetchPermissions] = useAxios(
        `http://localhost:5000/api/permissions?classId=${selectedClass?._id}&teacherId=${user._id}`,
        { manual: true }
    );

    // Fetch assignments for a specific subject
    const fetchAssignmentsForSubject = async (subjectId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/assignments`, {
                params: {
                    classId: selectedClass._id,
                    teacherId: user._id,
                    subjectId: subjectId
                }
            });
            setAssignments(prev => ({
                ...prev,
                [subjectId]: response.data
            }));
        } catch (error) {
            console.error("Error fetching assignments:", error);
            addToast("Error fetching assignments: " + error.message, 'error');
        }
    };


    // Handle assignment deletion
    const handleDeleteAssignment = async (assignmentId, subjectId) => {
        try {
            await axios.delete(`http://localhost:5000/api/assignments/${assignmentId}`);
            addToast("Assignment deleted successfully", 'success');
            // Refresh assignments for this subject
            fetchAssignmentsForSubject(subjectId);
        } catch (error) {
            console.error("Error deleting assignment:", error);
            addToast("Error deleting assignment: " + error.message, 'error');
        }
    };

    // Fetch subjects effect
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                if (selectedClass.subjects && selectedClass.subjects.length > 0) {
                    const response = await axios.get("http://localhost:5000/api/subjects");
                    const fetchedSubjects = response.data;

                    // Filter subjects that belong to the selected class
                    const filteredSubjects = fetchedSubjects.filter(subject =>
                        selectedClass.subjects.includes(subject._id)
                    );
                    setClassSubjects(filteredSubjects);
                    
                    // Fetch assignments for each subject
                    filteredSubjects.forEach(subject => {
                        fetchAssignmentsForSubject(subject._id);
                    });
                }
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        if (selectedClass?._id) {
            fetchSubjects();
            refetchPermissions();
        }
    }, [selectedClass, refetchPermissions]);

    // Filter subjects based on permissions
    const filteredSubjects = classSubjects?.filter((subject) =>
        permissionsList?.some((permission) =>
            permission.subjectId === subject._id &&
            permission.havePermission === true &&
            permission.teacherId === user._id
        )
    );

    return (
        <section className="p-8 w-5/6 ml-auto mr-10">
            <div className="modal-content flex flex-col h-full">
                <h2 className='2xl:text-3xl xl:text-xl text-base font-semibold mb-6'>
                    Create Assignments for Subjects
                </h2>

                {permissionsLoading ? (
                    <div>Loading...</div>
                ) : permissionsError ? (
                    <div>Error loading permissions</div>
                ) : classSubjects.length === 0 ? (
                    <div>No subjects available for creating assignments.</div>
                ) : filteredSubjects?.length === 0 ? (
                    <div>No subjects available for this teacher.</div>
                ) : (
                    <div className="space-y-8">
                        {filteredSubjects?.map((subject) => (
                            <div key={subject._id} className="bg-gray-800 p-6 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="font-bold text-xl">
                                        {subject.subjectName}
                                    </h1>
                                    <button 
                                        className="btn btn-outline btn-info"
                                        onClick={() => {
                                            setSelectedSubject(subject);
                                            setAssignmentUploadModal(true);
                                        }}
                                    >
                                        Create Assignment
                                    </button>
                                </div>

                               {/* Assignments List */}
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold mb-2">Current Assignments:</h3>
                                    {assignments[subject._id]?.length > 0 ? (
                                        <ul className="space-y-2">
                                            {assignments[subject._id].map((assignment) => (
                                                <li key={assignment._id} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">{assignment.title}</span>
                                                        <span className="text-sm text-gray-400">
                                                            Due: {new Date(assignment.dueDate).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="space-x-2">
                                                        <a
                                                            href={`http://localhost:5000/${assignment.filePath}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                            Download
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteAssignment(assignment._id, subject._id)}
                                                            className="btn btn-sm btn-error"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-400">No assignments created yet.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="modal-action mt-auto">
                    <button onClick={onClose} className="btn btn-default text-xl">
                        Close
                    </button>
                </div>
            </div>
            {assignmentUploadModal && (
                <AssignmentUploadModal
                    selectedClass={selectedClass}
                    selectedSubject={selectedSubject}
                    onClose={() => {
                        setAssignmentUploadModal(false);
                        // Refresh assignments for the selected subject after upload
                        if (selectedSubject) {
                            fetchAssignmentsForSubject(selectedSubject._id);
                        }
                    }}
                    user={user}
                    addToast={addToast}
                />
            )}
            <ToastContainer />
        </section>
    );
};

export default SubjectAss;
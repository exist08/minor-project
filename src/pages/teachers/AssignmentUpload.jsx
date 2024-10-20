import React, { useEffect, useState } from 'react';
import useAxios from 'axios-hooks';
import SubjectAss from '../SubjectAss';

function AssignmentUpload({ user = {} }) {
    const [selectedClass, setSelectedClass] = useState(null);
    const [assignmentModal, setAssignmentModal] = useState(false);

    // Fetch classes using axios-hooks
    const [{ data: classesList, loading: fetchingClasses, error: fetchError }, refetchClasses] = useAxios(
        'http://localhost:5000/api/classes',
        { manual: true }
    );

    // Fetch classes on component mount
    useEffect(() => {
        refetchClasses();
    }, [refetchClasses]);

    // Filter classes where the user (teacher) is assigned to teach
    const filteredClasses = classesList?.filter((classItem) =>
        classItem.teachers?.some((teacherId) => teacherId === user._id)
    );

    return (
        <section className='section p-8'>
            <div className="assignments-container">
                <h2 className='2xl:text-3xl xl:text-2xl md:text-xl text-base font-semibold mb-6'>
                    Upload Assignments for Your Classes
                </h2>

                {/* Classes List */}
                <div className="classes-container rounded-xl">
                    {fetchingClasses ? (
                        <div className="loading-state">Loading classes...</div>
                    ) : fetchError ? (
                        <div className="error-state">Error fetching classes: {fetchError.message}</div>
                    ) : filteredClasses?.length === 0 ? (
                        <div className="empty-state">No classes assigned to you.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredClasses?.map((classItem, idx) => (
                                <div
                                    key={idx}
                                    className="class-card bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                                    onMouseEnter={() => setSelectedClass(classItem)}
                                    onClick={() => setAssignmentModal(true)}
                                >
                                    <h3 className="text-xl font-bold mb-2">{classItem?.className}</h3>
                                    {classItem?.section && (
                                        <p className="text-gray-400">Section: {classItem?.section}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Assignment Modal */}
            {assignmentModal && (
                <div className="modal modal-open">
                    <SubjectAss
                        selectedClass={selectedClass}
                        user={user}
                        onClose={() => setAssignmentModal(false)}
                    />
                </div>
            )}
        </section>
    );
}

export default AssignmentUpload;
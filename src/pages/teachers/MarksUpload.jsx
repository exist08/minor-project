import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import MarksUploadSpecificClass from './MarksUploadSpecificClass';

const MarksUpload = ({ user = {} }) => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [classSubjectsModal, setClassSubjectsModal] = useState(false)

    // Fetch classes
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
        <section className='p-8'>
            <div className="make-schedule">

                {/* Classes List */}
                <div className="classes-container rounded-xl">
                    {fetchingClasses ? (
                        <div>Loading classes...</div> // Loading state for fetching classes
                    ) : fetchError ? (
                        <div>Error fetching classes: {fetchError.message}</div>
                    ) : filteredClasses?.length === 0 ? (
                        <div>No classes assigned to you.</div> // Message if no classes are found for the teacher
                    ) : (
                        <>
                            {filteredClasses?.map((classItem, idx) => (
                                <div
                                    onMouseEnter={() => setSelectedClass(classItem)}
                                    onClick={() => setClassSubjectsModal(true)}
                                    key={idx}
                                    className="classItem flex flex-col justify-start items-start 2xl:text-3xl xl:text-2xl md:text-xl text-base p-4 cursor-pointer"
                                >
                                    <h1>{classItem?.className}</h1>
                                    {classItem?.section && <p>Section: {classItem?.section}</p>}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
            {
                classSubjectsModal && (
                    <div className="modal modal-open">
                        <MarksUploadSpecificClass selectedClass={selectedClass} user={user} onClose={() => setClassSubjectsModal(false)} />
                    </div>
                )
            }
        </section>
    );
};

export default MarksUpload;

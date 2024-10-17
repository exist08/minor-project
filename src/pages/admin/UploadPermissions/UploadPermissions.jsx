import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import AssignPermissions from './AssignPermissions';

const UploadPermissions = () => {

    const [assignPermissionModal, setAssignPermissionModal] = useState(false)
    const [selectedClass, setSelectedClass] = useState(null);
    
    // Fetch classes
    const [{ data: classesList, loading: fetchingClasses, error: fetchError }, refetchClasses] = useAxios(
        'http://localhost:5000/api/classes',
        { manual: true }
    );

    
    // Fetch classes on component mount
    useEffect(() => {
        refetchClasses();
    }, [refetchClasses]);

    return (
        <section className='p-8'>
            <div className="make-schedule">

                {/* Classes List */}
                <div className="classes-container rounded-xl">
                    {fetchingClasses ? (
                        <div>Loading classes...</div> // Loading state for fetching classes
                    ) : fetchError ? (
                        <div>Error fetching classes: {fetchError.message}</div>
                    ) : (
                        <>
                            {classesList?.map((classItem, idx) => (
                                <div onMouseEnter={()=>setSelectedClass(classItem)} onClick={()=>setAssignPermissionModal(true)} key={idx} className="classItem flex flex-col justify-start items-start 2xl:text-3xl xl:text-2xl md:text-xl text-base p-4 cursor-pointer">
                                    <h1 >{classItem?.className}</h1>
                                    {classItem?.section && <p>Section: {classItem?.section}</p>}
                                </div>
                            ))}

                        </>
                    )}
                </div>
            </div>

            {
                assignPermissionModal && <AssignPermissions selectedClass={selectedClass} closeModal={()=>setAssignPermissionModal(false)} />
            }
        </section>
    );
};

export default UploadPermissions;

import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react'
import StudyMaterialUpload from './StudyMaterialUpload';

function UploadStudyMaterial({ user = {} }) {
  
  const [selectedClass, setSelectedClass] = useState(null);
  const [studyMaterialModal, setStudyMaterialModal] = useState(false)

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
                  onClick={() => setStudyMaterialModal(true)}
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
        studyMaterialModal && (
          <div className="modal modal-open">
            <StudyMaterialUpload selectedClass={selectedClass} user={user} onClose={() => setStudyMaterialModal(false)} />
          </div>
        )
      }
    </section>
  );
}

export default UploadStudyMaterial
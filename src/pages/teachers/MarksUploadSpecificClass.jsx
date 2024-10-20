import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAxios from 'axios-hooks';
import MarksCSVUploader from './MarksCSVUploader';
import useToast from '../../Utils/UseToast';

const MarksUploadSpecificClass = ({ selectedClass = {}, user = {}, onClose = () => { } }) => {
    console.log(selectedClass)
    const [classSubjects, setClassSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [marksCSVModal, setMarksCSVModal] = useState(false)
    const { addToast, ToastContainer} = useToast()

    // Fetch permissions for the selected class and teacher
    const [{ data: permissionsList, loading: permissionsLoading, error: permissionsError }, refetchPermissions] = useAxios(
        `http://localhost:5000/api/permissions?classId=${selectedClass?._id}&teacherId=${user._id}`,
        { manual: true }
    );



    // Fetch all subjects and filter the ones related to the selected class
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                if (selectedClass.subjects && selectedClass.subjects.length > 0) {
                    const response = await axios.get("http://localhost:5000/api/subjects");
                    const fetchedSubjects = response.data;

                    // Filter the subjects that belong to the selected class
                    const filteredSubjects = fetchedSubjects.filter(subject =>
                        selectedClass.subjects.includes(subject._id)
                    );
                    setClassSubjects(filteredSubjects);
                }
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        if (selectedClass?._id) {
            fetchSubjects();
            refetchPermissions(); // Fetch permissions after class is selected
        }
    }, [selectedClass, refetchPermissions]);

    // Filter subjects based on both class association and permissions
    const filteredSubjects = classSubjects?.filter((subject) =>
        permissionsList?.some((permission) =>
            permission.subjectId === subject._id &&
            permission.havePermission === true &&
            permission.teacherId === user._id
        )
    );


    return (
        <section className="p-8 w-2/5 ml-auto mr-10">
            <div className="modal-content flex flex-col h-full">
                <h2 className="2xl:text-3xl xl:text-xl text-base font-semibold mb-6">Subjects with Upload Permission</h2>
                {permissionsLoading ? (
                    <div>Loading...</div>
                ) : permissionsError ? (
                    <div>Error loading permissions</div>
                ) : classSubjects.length === 0 ? (
                    <div>No subjects available for marks upload.</div>
                ) : filteredSubjects?.length === 0 ? (
                    <div>No subjects available for this teacher.</div>
                ) : (
                    <ul>
                        {filteredSubjects?.map((subject) => (
                            <li
                                key={subject._id}
                                onMouseEnter={() => setSelectedSubject(subject)}
                                className="subject-item flex gap-8 items-center"
                            >
                                <h1 className="font-bold">
                                    {subject.subjectName} {/* Display the subject name */}
                                </h1>
                                <button className="btn btn-outline btn-info" onClick={() => setMarksCSVModal(true)}>
                                    Upload Marks
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                
                <div className="modal-action mt-auto">
                    <button onClick={onClose} className="btn btn-default text-xl">
                        Close
                    </button>
                </div>
            </div>
            {
                marksCSVModal && (
                    <MarksCSVUploader
                        selectedSubject={selectedSubject}
                        selectedClass={selectedClass}
                        onClose={() => setMarksCSVModal(false)}
                        addToast={addToast}
                    />
                )
            }
            <ToastContainer />
        </section>
    );
};

export default MarksUploadSpecificClass;

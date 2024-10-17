import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAxios from 'axios-hooks';

const MarksUploadSpecificClass = ({ selectedClass = {}, user = {}, onClose = () => {} }) => {
    const [classSubjects, setClassSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);

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

    // const handleSubjectSelect = (subject) => {
    //     setSelectedSubject(subject);
    //     onClose(); // Close the modal after selecting a subject
    // };

    return (
        <section className="p-8 w-5/6 ml-auto mr-10">
            <div className="modal-content">
                <h2>Subjects with Upload Permission</h2>
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
                                onClick={() => setSelectedSubject(subject)}
                                className="subject-item cursor-pointer"
                            >
                                {subject.subjectName} {/* Display the subject name */}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default MarksUploadSpecificClass;

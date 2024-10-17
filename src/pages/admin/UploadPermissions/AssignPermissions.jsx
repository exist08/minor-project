import axios from "axios";
import { useState, useEffect } from "react";

const AssignPermissions = ({ selectedClass, closeModal }) => {
    const [classSubjects, setClassSubjects] = useState([]);
    const [classTeachers, setClassTeachers] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState({});
    const [existingPermissions, setExistingPermissions] = useState({});

    useEffect(() => {
        if (selectedClass) {
            // Fetch and filter subjects based on class.subjects
            const classSubjectIds = selectedClass.subjects; // Array of subject IDs
            axios.get("http://localhost:5000/api/subjects")
                .then((response) => {
                    const fetchedSubjects = response.data;
                    const filteredSubjects = fetchedSubjects.filter(subject =>
                        classSubjectIds.includes(subject._id)
                    );
                    setClassSubjects(filteredSubjects); // Set only the subjects for this class
                })
                .catch((error) => console.error("Error fetching subjects:", error));

            // Fetch and filter teachers based on class.teachers
            const classTeacherIds = selectedClass.teachers; // Array of teacher IDs
            axios.get("http://localhost:5000/api/teachers")
                .then((response) => {
                    const fetchedTeachers = response.data;
                    const filteredTeachers = fetchedTeachers.filter(teacher =>
                        classTeacherIds.includes(teacher._id)
                    );
                    setClassTeachers(filteredTeachers); // Set only the teachers for this class
                })
                .catch((error) => console.error("Error fetching teachers:", error));

            // Fetch existing permissions for the class
            axios.get(`http://localhost:5000/api/permissions?classId=${selectedClass._id}`)
                .then((response) => {
                    const permissions = response.data.reduce((acc, permission) => {
                        acc[permission.subjectId] = permission.teacherId; // Store teacherId for each subject
                        return acc;
                    }, {});
                    setExistingPermissions(permissions); // Set existing permissions for the class
                    setSelectedPermissions(permissions); // Pre-select the teachers for each subject
                })
                .catch((error) => console.error("Error fetching permissions:", error));
        }
    }, [selectedClass]);

    const handleSelectTeacher = (subjectId, teacherId) => {
        setSelectedPermissions((prev) => ({
            ...prev,
            [subjectId]: teacherId,
        }));
    };

    const handleSubmit = async () => {
        try {
            // Prepare and send permission data to the backend
            const permissionsData = Object.entries(selectedPermissions).map(
                ([subjectId, teacherId]) => ({
                    teacherId,
                    classId: selectedClass._id,
                    subjectId,
                    havePermission: true,
                })
            );
            await axios.post("http://localhost:5000/api/permissions", permissionsData);
            alert("Permissions assigned successfully");
            closeModal();
        } catch (error) {
            console.error("Error assigning permissions:", error);
        }
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-xl mb-4">Assign Permissions for {selectedClass.className}</h3>

                <div className="form-control">
                    {classSubjects.map((subject) => (
                        <div key={subject._id} className="mb-4 flex justify-between items-center text-md">
                            <label className="block font-bold">{subject.subjectName}</label>
                            <select
                                value={selectedPermissions[subject._id] || ""}
                                onChange={(e) => handleSelectTeacher(subject._id, e.target.value)}
                                className="select select-primary mt-2"
                            >
                                <option value="">Select Teacher</option>
                                {classTeachers.map((teacher) => (
                                    <option key={teacher._id} value={teacher._id}>
                                        {teacher.facultyName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="modal-action">
                    <button onClick={handleSubmit} className="btn btn-primary">
                        Assign Permissions
                    </button>
                    <button onClick={closeModal} className="btn">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignPermissions;

import axios from "axios";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";

const AssignTeacherToClass = ({ closeModal, selectedClass = {} }) => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [teachersList, setTeachersList] = useState([])

    const [{ data: teachersData = [], error: teachersError, loading: teachersLoading },fetchTeachers] = useAxios('http://localhost:5000/api/teachers');
    const [{ data: assignedTeachersData = [], error: assignedTeachersDataError, loading: assignedTeachersLoading}, fetchAssignedTeachers] = useAxios(`http://localhost:5000/api/classes/${selectedClass._id}/teachers`)

    useEffect(()=>{
        setTeachersList(teachersData);
        console.log(teachersData)
    },[teachersLoading])

    useEffect(()=>{
        setSelectedTeachers(assignedTeachersData);
    },[assignedTeachersLoading])

    // Handle form submission to assign teachers
    const handleSubmit = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/classes/${selectedClass._id}/assign-teachers`, {
                teachers: selectedTeachers,
            });
            if (response.status === 200) {
                alert('Teachers assigned successfully');
                closeModal(); // Close modal after successful assignment
            }
        } catch (error) {
            console.error('Error assigning teachers:', error);
        }
    };

    // Handle teacher selection
    const handleTeacherSelect = (teacherId) => {
        setSelectedTeachers((prev) => {
            if (prev.includes(teacherId)) {
                return prev.filter((id) => id !== teacherId); // Unselect teacher
            } else {
                return [...prev, teacherId]; // Select teacher
            }
        });
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Assign Teachers to {selectedClass.className}</h3>

                {teachersLoading ? (
                    <p>Loading teachers...</p>
                ) : teachersError ? (
                    <p>Error loading teachers: {teachersError.message}</p>
                ) : (
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-control">
                            {teachersList?.map((teacher) => (
                                <label key={teacher?._id} className="cursor-pointer flex items-center mb-2 first:mt-4">
                                    <input
                                        type="checkbox"
                                        value={teacher?._id}
                                        checked={selectedTeachers.includes(teacher._id)}
                                        onChange={() => handleTeacherSelect(teacher._id)}
                                        className="checkbox checkbox-primary mr-2"
                                    />
                                    <span>{teacher?.facultyName}</span>
                                </label>
                            ))}
                        </div>
                        <div className="modal-action">
                            <button onClick={handleSubmit} className="btn btn-primary">
                                Assign Teachers
                            </button>
                            <button onClick={closeModal} className="btn">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AssignTeacherToClass;
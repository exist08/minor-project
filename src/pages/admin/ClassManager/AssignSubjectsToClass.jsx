import axios from "axios";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";


const AssignSubjectsToClass = ({ closeModal, selectedClass = {} }) => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const [{ data: subjectsList = [], error: subjectsError, loading: subjectsLoading },fetchSubjects] = useAxios('http://localhost:5000/api/subjects');
    const [ { data: assignedSubjectsData = [], error: assignedSubjectsError, loading: assignedSubjectsLoading},fetchAssignedSubjects] = useAxios(`http://localhost:5000/api/classes/${selectedClass._id}/subjects`);
    
    useEffect(()=>{
        setSubjects(subjectsList)
    },[subjectsLoading])
    
    useEffect(()=>{
        setSelectedSubjects(assignedSubjectsData)
    },[assignedSubjectsLoading])
    // Handle form submission to assign subjects
    const handleSubmit = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/classes/${selectedClass._id}/assign-subjects`, {
                subjects: selectedSubjects,
            });
            if (response.status === 200) {
                alert('Subjects assigned successfully');
                closeModal(); // Close modal after successful assignment
            }
        } catch (error) {
            console.error('Error assigning subjects:', error);
        }
    };

    // Handle subject selection
    const handleSubjectSelect = (subjectId) => {
        setSelectedSubjects((prev) => {
            if (prev.includes(subjectId)) {
                return prev.filter((id) => id !== subjectId); // Unselect subject
            } else {
                return [...prev, subjectId]; // Select subject
            }
        });
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Assign Subjects to {selectedClass.className}</h3>

                {subjectsLoading ? (
                    <p>Loading subjects...</p>
                ) : subjectsError ? (
                    <p>Error loading subjects: {subjectsError.message}</p>
                ) : (
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-control">
                            {subjectsList?.map((subject) => (
                                <label key={subject._id} className="cursor-pointer flex mb-2 first:mt-4 items-center">
                                    <input
                                        type="checkbox"
                                        value={subject._id}
                                        checked={selectedSubjects.includes(subject._id)}
                                        onChange={() => handleSubjectSelect(subject._id)}
                                        className="checkbox checkbox-primary mr-2"
                                    />
                                    <span>{subject.subjectName}</span>
                                </label>
                            ))}
                        </div>
                        <div className="modal-action">
                            <button onClick={handleSubmit} className="btn btn-primary">
                                Assign Subjects
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

export default AssignSubjectsToClass;
import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import './admin.css';
import ScheduleMaker from './ScheduleMaker';
// import ClassManager from './ClassManager/ClassManager';
import StudentsCSVUploader from './ClassManager/StudentsCSVUploader';
import StudentListModal from './ClassManager/StudentListModal';
import AssignTeacherToClass from './ClassManager/AssignTeacherToClass';
import AssignSubjectsToClass from './ClassManager/AssignSubjectsToClass';

function ClassesManager() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scheduleModal, setScheduleModal] = useState(false)
    const [selectedClass, setSelectedClass] = useState(null);
    const [studentModal, setStudentModal] = useState(false)
    const [studentListModal, setStudentListModal] = useState(false)
    const [assignTeacherModal, setAssignTeacherModal] = useState(false)
    const [addSubjectsModal, setAddSubjectsModal] = useState(false)
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        className: '',
        section: '',
    });

    const [activeDropdown, setActiveDropdown] = useState(null); // Track which dropdown is open

    const toggleDropdown = (idx) => {
        if (activeDropdown === idx) {
            setActiveDropdown(null); // Close if the same dropdown is clicked again
        } else {
            setActiveDropdown(idx); // Open the dropdown for the selected class
        }
    };

    // Fetch classes
    const [{ data: classesList, loading: fetchingClasses, error: fetchError }, refetchClasses] = useAxios(
        'http://localhost:5000/api/classes',
        { manual: true }
    );

    // Create new class
    const [{ loading: creatingClass, error: createError }, executeCreateClass] = useAxios(
        { url: 'http://localhost:5000/api/classes', method: 'POST' },
        { manual: true }
    );

    // Set up axios DELETE request (manual mode)
    const [{ loading, error }, executeDelete] = useAxios(
        { method: 'DELETE' },
        { manual: true } // Manual mode to trigger request manually with dynamic URL
    );

    // Fetch classes on component mount
    React.useEffect(() => {
        refetchClasses();
    }, [refetchClasses]);

    // Handle input change for the form
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submit for creating a new class
    const handleSubmit = (e) => {
        e.preventDefault();
        executeCreateClass({ data: form })
            .then(() => {
                alert('Class created successfully');
                setIsModalOpen(false); // Close modal after class is created
                refetchClasses(); // Fetch updated class list after creation
            })
            .catch((error) => {
                console.error('There was an error creating the class!', error);
            });
    };

    // Handle selecting a class and opening the ScheduleMaker
    const handleUploadSchedule = (classItem) => {
        setSelectedClass(classItem); // Set the selected class
        setScheduleModal(true);      // Open the ScheduleMaker modal
    };

    // Handle selecting a class and opening the Students list modal
    const handleShowStudents = (classItem) =>{
        setSelectedClass(classItem); // Set the selected class
        setStudentListModal(true);      // Open the Students list modal
    }

    const handleUploadStudents = (classItem) => {
        setSelectedClass(classItem); // Set the selected class
        setStudentModal(true);      // Open the StudentsCSVUploader modal
    }

    const handleAssignTeachers = (classItem) => {
        setSelectedClass(classItem); // Set the selected class
        setAssignTeacherModal(true); // Open the
    }

    const handleAddSubjects = (classItem) => {
        setSelectedClass(classItem); // Set the selected class
        setAddSubjectsModal(true); // Open the
    }

    // handleDelete now accepts the class object and uses its id to delete
    const handleDelete = async (classItem) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete the class "${classItem.className}"?`);
        if (isConfirmed) {
            try {
                // Dynamically set the URL with classItem._id to delete the class
                const response = await executeDelete({ url: `http://localhost:5000/api/classes/${classItem._id}` });
                setMessage(response.data.message); // Show success message
                refetchClasses(); // Fetch updated class list after deletion
            } catch (err) {
                // Error is handled automatically by axios-hooks
            }
        }
    };

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
                                <div key={idx} className="classItem flex flex-col justify-start items-start 2xl:text-3xl xl:text-2xl md:text-xl text-base p-4 cursor-pointer">
                                    <h1 onClick={() => handleClassSelect(classItem)}>{classItem?.className}</h1>
                                    {classItem?.section && <p>Section: {classItem?.section}</p>}

                                    <div className="relative inline-block text-left mt-auto self-end"> <div className="dropdown dropdown-bottom dropdown-end">
                                        {/* DaisyUI Button */}
                                        <div tabIndex={0} role="button" className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none">
                                            <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                                        </div>

                                        {/* DaisyUI Dropdown Content */}
                                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                            <li>
                                                <a onClick={() => handleUploadStudents(classItem)}>
                                                    Upload Students
                                                </a>
                                            </li>
                                            <li>
                                                <a onClick={() => handleShowStudents(classItem)}>
                                                    Students List
                                                </a>
                                            </li>
                                            <li>
                                                <a onClick={() => handleAssignTeachers(classItem)}>
                                                    Assign Teachers
                                                </a>
                                            </li>
                                            <li>
                                                <a onClick={() => handleAddSubjects(classItem)}>
                                                    Add Subjects
                                                </a>
                                            </li>
                                            <li>
                                                <a onClick={() => handleUploadSchedule(classItem)}>
                                                    Make Schedule
                                                </a>
                                            </li>
                                            <li>
                                                <a onClick={() => handleDelete(classItem)}>
                                                    Delete Class
                                                </a>
                                            </li>
                                        </ul>
                                    </div></div>
                                </div>
                            ))}

                        </>
                    )}
                    {/* Add new class button */}
                    <div className="classItem 2xl:text-3xl xl:text-2xl md:text-xl text-base p-4 cursor-pointer flex flex-col justify-center gap-2 items-center"
                        onClick={() => setIsModalOpen(true)}>
                        <h1>Add new class</h1>
                        <ion-icon name="add-circle"></ion-icon>
                    </div>
                </div>
            </div>

            {/* Modal for creating a new class */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Create New Class</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Class Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="className"
                                    placeholder="Class Name"
                                    className="input input-bordered"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Section (optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="section"
                                    placeholder="Section"
                                    className="input input-bordered"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary">
                                    {creatingClass ? 'Creating...' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {scheduleModal && <ScheduleMaker closeScheduleMaker={() => setScheduleModal(false)} selectedClass={selectedClass} />}

            {studentModal && <StudentsCSVUploader closeStudent={() => setStudentModal(false)} selectedClass={selectedClass} selectedTab={'Student'} />}

            {studentListModal && <StudentListModal closeStudentList={() => setStudentListModal(false)} classId={selectedClass?._id} /> }
            {/* {selectedClass && (
                <ClassManager selectedClass={selectedClass} /> // Render ClassManage
                r with selected class
            )} */}
            {
                assignTeacherModal && <AssignTeacherToClass selectedClass={selectedClass} closeModal={()=>setAssignTeacherModal(false)} />
            }
            {
                addSubjectsModal && <AssignSubjectsToClass selectedClass={selectedClass} closeModal={()=>setAddSubjectsModal(false)}  />
            }
        </section>
    );
}

export default ClassesManager;

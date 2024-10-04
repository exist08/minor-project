import useAxios from 'axios-hooks';
import React, { useEffect } from 'react';

function StudentListModal({ classId = '', closeStudentList = () => { } }) {
    const [{ data, loading, error }, fetchStudents] = useAxios(
        {
            url: `http://localhost:5000/api/students/class/${classId}`,
            method: 'get',
        },
        { manual: true }
    );

    useEffect(() => {
        if (classId) {
            fetchStudents();
        }
    }, [classId]);

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h2 className="font-bold text-lg">Students in Class</h2>
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeStudentList}>✕</button>

                {/* Display content */}
                {loading && <div>Loading...</div>}
                {error && <div>Error fetching students</div>}
                {!loading && !error && (
                    <ul className="py-4">
                        {data?.map((student) => (
                            <li key={student._id}>
                                {student.name} ({student.enrollmentNumber})
                            </li>
                        ))}
                    </ul>
                )}

                <div className="modal-action">
                    <button className="btn" onClick={closeStudentList}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default StudentListModal;

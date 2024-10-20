import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import useAxios from 'axios-hooks';

function MarksCSVUploader({ onClose = () => { }, selectedSubject = {}, selectedClass = {} , addToast = ()=>{} }) {
    console.log(selectedClass)
    const [csvFile, setCsvFile] = useState(null);
    const [error, setError] = useState('');
    const [examType, setExamType] = useState('MST_I'); // Default exam type

    // Set maxMarks based on the selected exam type
    const getMaxMarks = (examType) => {
        return examType === 'FINAL' ? 70 : 20;
    };


    
    const [students, setStudents] = useState([]);
    // Fetch students when the selected class changes
    const [{ data: studentsData = [], loading:studsLoading, error:studsError }, refetch] = useAxios(
        `http://localhost:5000/api/students/class/${selectedClass?._id}`,
        { manual: true }
    );

    useEffect(() => {
        refetch();
        console.log(studentsData)
        setStudents(studentsData);
    }, []);

    // Generate the sample CSV format
    const downloadSampleCSV = () => {
        const csvData = studentsData?.map(student => ({
            enrollmentNumber: student?.enrollmentNumber,
            name: student?.name,
            marks: '', // Placeholder for marks
            maxMarks: getMaxMarks(examType) // Automatically set maxMarks based on exam type
        }));

        if (csvData.length === 0) {
            setError('No students found for this class');
            return;
        }

        const csv = Papa.unparse(csvData); // Convert JSON to CSV format
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `marks-sample-${selectedClass.className}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!csvFile) {
            setError('Please select a CSV file');
            return;
        }

        Papa.parse(csvFile, {
            header: true,
            complete: (result) => {
                const data = result.data.filter(obj =>
                    Object.values(obj).every(value => value !== "" && value !== null && value !== undefined)
                );

                if (data.length === 0) {
                    setError('No valid data found in the CSV file');
                    return;
                }

                console.log(data)  // till here data is correct and defined

                // Add studentId, classId, subjectId, and examType to each row
                const marksData = data.map(row => {
                    const student = studentsData.find(s => s.enrollmentNumber === row.enrollmentNumber);
                    console.log("Found Student:", student); // Debug if student is found
                    return {
                        studentId: student ? student._id : null,
                        classId: selectedClass._id,
                        subjectId: selectedSubject._id,
                        examType: examType,
                        marks: row.marks,
                        maxMarks: getMaxMarks(examType)
                    };
                })

                console.log("Marks Data before filtering:", marksData);
                const filteredData = marksData.filter(item => item.studentId); 
                console.log("Filtered Marks Data:", filteredData); // Check if any items remain

                // Upload valid data to the backend
                axios.post(`http://localhost:5000/api/upload-marks`, marksData)
                    .then(() => {
                        console.log(marksData)
                        addToast("Marks Uploaded Successfully", 'success')
                        onClose(); // Close modal on successful upload
                    })
                    .catch((err) => {
                        setError('Error uploading CSV: ' + err.message);
                        addToast('Error uploading CSV: ' + err.message, 'error');
                    });
            },
            error: (err) => {
                setError('Error parsing CSV: ' + err.message);
                addToast('Error uploading CSV: ' + err.message, 'error');
            }
        });
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="text-lg mb-2">Upload Marks for {selectedSubject.subjectName}</h3>

                {/* Exam Type Dropdown */}
                <label className="block mb-2">Select Exam Type:</label>
                <select value={examType} onChange={(e) => setExamType(e.target.value)} className="mb-4">
                    <option value="MST_I">MST I</option>
                    <option value="MST_II">MST II</option>
                    <option value="FINAL">Final</option>
                </select>

                {/* Download CSV sample */}
                <button onClick={downloadSampleCSV} className="btn btn-info">
                    Download Marks CSV Format
                </button>

                {/* CSV File Input */}
                <input type="file" accept=".csv" onChange={handleFileChange} className="mt-4 border" />
                {error && <p className="text-red-500">{error}</p>}

                <div className="modal-action">
                    <button onClick={handleUpload} className="btn btn-accent">
                        Upload
                    </button>
                    <button onClick={onClose} className="btn btn-neutral">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MarksCSVUploader;

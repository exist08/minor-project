import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

function MarksCSVUploader({ closeModal = () => { }, selectedSubject = {}, selectedClass = {} }) {
    const [csvFile, setCsvFile] = useState(null);
    const [error, setError] = useState('');

    // Sample CSV format data
    const csvSample = [
        { enrollmentNumber: '0801xx231xxx', name: 'Kapil Sharma', marks: 18, maxMarks: 20 }
    ];

    // Function to download the sample CSV
    const downloadSampleCSV = () => {
        const csv = Papa.unparse(csvSample); // Convert JSON to CSV format
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `marks-sample.csv`);
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
                console.log(result)
                // Filter out rows that are incomplete or have empty fields
                const data = result.data.filter(obj =>
                    Object.values(obj).every(value =>
                        value !== "" && value !== null && value !== undefined
                    )
                );

                if (data.length === 0) {
                    setError('No valid data found in the CSV file');
                    return;
                }

                // Upload valid data to the backend
                axios.post(`http://localhost:5000/api/upload-marks`, data)
                    .then(() => {
                        closeModal(); // Close modal on successful upload
                    })
                    .catch((err) => {
                        setError('Error uploading CSV: ' + err.message);
                    });
            },
            error: (err) => {
                setError('Error parsing CSV: ' + err.message);
            }
        });
    };


    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="text-lg mb-2">Upload Marks for {selectedSubject.subjectName}</h3>

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
                    <button onClick={closeModal} className="btn btn-neutral">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MarksCSVUploader;

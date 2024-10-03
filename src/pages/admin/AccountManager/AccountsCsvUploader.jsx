import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

function AccountsCsvUploader({ closeModal, selectedTab }) {
    const [csvFile, setCsvFile] = useState(null);
    const [error, setError] = useState('');

    // Sample CSV format data for each tab
    const csvSamples = {
        Teachers: [
            { username: 'teacher1234', password: 'teacher@sgsits', role: 'teacher' }
        ],
        Students: [
            { username: '0801ca231021', password: 'student@sgsits', role: 'student'}
        ],
    };

    // Function to download the sample CSV
    const downloadSampleCSV = () => {
        const sampleData = csvSamples[selectedTab];
        const csv = Papa.unparse(sampleData); // Convert JSON to CSV format
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${selectedTab}-sample.csv`);
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
                const data = result.data;
                axios.post(`http://localhost:5000//api/users/accounts/create-bulk-users`, data)
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
                <h3 className="text-lg mb-2">Upload CSV for {selectedTab}</h3>
                
                {/* Download CSV sample */}
                <button onClick={downloadSampleCSV} className="btn btn-info">
                    Download {selectedTab} CSV Format
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

export default AccountsCsvUploader;

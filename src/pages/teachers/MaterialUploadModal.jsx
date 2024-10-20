import React, { useState } from 'react';
import axios from 'axios';

function MaterialUploadModal({ selectedClass = {}, selectedSubject = {}, user = {}, onClose = () => { }, addToast = ()=>{} }) {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    
    const sanitizeFileName = (originalFile) => {
        if (!originalFile) return null;
        // Create a new file with sanitized name
        const fileName = originalFile.name.replace(/\s+/g, '_');
        return new File([originalFile], fileName, { type: originalFile.type });
    };

    
    const handleFileChange = (e) => {
        const originalFile = e.target.files[0];
        const sanitizedFile = sanitizeFileName(originalFile);
        setFile(sanitizedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSubject || !file) {
            setUploadStatus('Please select a subject and a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('classId', selectedClass._id);
        formData.append('teacherId', user._id);
        formData.append('subjectId', selectedSubject._id);

        try {
            const response = await axios.post('http://localhost:5000/api/materials/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus('File uploaded successfully');
            addToast("File uploaded successfully",'success');
            onClose(); // Close modal on successful upload  
        } catch (error) {
            setUploadStatus('Error uploading file');
            addToast("Error uploading file: "+error.message,'error');
        }
    };

    return (
        <div className="modal modal-open">
            <div className="modal-content bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Upload Study Material</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-control mb-4">
                        <label htmlFor="file" className="label">
                            <span className="label-text">Select File (PDF/DOCX):</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            className="file-input file-input-bordered w-full"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="submit" className="btn btn-primary">
                            Upload
                        </button>
                        <button type="button" onClick={onClose} className="btn btn-outline">
                            Close
                        </button>
                    </div>
                </form>
                {uploadStatus && (
                    <p className={`mt-4 text-sm ${uploadStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                        {uploadStatus}
                    </p>
                )}
            </div>
        </div>
    );
}

export default MaterialUploadModal;
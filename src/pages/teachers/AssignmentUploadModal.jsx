import React, { useState } from 'react';
import axios from 'axios';

function AssignmentUploadModal({ selectedClass = {}, selectedSubject = {}, user = {}, onClose = () => { }, addToast = () => { } }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSubject || !file || !title || !dueDate) {
            setUploadStatus('Please fill all required fields and select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('classId', selectedClass._id);
        formData.append('teacherId', user._id);
        formData.append('subjectId', selectedSubject._id);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('dueDate', dueDate);

        try {
            const response = await axios.post('http://localhost:5000/api/assignments/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus('Assignment uploaded successfully');
            addToast("Assignment uploaded successfully", 'success');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            setUploadStatus('Error uploading assignment');
            addToast("Error uploading assignment: " + error.message, 'error');
        }
    };

    return (
        <div className="modal modal-open">
            <div className="modal-content bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Create Assignment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Assignment Title:</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Description:</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="textarea textarea-bordered w-full"
                            rows="3"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Due Date:</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Upload File (PDF/DOCX):</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            className="file-input file-input-bordered w-full"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button type="submit" className="btn btn-primary">
                            Upload Assignment
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

export default AssignmentUploadModal;
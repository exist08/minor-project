// AddAnnouncement.js
import React, { useState } from 'react';
import useAxios from 'axios-hooks';

const AddAnnouncement = ({ onAdd = ()=>{} }) => {
    const [text, setText] = useState('');
    const [postedBy, setPostedBy] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const [{ loading, error }, addAnnouncement] = useAxios(
        {
            url: 'http://localhost:5000/api/announcements',
            method: 'post',
        },
        { manual: true }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addAnnouncement({ data: { text, postedBy, expiresAt } });
        setText('');
        setPostedBy('');
        setExpiresAt('');
        setIsOpen(false); // Close modal after submission
        // Fetch updated announcements after creation
        onAdd();
    };

    return (
        <div>
            <button className="btn" onClick={() => setIsOpen(true)}>
                Add Announcement
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="font-bold text-lg">Add Announcement</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Text:</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Posted By:</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={postedBy}
                                    onChange={(e) => setPostedBy(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Expires At:</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    className="input input-bordered"
                                    value={expiresAt}
                                    onChange={(e) => setExpiresAt(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="btn" type="submit" disabled={loading}>
                                {loading ? 'Adding...' : 'Add Announcement'}
                            </button>
                        </form>
                        {error && <div className="text-red-500">{error.message}</div>}
                        <div className="modal-action">
                            <button className="btn" onClick={() => setIsOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAnnouncement;

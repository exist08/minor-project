import useAxios from 'axios-hooks';
import React from 'react'

function SingleResourceUploader({ closeModal = () => { }, selectedTab, setReftechCallback, addToast = () => { } }) {
    const formSampler = {
        Teachers: [
            { facultyName: '', facultyAbbreviation: '', username: '' }
        ],
        Rooms: [
            { roomName: '' }
        ],
        Subjects: [
            { subjectCode: '', subjectName: '', subjectAbbreviation: '' }
        ]
    };

    const [formData, setFormData] = React.useState(formSampler[selectedTab]);

    const handleChange = (e, index) => {
        const updatedFormData = [...formData];
        updatedFormData[index][e.target.name] = e.target.value;
        setFormData(updatedFormData);
    };

    // Dynamic API endpoint based on the selectedTab
    const getEndpoint = () => {
        switch (selectedTab) {
            case 'Teachers':
                return 'http://localhost:5000/api/teachers';
            case 'Rooms':
                return 'http://localhost:5000/api/rooms';
            case 'Subjects':
                return 'http://localhost:5000/api/subjects';
            default:
                return 'http://localhost:5000/api/unknown'; // Fallback in case selectedTab is not handled
        }
    };

    // Axios request
    const [{ loading: creatingResource, error: createError }, executeCreateResource] = useAxios(
        { url: getEndpoint(), method: 'POST' },
        { manual: true }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make the API call dynamically based on selectedTab
            await executeCreateResource({ data: formData });

            setReftechCallback(prev=>prev+1)
            addToast(`${selectedTab} added successfully`)
            closeModal(); // Close the modal after creation
        } catch (error) {
            console.error(`Error adding ${selectedTab}:`, error);
        }
    };



    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Add New {selectedTab}</h3>
                <form onSubmit={handleSubmit}>
                    {formData.map((item, index) => (
                        Object.keys(item).map((key) => (
                            <div className="form-control" key={`${key}-${index}`}>
                                <label className="label">
                                    <span className="label-text">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                </label>
                                <input
                                    type="text"
                                    name={key}
                                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                    className="input input-bordered"
                                    value={item[key]}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                />
                            </div>
                        ))
                    ))}
                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary">
                            {creatingResource ? 'Adding...' : 'Add'}
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SingleResourceUploader
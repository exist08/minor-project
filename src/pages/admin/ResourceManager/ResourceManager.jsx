import useAxios from 'axios-hooks';
import React, { useState } from 'react';
import ListRenderer from './ListRenderer'; // Importing the ListRenderer component
import './resources.css'
import CSVUploader from './CSVUploader';
import SingleResourceUploader from './SingleResourceUploader';

function ResourceManager() {
    const [selectedTab, setSelectedTab] = useState('Teachers');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showCSVModal, setShowCSVModal] = useState(false);

    // API calls using axios-hooks
    const [{ data: teachersData, loading: teachersLoading, error: teachersError }] = useAxios('http://localhost:5000/api/teachers');
    const [{ data: subjectsData, loading: subjectsLoading, error: subjectsError }] = useAxios('http://localhost:5000/api/subjects');
    const [{ data: roomsData, loading: roomsLoading, error: roomsError }] = useAxios('http://localhost:5000/api/rooms');

    const resources = {
        Teachers: teachersData || [],
        Subjects: subjectsData || [],
        Rooms: roomsData || [],
    };

    const loading = teachersLoading || subjectsLoading || roomsLoading;
    const error = teachersError || subjectsError || roomsError;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data: {error.message}</p>;

    // Filtering data based on the search term
    const filteredData = resources[selectedTab].filter(item => {
        return Object.values(item).some(val =>
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <section className='p-8'>
            <div className="list-wrapper-container">
                {/* Tabs */}
                <div className="tabs-n-adders">
                    <div className="tabs 2xl:text-3xl">
                        {Object.keys(resources).map((resrc) => (
                            <button
                                key={resrc}
                                className={`p-4 ${selectedTab === resrc ? 'active' : ''}`}
                                onClick={() => setSelectedTab(resrc)}
                            >
                                {resrc}
                            </button>
                        ))}
                    </div>
                    <div className="adders flex gap-2">
                        <button className="btn btn-active" onClick={() => setShowModal(true)}>
                            Add New {selectedTab}
                        </button>
                        <button className="btn btn-active" onClick={() => setShowCSVModal(true)}>
                            Add Multiple {selectedTab}
                        </button>
                    </div>
                </div>

                {/* Search bar */}
                <div className="form-control mt-1">
                    <input
                        type="text"
                        placeholder={`Search ${selectedTab.toLowerCase()}...`}
                        className="input input-bordered w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* List Renderer Component */}
                <ListRenderer selectedTab={selectedTab} filteredData={filteredData} />

                {showCSVModal && (
                    <CSVUploader closeModal={() => setShowCSVModal(false)} selectedTab={selectedTab} />
                )}

                {showModal && (
                    <SingleResourceUploader closeModal={() => setShowModal(false)} selectedTab={selectedTab} />
                )}
            </div>
        </section>
    );
}

export default ResourceManager;

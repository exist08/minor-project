// Announcements.js
import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';

const AnnouncementsList = ({ refresh }) => {
    const [{ data, loading, error }, fetchAnnouncements] = useAxios(
        {
            url: 'http://localhost:5000/api/announcements',
            method: 'get',
        },
        { manual: true }
    );

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements,refresh]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="alert alert-error">Error fetching announcements</div>;

    // Filter out expired announcements
    const currentDate = new Date();
    const activeAnnouncements = data?.filter(announcement => new Date(announcement.expiresAt) > currentDate);

    return (
        <div>
            <h2 className="text-2xl font-bold my-4">Active Announcements</h2>
            {activeAnnouncements?.length === 0 ? (
                <div className="alert alert-warning">No active announcements.</div>
            ) : (
                <ul className="space-y-2">
                    {activeAnnouncements?.map((announcement) => (
                        <li key={announcement?._id} className="border p-4 rounded-lg shadow-md">
                            <strong>{announcement?.postedBy}:</strong> {announcement?.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AnnouncementsList;

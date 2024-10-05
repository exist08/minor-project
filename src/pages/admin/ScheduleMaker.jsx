import React, { useEffect, useState } from 'react';
import combineScheduleEntries from '../../Utils/ScheduleCombiner';
import useAxios from 'axios-hooks';
import axios from 'axios';

const ScheduleMaker = ({ closeScheduleMaker = () => { }, selectedClass = {} }) => {
    // Initial schedule state
    const [scheduleData, setScheduleData] = useState({
        Monday: [
            { subject: 'LUNCH', start: '13:00', end: '14:00' },],
        Tuesday: [
            { subject: 'LUNCH', start: '13:00', end: '14:00' },],
        Wednesday: [
            { subject: 'LUNCH', start: '13:00', end: '14:00' },],
        Thursday: [
            { subject: 'LUNCH', start: '13:00', end: '14:00' },],
        Friday: [
            { subject: 'LUNCH', start: '13:00', end: '14:00' },],
    });

    // Active day for the tab
    const [activeDay, setActiveDay] = useState('Monday');

    // Fetch data for subjects, teachers, and rooms from your APIs
    const [{ data: subjectsData, loading: loadingSubjects }] = useAxios('http://localhost:5000/api/subjects');
    const [{ data: teachersData, loading: loadingTeachers }] = useAxios('http://localhost:5000/api/teachers');
    const [{ data: roomsData, loading: loadingRooms }] = useAxios('http://localhost:5000/api/rooms');
    const [{ data: schedulesData, loading: loadingSchedules }] = useAxios(`http://localhost:5000/api/class/${selectedClass?._id}/schedule`)



    console.log(subjectsData, teachersData, roomsData)
    // Sample data for dropdowns (these will be replaced by API data)
    const subjectsList = subjectsData || [];
    const teachersList = teachersData || [];
    const roomsList = roomsData || [];

    // Time slots for the table
    const timeSlots = [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '12:00', end: '13:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
        { start: '16:00', end: '17:00' }
    ];

     // Update the schedule when API data is loaded
     useEffect(() => {
        if (schedulesData && schedulesData) {
            setScheduleData((prevData) => ({
                ...prevData,
                ...schedulesData, // Override the days that have data
            }));
        } else {
            console.log('No existing schedule found or error fetching schedule.');
        }
    }, [schedulesData]);

    // Handle dropdown change
    const handleDropdownChange = (day, slotIndex, field, value) => {
        setScheduleData((prevData) => {
            const daySchedule = [...prevData[day]];

            // If no entry exists, initialize an empty object
            if (!daySchedule[slotIndex]) {
                daySchedule[slotIndex] = {
                    start: timeSlots[slotIndex].start,
                    end: timeSlots[slotIndex].end,
                };
            }

            // Update the relevant field (subject, teacher, room)
            daySchedule[slotIndex][field] = value;

            // Update the schedule data
            return { ...prevData, [day]: daySchedule };
        });
    };

    // Render each time slot as a row in the table
    const renderTimeSlotRow = (timeSlot, index) => {
        const dayData = scheduleData?.[activeDay]?.[index] || {};

        return (
            <tr key={index} className="hover:bg-gray-700">
                <td className="py-2 px-4 text-center">
                    {timeSlot?.start} - {timeSlot?.end}
                </td>
                <td className="py-2 px-4">
                    <select
                        className="select select-bordered w-full"
                        value={dayData.subject || ''}
                        onChange={(e) => handleDropdownChange(activeDay, index, 'subject', e.target.value)}
                    >
                        <option value="">Select Subject</option>
                        {subjectsList?.map((subject, idx) => (
                            <option key={idx} value={subject?.subjectName}>
                                {subject?.subjectName}
                            </option>
                        ))}
                    </select>
                </td>
                <td className="py-2 px-4">
                    <select
                        className="select select-bordered w-full"
                        value={dayData.teacher || ''}
                        onChange={(e) => handleDropdownChange(activeDay, index, 'teacher', e.target.value)}
                    >
                        <option value="">Select Teacher</option>
                        {teachersList?.map((teacher, idx) => (
                            <option key={idx} value={teacher?.facultyName}>
                                {teacher?.facultyName}
                            </option>
                        ))}
                    </select>
                </td>
                <td className="py-2 px-4">
                    <select
                        className="select select-bordered w-full"
                        value={dayData.room || ''}
                        onChange={(e) => handleDropdownChange(activeDay, index, 'room', e.target.value)}
                    >
                        <option value="">Select Room</option>
                        {roomsList?.map((room, idx) => (
                            <option key={idx} value={room?.roomName}>
                                {room?.roomName}
                            </option>
                        ))}
                    </select>
                </td>
            </tr>
        );
    };

    const onSaveHandler = async () => {
        const processedSchedule = combineScheduleEntries(scheduleData)
        console.log(processedSchedule)
        try {
            const response = await axios.post(`http://localhost:5000/api/class/${selectedClass?._id}/schedule`, {
                processedSchedule,
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error saving schedule', error);
        }
    }

    return (
        <div className="modal modal-open">
            <div className="modal-box w-full max-w-5xl">
                <h2 className="text-2xl font-semibold mb-6 text-center">Schedule Maker {"( " + selectedClass?.className + " )"}</h2>

                {/* Day Tabs */}
                <div className="flex justify-center mb-8 space-x-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`btn btn-primary ${activeDay === day ? '' : 'btn-outline'}`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* Timetable */}
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th className="py-2 px-4">Time Slot</th>
                                <th className="py-2 px-4">Subject</th>
                                <th className="py-2 px-4">Teacher</th>
                                <th className="py-2 px-4">Room</th>
                            </tr>
                        </thead>
                        <tbody>{timeSlots.map(renderTimeSlotRow)}</tbody>
                    </table>
                </div>

                {/* Display current schedule data in JSON format */}
                <div className="bg-gray-700 p-4 rounded-lg mt-8">
                    <h3 className="text-lg font-semibold mb-2">Current Schedule Data:</h3>
                    <pre className="p-2 bg-gray-600 rounded-lg shadow-inner">{JSON.stringify(scheduleData, null, 2)}</pre>
                </div>
                <div className=' flex justify-end items-center'>
                    <button className="btn btn-neutral mt-8 mr-4 flex justify-center ic" onClick={closeScheduleMaker}>Close</button>
                    <button className="btn btn-accent mt-8 flex justify-center ic" onClick={onSaveHandler}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleMaker;

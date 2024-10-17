import React, { useEffect, useState } from 'react'
import './timetable.css'
import './pages.css'
import useAxios from 'axios-hooks';

// todo: add background color to the current day and background color to the current 
// subject according to the slot start


function Schedule({ userId = '', classId='' }) {
  console.log(userId)
  console.log(classId)

  const [timeTableData, setTimeTableData] = useState({})
  
  // const timetableData = {
  //   Monday: [
  //     { subject: 'CT20002 ML', teacher: 'MR', room: 'Room206', start: '11:00', end: '12:00' },
  //     { subject: 'CT20302 AI', teacher: 'Mr. Anup', start: '12:00', end: '13:00' },
  //     { subject: 'LUNCH', start: '13:00', end: '14:00' },
  //     { subject: 'CT20004 IWT', teacher: 'KS', start: '14:00', end: '15:00' },
  //     { subject: 'CT20002 IS', teacher: 'MK', start: '15:00', end: '16:00' },
  //   ],
  //   Tuesday: [
  //     { subject: 'CT20482 LAB III', teacher: 'A1 PS, SG', room: 'Lab207', start: '09:00', end: '11:00' },
  //     // { subject: 'CT20004 IWT LAB A2', teacher: 'US', room: 'Lab111', start: '09:00', end: '10:00' },
  //     { subject: 'CT20201 BDA', teacher: 'PG', room: 'Room206', start: '11:00', end: '12:00' },
  //     { subject: 'CT20302 AI', teacher: 'Mr. Anup', start: '12:00', end: '13:00' },
  //     { subject: 'LUNCH', start: '13:00', end: '14:00' },
  //     { subject: 'CT20481 LAB II', teacher: 'A1 MR, PK', room: 'Lab207', start: '14:00', end: '15:00' },
  //     { subject: 'CT20482 LAB III', teacher: 'A1 PS, SG', room: 'Lab208', start: '15:00', end: '16:00' },
  //   ],
  //   Wednesday: [
  //     { subject: 'CT20481 LAB II', teacher: 'A2 PK', room: 'Lab207', start: '09:00', end: '11:00' },
  //     { subject: 'CT20201 ML', teacher: 'MR', start: '11:00', end: '12:00' },
  //     { subject: 'CT20302 AI', teacher: 'Mr. Anup', start: '12:00', end: '13:00' },
  //     { subject: 'LUNCH', start: '13:00', end: '14:00' },
  //     { subject: 'Library', start: '14:00', end: '17:00' },
  //   ],
  //   Thursday: [
  //     { subject: 'CT20002 IS', teacher: 'DA', start: '09:00', end: '10:00' },
  //     { subject: 'CT20003 ADA', teacher: 'MR', start: '10:00', end: '11:00' },
  //     { subject: 'BDA/ML', teacher: 'A2, B2', room: 'Lab204', start: '11:00', end: '13:00' },
  //     { subject: 'LUNCH', start: '13:00', end: '14:00' },
  //     { subject: 'CT20004 IWT', teacher: 'US', start: '14:00', end: '15:00' },
  //     { subject: 'CT20500 Project', start: '15:00', end: '17:00' },
  //   ],
  //   Friday: [
  //     { subject: 'CT20004 IWT', teacher: 'KS', start: '09:00', end: '10:00' },
  //     { subject: 'CT20002 IS', teacher: 'DA', start: '10:00', end: '11:00' },
  //     { subject: 'BDA/ML', teacher: 'A2, B2', room: 'Lab208', start: '11:00', end: '13:00' },
  //     // { subject: 'CT20302 ML', teacher: 'DA', start: '12:00', end: '13:00' },
  //     { subject: 'LUNCH', start: '13:00', end: '14:00' },
  //     { subject: 'Library', start: '14:00', end: '17:00' },
  //   ],
  // };

  // const timeTableData = {
  //   "Monday": [
  //     {
  //       "start": "09:00",
  //       "end": "11:00",
  //       "subject": "CT20302 AI",
  //       "teacher": "KS",
  //       "room": "Room206"
  //     },
  //     { subject: 'LUNCH', start: '13:00', end: '14:00' },
  //     {
  //       "start": "11:00",
  //       "end": "12:00",
  //       "subject": "CT20002 ML",
  //       "teacher": "MR",
  //       "room": "Room207"
  //     },
  //     {
  //       "start": "12:00",
  //       "end": "13:00",
  //       "subject": "CT20302 AI",
  //       "teacher": "MR",
  //       "room": "Room207"
  //     },
  //     {
  //       "start": "14:00",
  //       "end": "15:00",
  //       "subject": "CT20302 AI",
  //       "teacher": "Mr. Anup",
  //       "room": "Room207"
  //     },
  //     {
  //       "start": "15:00",
  //       "end": "16:00",
  //       "subject": "CT20004 IWT",
  //       "teacher": "KS",
  //       "room": "Room208"
  //     },
  //     {
  //       "start": "16:00",
  //       "end": "17:00",
  //       "subject": "CT20302 AI",
  //       "teacher": "MK",
  //       "room": "Room208"
  //     }
  //   ],
  //   "Tuesday": [
  //     {
  //       "start": "09:00",
  //       "end": "11:00",
  //       "subject": "CT20002 IS",
  //       "teacher": "MK",
  //       "room": "Room208"
  //     },
  //     { subject: 'LUNCH', start: '13:00', end: '14:00' },
  //     {
  //       "start": "11:00",
  //       "end": "12:00",
  //       "subject": "CT20302 AI",
  //       "teacher": "MR",
  //       "room": "Room208"
  //     },
  //     {
  //       "start": "12:00",
  //       "end": "13:00",
  //       "subject": "CT20002 ML",
  //       "teacher": "Mr. Anup",
  //       "room": "Room207"
  //     },
  //     {
  //       "start": "14:00",
  //       "end": "15:00",
  //       "subject": "CT20004 IWT",
  //       "teacher": "KS",
  //       "room": "Room207"
  //     },
  //     {
  //       "start": "15:00",
  //       "end": "16:00",
  //       "subject": "CT20002 ML",
  //       "teacher": "KS",
  //       "room": "Room207"
  //     },
  //     {
  //       "start": "16:00",
  //       "end": "17:00",
  //       "subject": "CT20302 AI",
  //       "teacher": "KS",
  //       "room": "Room207"
  //     }
  //   ],
  //   "Wednesday": [
  //     {
  //       "start": "09:00",
  //       "end": "10:00",
  //       "subject": "CT20002 IS",
  //       "teacher": "MK",
  //       "room": "Room206"
  //     },
  //     { subject: 'LUNCH', start: '13:00', end: '14:00' },
  //     {
  //       "start": "10:00",
  //       "end": "11:00",
  //       "subject": "CT20004 IWT",
  //       "teacher": "MR",
  //       "room": "Room207"
  //     },
  //     {
  //       "start": "11:00",
  //       "end": "12:00",
  //       "subject": "CT20004 IWT",
  //       "teacher": "MR",
  //       "room": "Room209"
  //     },
  //     {
  //       "start": "12:00",
  //       "end": "13:00",
  //       "teacher": "KS",
  //       "room": "Room208"
  //     },
  //     {
  //       "start": "14:00",
  //       "end": "15:00",
  //       "subject": "CT20302 AI",
  //       "teacher": "Mr. Anup",
  //       "room": "Room208"
  //     },
  //     {
  //       "start": "15:00",
  //       "end": "16:00",
  //       "subject": "CT20302 AI",
  //       "teacher": "KS",
  //       "room": "Room209"
  //     },
  //     {
  //       "start": "16:00",
  //       "end": "17:00",
  //       "subject": "CT20004 IWT",
  //       "teacher": "Mr. Anup",
  //       "room": "Room208"
  //     }
  //   ],
  //   "Thursday": [
  //     {
  //       "start": "09:00",
  //       "end": "10:00",
  //       "subject": "CT20302 AI",
  //       "teacher": "KS",
  //       "room": "Room209"
  //     },
  //     { subject: 'LUNCH', start: '13:00', end: '14:00' },
  //     {
  //       "start": "10:00",
  //       "end": "11:00",
  //       "subject": "CT20004 IWT",
  //       "teacher": "Mr. Anup",
  //       "room": "Room208"
  //     },
  //     {
  //       "start": "11:00",
  //       "end": "13:00",
  //       "room": "Room208",
  //       "teacher": "Ms. Pooja",
  //       "subject": "CT20002 BDA"
  //     },
  //     {
  //       "start": "12:00",
  //       "end": "13:00",
  //       "subject": "CT20002 ML",
  //       "teacher": "KS",
  //       "room": "Room208"
  //     },
  //     {
  //       "start": "14:00",
  //       "end": "15:00",
  //       "room": "Room207",
  //       "teacher": "MK",
  //       "subject": "CT20302 AI"
  //     },
  //     {
  //       "start": "15:00",
  //       "end": "16:00",
  //       "teacher": "KS",
  //       "room": "Room207"
  //     },
  //     {
  //       "start": "16:00",
  //       "end": "17:00",
  //       "room": "Room207",
  //       "teacher": "MK",
  //       "subject": "CT20004 IWT"
  //     }
  //   ],
  //   "Friday": [
  //     {
  //       "start": "09:00",
  //       "end": "10:00",
  //       "subject": "CT20302 AI",
  //       "teacher": "Mr. Anup",
  //       "room": "Room207"
  //     },
  //     { subject: 'LUNCH', start: '13:00', end: '14:00' },
  //     {
  //       "start": "10:00",
  //       "end": "11:00",
  //       "room": "Room207",
  //       "subject": "CT20302 AI",
  //       "teacher": "KS"
  //     },
  //     {
  //       "start": "11:00",
  //       "end": "12:00",
  //       "subject": "CT20002 IS",
  //       "teacher": "KS",
  //       "room": "Room209"
  //     },
  //     {
  //       "start": "12:00",
  //       "end": "13:00",
  //       "subject": "CT20302 AI",
  //       "teacher": "MR",
  //       "room": "Room207"
  //     },
  //     {
  //       "start": "14:00",
  //       "end": "15:00",
  //       "subject": "CT20302 AI",
  //       "teacher": "MR",
  //       "room": "Room207"
  //     },
  //     {
  //       "start": "15:00",
  //       "end": "16:00",
  //       "subject": "CT20004 IWT",
  //       "teacher": "KS",
  //       "room": "Room208"
  //     },
  //     {
  //       "start": "16:00",
  //       "end": "17:00",
  //       "subject": "CT20002 ML",
  //       "teacher": "MR",
  //       "room": "Room206"
  //     }
  //   ]
  // }

  const [{ data: scheduleData, loading: loadingSchedule }] = useAxios(`http://localhost:5000/api/class/${classId}/schedule`)


  
  useEffect(() => {
    if (scheduleData) {
        console.log(scheduleData)
        setTimeTableData(scheduleData);
    }
    console.log('No existing schedule found or error fetching schedule.');
}, [loadingSchedule]);

  const timeSlots = Array.from(
    new Set(
      Object.values(timeTableData)
        .flat()
        .map((subject) => subject.start)
    )
  ).sort((a, b) => a.localeCompare(b));

  const getRowSpan = (subject) => {
    const startHour = parseInt(subject?.start?.split(':')[0], 10);
    const endHour = parseInt(subject?.end?.split(':')[0], 10);
    return endHour - startHour;
  };


  // To track occupied slots
  const occupiedSlots = {};

  return (
    <section className='schedule-section'>
      <table className='timetable'>
        <thead>
          <tr>
            <th>Time Slot</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, index) => (
            <tr key={index}>
              <td>{slot}</td>
              {Object.entries(timeTableData).map(([day, subjects]) => {
                console.log(day, slot)
                // Check if this time slot is already occupied
                if (occupiedSlots[`${day}-${slot}`]) {
                  console.log('Occupied slot > ', day, slot)
                  return null; // Skip rendering this cell
                }

                const subject = subjects.find((s) => s.start === slot);
                if (!subject) return <td key={day}></td>;

                const rowSpan = getRowSpan(subject);
                if (rowSpan > 1) {
                  // Mark the time slots this row span covers as occupied
                  for (let i = 0; i < rowSpan; i++) {
                    const nextSlot = parseInt(slot.split(':')[0], 10) + i;
                    occupiedSlots[`${day}-${String(nextSlot).padStart(2, '0')}:00`] = true;
                  }
                }

                if (subject.start === '13:00') return (
                  <td key={day} rowSpan={rowSpan}>
                    <strong>LUNCH</strong>
                  </td>
                );

                return (
                  <td key={day} rowSpan={rowSpan} style={{ verticalAlign: 'middle' }}>
                    <strong>{subject?.subject}</strong><br />
                    {subject?.teacher}<br />
                    {subject?.room}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default Schedule
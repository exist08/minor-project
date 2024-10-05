import React, { useState } from 'react'
import AnnouncementsList from './AnnouncementsList'
import AddAnnouncement from './AddAnnouncement'

function Announcements({ role = '' }) {
  const [refresh, setRefresh] = useState(false);

  // Function to trigger refetch
  const handleAddAnnouncement = () => {
    setRefresh(prev => !prev); // toggle refresh state to refetch announcements
  };

  return (
    <section className='p-8'>
      {role !== 'student' && (
        <AddAnnouncement onAdd={handleAddAnnouncement} />
      )}
      <AnnouncementsList refresh={refresh} />
    </section>
  )
}

export default Announcements
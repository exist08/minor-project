import React from 'react'
import AnnouncementsList from './AnnouncementsList'
import AddAnnouncement from './AddAnnouncement'

function Announcements({ role = '' }) {
  return (
    <section className='p-8'>
      {role !== 'student' && (
        <AddAnnouncement />
      )}
      <AnnouncementsList />
    </section>
  )
}

export default Announcements
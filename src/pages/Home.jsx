import React from 'react'

function Home({ userRole }) {
  const roleMessages = {
    student: "Your learning journey continues here",
    teacher: "Empower your teaching journey",
    admin: "Manage your institution effectively"
  };
  
  return (
    <section className='section p-8'>
      <h2>{roleMessages[userRole]}</h2>
    </section>
  )
}

export default Home
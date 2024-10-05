import React from 'react'

function Home({ userRole }) {
  const roleMessages = {
    student: "Your learning journey continues here",
    teacher: "Empower your teaching journey",
    admin: "Manage your institution effectively"
  };
  
  return (
    <section className='section p-8'>
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-slate-200">{roleMessages[userRole]}</h2>
    </section>
  )
}

export default Home
import { useState } from "react";

function MyGrades() {
  const [selectedTab, setSelectedTab] = useState('MST_I');

  const examData = {
    MST_I: [
      { subject: 'Math', marks: 16, maxMarks: 20 },
      { subject: 'English', marks: 18, maxMarks: 20 },
      { subject: 'Science', marks: 20, maxMarks: 20 },
      { subject: 'History', marks: 17, maxMarks: 20 },
      { subject: 'Geography', marks: 15, maxMarks: 20 },
    ],
    MST_II: [
      { subject: 'Math', marks: 18, maxMarks: 20 },
      { subject: 'English', marks: 16, maxMarks: 20 },
      { subject: 'Science', marks: 19, maxMarks: 20 },
      { subject: 'History', marks: 18, maxMarks: 20 },
      { subject: 'Geography', marks: 17, maxMarks: 20 },
    ],
    FINAL: [
      { subject: 'Math', marks: 20, maxMarks: 20 },
      { subject: 'English', marks: 19, maxMarks: 20 },
      { subject: 'Science', marks: 18, maxMarks: 20 },
      { subject: 'History', marks: 17, maxMarks: 20 },
      { subject: 'Geography', marks: 16, maxMarks: 20 },
    ],
  };

  return (
    <section className='section p-8'>
      <div className="grades-wrapper">

        <div className="tabs 2xl:text-3xl">
          {Object.keys(examData).map((exam) => (
            <button
              key={exam}
              className={`p-4 ${selectedTab === exam ? 'active' : ''}`}
              onClick={() => setSelectedTab(exam)}
            >
              {exam}
            </button>
          ))}
        </div>
        <div className="cards p-5">
          {examData[selectedTab].map((subject, index) => (
            <div key={index} className="card ">
              <h3>{subject?.subject}</h3>
              <p>{subject?.marks}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MyGrades
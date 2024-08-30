import React, {useState } from 'react'
import BookPlaceholder from '../assets/placeHolderImages/BookPlaceholder.png'

function StudyMaterial() {
  const [selectedTab, setSelectedTab] = useState('BDA');

  const studyMaterialData = {
    BDA: [
      {
        fileName: "Big Data with Hadoop",
        url: "https://example.com/bda-book.pdf",
        fileDescription: "This book provides an in-depth exploration of Big Data with Hadoop.",
        fileSize: "500 MB",
        uploadedBy: "John Doe",
        uploadedDate: "2022-01-01",
      }
    ],
    IWT: [
      {
        fileName: "Web Development",
        url: "https://example.com/bda-book.pdf",
        fileDescription: "This book provides an in-depth exploration of Big Data with Hadoop.",
        fileSize: "500 MB",
        uploadedBy: "John Doe",
        uploadedDate: "2022-01-01",
      }
    ],
    CC: [
      {
        fileName: "Cloud computing with AWS",
        url: "https://example.com/bda-book.pdf",
        fileDescription: "This book provides an in-depth exploration of Big Data with Hadoop.",
        fileSize: "500 MB",
        uploadedBy: "John Doe",
        uploadedDate: "2022-01-01",
      }
    ],
    ADA: [
      {
        fileName: "DAA",
        url: "https://example.com/bda-book.pdf",
        fileDescription: "This book provides an in-depth exploration of Big Data with Hadoop.",
        fileSize: "500 MB",
        uploadedBy: "John Doe",
        uploadedDate: "2022-01-01",
      }
    ],
    IS: [
      {
        fileName: "INFOmation securityt",
        url: "https://example.com/bda-book.pdf",
        fileDescription: "This book provides an in-depth exploration of Big Data with Hadoop.",
        fileSize: "500 MB",
        uploadedBy: "John Doe",
        uploadedDate: "2022-01-01",
      }
    ],
  }

  return (
    <section className='section p-8'>
      <div className="grades-wrapper">

        <div className="tabs 2xl:text-3xl">
          {Object.keys(studyMaterialData).map((exam) => (
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
        {studyMaterialData[selectedTab].map((material, index) => (
            <div key={index} className="card ">
              <img src={BookPlaceholder} alt="" />
              <h3>{material?.fileName}</h3>
              <p>{material?.url}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StudyMaterial
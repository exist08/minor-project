import useAxios from "axios-hooks";
import { useEffect, useState } from "react";

function MyGrades({ user = {} }) {
  const [{ data: marksData, loading: marksLoading }, fetchMarks] = useAxios(`http://localhost:5000/api/marks/${user._id}`);
  const [{ data: subjectsData, loading: subjectsLoading }, fetchSubjects] = useAxios('http://localhost:5000/api/subjects'); // Assuming this endpoint returns all subjects with their IDs and names

  const [selectedTab, setSelectedTab] = useState('MST_I');
  const [examData, setExamData] = useState({});

  useEffect(() => {
    if (!marksLoading && !subjectsLoading) {
      transformMarksData();
    }
  }, [marksLoading, subjectsLoading]);

  const transformMarksData = () => {
    if (!marksData || !subjectsData) return;

    // Create a subjectId to subjectName map for easy lookup
    const subjectMap = {};
    subjectsData.forEach(subject => {
      subjectMap[subject._id] = subject.subjectName;
    });

    // Function to remove duplicates based on subject ID
  const removeDuplicates = (examData) => {
    const seenSubjects = new Set();
    return examData.filter(item => {
      if (seenSubjects.has(item.subject)) {
        return false; // Duplicate found, ignore it
      } else {
        seenSubjects.add(item.subject);
        return true; // Unique, keep it
      }
    }).map(item => ({
      subject: subjectMap[item.subject], // Replace subject ID with subject name
      marks: item.marks,
      maxMarks: item.maxMarks,
    }));
  };

  const transformedMarks = {
    MST_I: removeDuplicates(marksData.grades.MST_I),
    MST_II: removeDuplicates(marksData.grades.MST_II),
    FINAL: removeDuplicates(marksData.grades.FINAL),
  };

    setExamData(transformedMarks);  // Set transformed data
  };

  // const examData = {
  //   MST_I: [
  //     { subject: 'Cloud Computing', marks: 16, maxMarks: 20 },
  //     { subject: 'Big Data Analytics', marks: 18, maxMarks: 20 },
  //     { subject: 'Internet and Web Technology', marks: 20, maxMarks: 20 },
  //     { subject: 'Analysis and Design of Algorithms', marks: 17, maxMarks: 20 },
  //     { subject: 'Information Security', marks: 15, maxMarks: 20 },
  //   ],
  //   MST_II: [
  //     { subject: 'Cloud Computing', marks: 18, maxMarks: 20 },
  //     { subject: 'Big Data Analytics', marks: 16, maxMarks: 20 },
  //     { subject: 'Internet and Web Technology', marks: 19, maxMarks: 20 },
  //     { subject: 'Analysis and Design of Algorithms', marks: 18, maxMarks: 20 },
  //     { subject: 'Information Security', marks: 17, maxMarks: 20 },
  //   ],
  //   FINAL: [
  //     { subject: 'Cloud Computing', marks: 64, maxMarks: 70 },
  //     { subject: 'Big Data Analytics', marks: 69, maxMarks: 70 },
  //     { subject: 'Internet and Web Technology', marks: 68, maxMarks: 70 },
  //     { subject: 'Analysis and Design of Algorithms', marks: 57, maxMarks: 70 },
  //     { subject: 'Information Security', marks: 63, maxMarks: 70 },
  //   ],

  // };

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
          {examData[selectedTab]?.map((subject, index) => (
            <div key={index} className="marks-card ">
              <h3 className="font-semibold h-16">{subject?.subject}</h3>
              <div>
                <div className="radial-progress" style={{ "--value": `${Math.floor(subject?.marks * 100 / subject?.maxMarks)}`, "--size": "10rem", "--thickness": "5px" }} role="progressbar"><span className="gained-marks">{subject?.marks}</span></div>
              </div>
              {/* <p>{subject?.marks}</p> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MyGrades
import { useState, useEffect, useRef } from "react";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);


function MyGrades2() {
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
        {examData[selectedTab]?.map((subjectData, index) => (
          <div key={index} className="card">
            <h3>{subjectData.subject}</h3>
            <DoughnutChart data={subjectData} />
            <h4 className="2xl:text-2xl">{subjectData?.marks}/{subjectData?.maxMarks}</h4>
          </div>
        ))}
        </div>
      </div>
    </section>
  )
}

const DoughnutChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartData = {
    labels: [],
    datasets: [
      {
        data: [data.marks, data.maxMarks - data.marks],
        backgroundColor: ['#4caf50', '#f0f0f0'],
        hoverBackgroundColor: ['#388e3c', '#e0e0e0'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    circumference: 180,
    rotation: -90,
    cutout: '75%',
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
  };

  useEffect(() => {
    // Clean up the chart instance when the component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return <Doughnut ref={chartRef} data={chartData} options={options} />;
};

export default MyGrades2
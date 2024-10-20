import React, { useEffect, useState } from 'react';
import useAxios from 'axios-hooks';

const StudyMaterial = () => {
  const [classId, setClassId] = useState(localStorage.getItem('classId'))

  const [{ data: materials, loading, error }, fetchMaterials] = useAxios(
    `http://localhost:5000/api/materials/class/${classId}`,
    { manual: true } // manual mode to control when to trigger the request
  );

  const [{ data: subjectsData, loading: subjectsLoading }, fetchSubjects] = useAxios('http://localhost:5000/api/subjects'); // Assuming this endpoint returns all subjects with their IDs and names


  // Create a subjectId to subjectName map for easy lookup
  const [subjectMapper, setSubjectMapper] = useState({})

  useEffect(() => {
    const subjectMap = {}
    subjectsData?.forEach(subject => {
      subjectMap[subject._id] = subject.subjectName;
    });
    setSubjectMapper(subjectMap)
  }, [subjectsLoading])

  console.log(materials)
  useEffect(() => {
    if (classId) {
      fetchMaterials(); // Trigger the request only when classId is present
    }
  }, []);

  if (loading) {
    return <p>Loading study materials...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error fetching study materials.</p>;
  }

  return (
    <section className="p-8 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Study Materials</h2>
      {materials?.length > 0 ? (
        <ul className="space-y-4">
          {materials.map((material) => (
            <li key={material._id} className="bg-gray-400 p-4 rounded-lg shadow text-gray-950">
              <p className="font-bold text-xl mb-1">{subjectMapper[material?.subjectId]}</p>
              <p className="font-semibold mb-2">{material?.fileName}</p>
              <a
                href={`http://localhost:5000/${material.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No study materials available.</p>
      )}
    </section>
  );
};

export default StudyMaterial;

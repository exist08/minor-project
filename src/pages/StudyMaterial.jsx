import React, { useEffect, useState } from 'react';
import useAxios from 'axios-hooks';

const StudyMaterial = () => {
    const [classId, setClassId] = useState(localStorage.getItem('classId'));
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [filteredMaterials, setFilteredMaterials] = useState([]);

    const [{ data: materials, loading, error }, fetchMaterials] = useAxios(
        `http://localhost:5000/api/materials/class/${classId}`,
        { manual: true }
    );

    const [{ data: subjectsData, loading: subjectsLoading }, fetchSubjects] = useAxios('http://localhost:5000/api/subjects');

    const [subjectMapper, setSubjectMapper] = useState({});

    useEffect(() => {
        const subjectMap = {};
        subjectsData?.forEach(subject => {
            subjectMap[subject._id] = subject.subjectName;
        });
        setSubjectMapper(subjectMap);
    }, [subjectsLoading]);

    useEffect(() => {
        if (classId) {
            fetchMaterials();
        }
    }, []);

    // Filter materials when selectedSubject or materials change
    useEffect(() => {
        if (materials) {
            if (selectedSubject === 'all') {
                setFilteredMaterials(materials);
            } else {
                const filtered = materials.filter(
                    material => material.subjectId === selectedSubject
                );
                setFilteredMaterials(filtered);
            }
        }
    }, [selectedSubject, materials]);

    // Get file type icon and color
    const getFileTypeInfo = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        let icon = '📄';
        let color = 'text-gray-600';

        switch (extension) {
            case 'pdf':
                icon = '📕';
                color = 'text-red-600';
                break;
            case 'doc':
            case 'docx':
                icon = '📘';
                color = 'text-blue-600';
                break;
            case 'ppt':
            case 'pptx':
                icon = '📙';
                color = 'text-orange-600';
                break;
            case 'xls':
            case 'xlsx':
                icon = '📗';
                color = 'text-green-600';
                break;
        }
        return { icon, color };
    };

    // Format the upload date
    const formatUploadDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return <p>Loading study materials...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error fetching study materials.</p>;
    }

    return (
        <section className="p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Study Materials</h2>
                <div className="flex items-center gap-2">
                    <label htmlFor="subjectFilter" className="text-gray-200 font-semibold">
                        Filter by Subject:
                    </label>
                    <select
                        id="subjectFilter"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="border rounded-md px-3 py-1.5 bg-white text-gray-800"
                    >
                        <option value="all">All Subjects</option>
                        {subjectsData?.map((subject) => (
                            <option key={subject._id} value={subject._id}>
                                {subject.subjectName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredMaterials?.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMaterials.map((material) => {
                        const { icon, color } = getFileTypeInfo(material.fileName);
                        return (
                            <li 
                                key={material._id} 
                                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-bold text-lg text-gray-900">
                                            {subjectMapper[material?.subjectId]}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className={color}>{icon}</span>
                                            <span className="truncate max-w-[200px]" title={material.fileName}>
                                                {material.fileName}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">
                                        {material.uploadDate && formatUploadDate(material.uploadDate)}
                                    </span>
                                    <a
                                        href={`http://localhost:5000/${material.filePath}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        Download
                                    </a>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-200 text-xl">
                    No study materials available {selectedSubject !== 'all' && 'for the selected subject'}.
                </p>
            )}
        </section>
    );
};

export default StudyMaterial;
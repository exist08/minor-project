import React from 'react';

const ListRenderer = ({ selectedTab, filteredData }) => {
  return (
    <div className="overflow-auto list-wrapper">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            {selectedTab === 'Teachers' && (
              <>
                <th>Name</th>
                <th>Abbreviation</th>
              </>
            )}
            {selectedTab === 'Subjects' && (
              <>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Abbreviation</th>
              </>
            )}
            {selectedTab === 'Rooms' && (
              <th>Room Name</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              {selectedTab === 'Teachers' && (
                <>
                  <td>{item.facultyName}</td>
                  <td>{item.facultyAbbreviation}</td>
                </>
              )}
              {selectedTab === 'Subjects' && (
                <>
                  <td>{item.subjectCode}</td>
                  <td>{item.subjectName}</td>
                  <td>{item.subjectAbbreviation}</td>
                </>
              )}
              {selectedTab === 'Rooms' && (
                <td>{item.roomName}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListRenderer;

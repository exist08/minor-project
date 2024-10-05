import useAxios from 'axios-hooks';
import React, { useState } from 'react';

const ListRenderer = ({ selectedTab, filteredData, setReftechCallback ,addToast = () => { } }) => {
  const [selectedId, setSelectedId] = useState('')

  // Remove the URL from the initial useAxios configuration
  const [{ loading: deletingRes, error: deleteError }, executeDeleteRes] = useAxios(
    { method: 'DELETE' },
    { manual: true }
  );

  const handleOnDelete = async (e, id) => {
    e.preventDefault();
    setSelectedId(id); // Keep this if you need it for UI purposes

    try {
      // Construct the URL here, when we know the ID for sure
      const deleteUrl = `http://localhost:5000/api/${selectedTab.toLowerCase()}/${id}`;

      await executeDeleteRes({
        url: deleteUrl
      });
      setReftechCallback(prev=>prev+1)
      addToast(`${selectedTab} deleted successfully`);
    } catch (error) {
      console.error(`There was an error deleting the ${selectedTab}!`, error);
    }
  };

  return (
    <div className="overflow-auto list-wrapper">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            {selectedTab === 'Teachers' && (
              <>
                <th>Name</th>
                <th>Abbreviation</th>
                <th>Username</th>
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
            <tr key={item._id} className="hover:border-2 hover:border-red-500 mx-2 relative ">
              {selectedTab === 'Teachers' && (
                <>
                  <td>{item?.facultyName}</td>
                  <td>{item?.facultyAbbreviation}</td>
                  <td>{item?.username}</td>
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
              <i onClick={(e) => handleOnDelete(e, item._id)} className="h-full w-10 flex justify-center items-center absolute right-0 text-xl cursor-pointer hover:text-red-600"><ion-icon name="trash-outline"></ion-icon>
              </i>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListRenderer;

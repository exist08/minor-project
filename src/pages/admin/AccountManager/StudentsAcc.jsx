import useAxios from 'axios-hooks';
import React, { useState } from 'react'

function StudentsAcc() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch classes
  const [{ data: users = [], loading: fetchingUsers, error: fetchError }, refetchUsers] = useAxios(
    'http://localhost:5000/api/users/students',
    { manual: true }
  );

  const selectedTab = "Students";

  const filteredData = users.filter(item => {
    return Object.values(item).some(val =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  return (
    <div>
      <div className="title-n-btns">
        <h1 className="xl:text-2xl md:text-xl text-base">{selectedTab}</h1>
        <div className="adders flex gap-2">
          <button className="btn btn-active" onClick={() => setShowModal(true)}>
            Add New {selectedTab}
          </button>
          <button className="btn btn-active" onClick={() => setShowCSVModal(true)}>
            Add Multiple {selectedTab}
          </button>
        </div>
      </div>

      <div className="form-control mt-1">
        <input
          type="text"
          placeholder={`Search ${selectedTab.toLowerCase()}...`}
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-auto list-wrapper">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              {selectedTab === 'Teachers' && (
                <>
                  <th>Username</th>
                  <th>Name</th>
                </>
              )}
              {selectedTab === 'Students' && (
                <>
                  <th>Username</th>
                  <th>Name</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id}>
                {selectedTab === 'Teachers' && (
                  <>
                    <td>{item.username}</td>
                    <td>{item.name}</td>
                  </>
                )}
                {selectedTab === 'Students' && (
                  <>
                    <td>{item.username}</td>
                    <td>{item.name}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentsAcc
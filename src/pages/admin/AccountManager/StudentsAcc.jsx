import useAxios from 'axios-hooks';
import React, { useState } from 'react'

function StudentsAcc() {
  const [showModal, setShowModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'teacher',
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Fetch classes
  const [{ data: users = [], loading: fetchingUsers, error: fetchError }, refetchUsers] = useAxios(
    'http://localhost:5000/api/users/students',
    { manual: true }
  );


  // Fetch classes on component mount
  React.useEffect(() => {
    refetchUsers();
  }, [refetchUsers]);

  // Create new user
  const [{ loading: creatingUser, error: createError }, executeCreateUser] = useAxios(
    { url: 'http://localhost:5000/api/users/accounts', method: 'POST' },
    { manual: true }
  );

  const selectedTab = "Students";

  // Filter students by searchTerm
  const filteredData = users.filter(item => {
    const { username, studentDetails } = item;
    const studentName = studentDetails?.name || '';  // Handle student name
    const enrollment = studentDetails?.enrollment || '';  // Handle enrollment
    return (
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    executeCreateUser({ data: form })
      .then(() => {
        alert('Teacher added successfully');
        setShowModal(false); // Close modal after class is created
        refetchUsers(); // Fetch updated class list after creation
      })
      .catch((error) => {
        console.error('There was an error creating the class!', error);
      });
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
                {selectedTab === 'Students' && (
                  <>
                    <td>{item.username}</td>
                    <td>{item.studentDetails?.name}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add New Student</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="input input-bordered"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="text"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered"
                  onChange={handleChange}
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  {creatingUser ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {
        showCSVModal && <AccountsCsvUploader closeModal={() => setShowCSVModal(false)} selectedTab={selectedTab} />
      }
    </div>
  )
}

export default StudentsAcc
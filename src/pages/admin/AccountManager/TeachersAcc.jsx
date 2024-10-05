import useAxios from 'axios-hooks';
import React, { useState } from 'react'
import AccountsCsvUploader from './AccountsCsvUploader';

function TeachersAcc({ addToast = () => {}}) {
  const [selectedId, setSelectedId] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const selectedTab = "Teachers";
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'teacher',
  });
  

  // Fetch classes
  const [{ data: users = [], loading: fetchingUsers, error: fetchError }, refetchUsers] = useAxios(
    'http://localhost:5000/api/users/teachers',
    { manual: true }
  );
  
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
      const deleteUrl = `http://localhost:5000/api/users/teachers/${id}`;

      await executeDeleteRes({
        url: deleteUrl
      });
      addToast(`Teacher deleted successfully`);
      refetchUsers();
    } catch (error) {
      console.error(`There was an error deleting the ${selectedTab}!`, error);
      addToast(`Deletion Failed: ${error.message}`,'error');
    }
  };


  // Fetch classes on component mount
  React.useEffect(() => {
    refetchUsers();
  }, [refetchUsers]);

  // Create new user
  const [{ loading: creatingUser, error: createError }, executeCreateUser] = useAxios(
    { url: 'http://localhost:5000/api/users/accounts', method: 'POST' },
    { manual: true }
  );


  const filteredData = users.filter(item => {
    return Object.values(item).some(val =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCreateUser({ data: form })
      .then(() => {
        addToast('Teacher added successfully','success');
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
              {selectedTab === 'Teachers' && (
                <>
                  <th>Username</th>
                  <th>Name</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id} className="hover:border-2 hover:border-red-500 mx-2 relative transition-colors duration-300">
                {selectedTab === 'Teachers' && (
                  <>
                    <td>{item.username}</td>
                    <td>{item?.teacherDetails?.facultyName}</td>
                  </>
                )}
                <i onClick={(e) => handleOnDelete(e, item._id)} className="h-full w-10 flex justify-center items-center absolute right-0 text-xl transition-colors cursor-pointer hover:text-red-600"><ion-icon name="trash-outline"></ion-icon>
                </i>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add New Teacher</h3>
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

export default TeachersAcc
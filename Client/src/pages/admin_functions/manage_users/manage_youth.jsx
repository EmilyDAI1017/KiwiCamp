// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { debounce } from 'lodash';

// function ManageYouth() {
//   const [campers, setCampers] = useState([]);
//   const [isEditing, setIsEditing] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchInput, setSearchInput] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentField, setCurrentField] = useState(null);

//   useEffect(() => {
//     axios.get('http://localhost:3000/admin/manage_youth')
//       .then(response => {
//         setCampers(response.data);
//       })
//       .catch(error => console.error('Error fetching campers:', error));
//   }, []);

//   const handleInputChange = useCallback(
//     debounce((id, name, value) => {
//       setCampers(previousCampers =>
//         previousCampers.map(camper =>
//           camper.camper_id === id ? { ...camper, [name]: value } : camper
//         )
//       );
//     }, 300),
//     []
//   );

//   const handleChange = (id, name, value) => {
//     setCampers(previousCampers =>
//       previousCampers.map(camper =>
//         camper.camper_id === id ? { ...camper, [name]: value } : camper
//       )
//     );
//     handleInputChange(id, name, value);
//   };

//   const validateCamper = (camper) => {
//     if (!camper.first_name || !camper.last_name || !camper.email || !camper.phone_num ||
//       !camper.gender || !camper.dob || !camper.parent_guardian_name ||
//       !camper.parent_guardian_phone || !camper.parent_guardian_email ||
//       !camper.relationship_to_camper || !camper.activity_preferences) {
//       alert('Please fill in all fields');
//       return false;
//     }

//     const phoneNumPattern = /^\d{10}$/;
//     if (!phoneNumPattern.test(camper.phone_num)) {
//       alert('Please enter a valid phone number');
//       return false;
//     }

//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(camper.email) || !emailPattern.test(camper.parent_guardian_email)) {
//       alert('Please enter a valid email address');
//       return false;
//     }

//     const today = new Date();
//     const dob = new Date(camper.dob);
//     if (dob >= today) {
//       alert('Date of birth cannot be in the future');
//       return false;
//     }

//     return true;
//   };

//   const handleSave = (id) => {
//     setIsLoading(true);
//     const camper = campers.find(camper => camper.camper_id === id);
//     const updatedCamper = {
//       ...camper,
//       dob: formatDateForBackend(camper.dob)
//     };

//     if (!validateCamper(updatedCamper)) {
//       alert('Please check your inputs!');
//       setIsLoading(false);
//       return;
//     }

    
//     axios.put(`http://localhost:3000/admin/manage_youth/${id}`, updatedCamper)
//       .then(response => {
//         setIsEditing(null);
//         alert('Camper profile updated successfully');
//       })
//       .catch(error => {
//         console.error('Error updating camper:', error);
//         alert('Failed to update camper profile');
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   const handleSearch = () => {
//     setSearchTerm(searchInput.toLowerCase());
//   };

//   const filteredCampers = campers.filter(camper =>
//     camper.first_name.toLowerCase().includes(searchTerm) ||
//     camper.last_name.toLowerCase().includes(searchTerm) ||
//     camper.username.toLowerCase().includes(searchTerm) ||
//     camper.phone_num.includes(searchTerm)
//   );

//   const toggleEdit = (id) => {
//     if (isEditing === id) {
//       setIsEditing(null);
//     } else {
//       setIsEditing(id);
//     }
//   };

//   function formatDateForBackend(dateStr) {
//     const date = new Date(dateStr);
//     if (!isNaN(date.getTime())) {
//       return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
//     }
//     return null;
//   }

//   return (
//     <div className="main-content">
//       <h1 className="text-xl font-bold mb-4">Manage Youth Campers</h1>
//       <div className="search-container my-4">
//       <input
//         type="text"
//         value={searchInput}
//         onChange={(e) => setSearchInput(e.target.value)}
//         className='form-input rounded-md shadow-sm mt-1 w-1/3 '
//         placeholder="Search campers by their username/name/phone number..."
//       />

//       <button 
//       className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
//       onClick={handleSearch}>Search</button>
//       <br />
//       </div>
//       <button className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out" onClick={() => window.history.back()}>
//                     Manage other accounts
//                 </button>


//       <table className="table-auto w-full text-left whitespace-no-wrap">
//         <thead>
//           <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
//             <th className="px-4 py-3">User Name</th>
//             <th className="px-4 py-3">First Name</th>
//             <th className="px-4 py-3">Last Name</th>
//             <th className="px-4 py-3">Email</th>
//             <th className="px-4 py-3">Phone Number</th>
//             <th className="px-4 py-3">Gender</th>
//             <th className="px-4 py-3">DOB</th>
//             <th className="px-4 py-3">Parent/Guardian Name</th>
//             <th className="px-4 py-3">Parent/Guardian Phone</th>
//             <th className="px-4 py-3">Parent/Guardian Email</th>
//             <th className="px-4 py-3">Relationship</th>
//             <th className="px-4 py-3">Activities</th>
//             <th className="px-4 py-3">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredCampers.map(camper => (
//             <tr key={camper.camper_id} className="bg-white border-b hover:bg-gray-50">
//               <td className="px-4 py-3">{camper.username}</td>
//               {isEditing === camper.camper_id ? (
//                 <>
//                   <EditableField type="text" name="first_name" value={camper.first_name} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
//                   <EditableField type="text" name="last_name" value={camper.last_name} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
//                   <EditableField type="email" name="email" value={camper.email} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
//                   <EditableField type="text" name="phone_num" value={camper.phone_num} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
//                   <EditableField
//                     type="select"
//                     name="gender"
//                     value={camper.gender}
//                     onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)}
//                     setCurrentField={setCurrentField}
//                     currentField={currentField}
//                     options={[
//                       { value: "Male", label: "Male" },
//                       { value: "Female", label: "Female" },
//                       { value: "Other", label: "Other" }
//                     ]}
//                   />
//                   <EditableField type="date" name="dob" value={formatDateForInput(camper.dob)} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
//                   <EditableField type="text" name="parent_guardian_name" value={camper.parent_guardian_name} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
//                   <EditableField type="text" name="parent_guardian_phone" value={camper.parent_guardian_phone} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
//                   <EditableField type="email" name="parent_guardian_email" value={camper.parent_guardian_email} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
//                   <EditableField type="text" name="relationship_to_camper" value={camper.relationship_to_camper} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
//                   <EditableField type="text" name="activity_preferences" value={camper.activity_preferences} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
//                 </>
//               ) : (
//                 <>
//                   <td>{camper.first_name}</td>
//                   <td>{camper.last_name}</td>
//                   <td>{camper.email}</td>
//                   <td>{camper.phone_num}</td>
//                   <td>{camper.gender}</td>
//                   <td>{formatDateDisplay(camper.dob)}</td>
//                   <td>{camper.parent_guardian_name}</td>
//                   <td>{camper.parent_guardian_phone}</td>
//                   <td>{camper.parent_guardian_email}</td>
//                   <td>{camper.relationship_to_camper}</td>
//                   <td>{camper.activity_preferences}</td>
//                 </>
//               )}
//               <td className="px-4 py-3">
//                 {isEditing === camper.camper_id ? (
//                   <div>
//                     <button onClick={() => {
//                       if (validateCamper(camper)) {
//                         handleSave(camper.camper_id);
//                         setIsEditing(null);
//                       }
//                     }}
//                       className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Save</button>
//                     <button onClick={() => { setIsEditing(null); window.location.reload(); }}
//                       className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Cancel</button>
//                   </div>
//                 ) : (
//                   <button onClick={() => toggleEdit(camper.camper_id)}
//                     className="text-sm bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Edit</button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   function EditableField({ type = "text", name, value, onChange, setCurrentField, currentField, options = [] }) {
//     const [inputValue, setInputValue] = useState(value);
//     const inputRef = useRef(null);

//     useEffect(() => {
//       setInputValue(value);
//     }, [value]);

//     const handleLocalChange = (e) => {
//       setInputValue(e.target.value);
//       onChange(e);
//       setCurrentField(e.target.name);
//     };

//     useEffect(() => {
//       if (inputRef.current && currentField === name) {
//         inputRef.current.focus();
//       }
//     }, [currentField, name]);

//     if (type === "select") {
//       return (
//         <td>
//           <select
//             name={name}
//             value={inputValue}
//             onChange={handleLocalChange}
//             className="form-select rounded-md shadow-sm mt-1 block w-full"
//             ref={inputRef}
//           >
//             {options.map(option => (
//               <option key={option.value} value={option.value}>{option.label}</option>
//             ))}
//           </select>
//         </td>
//       );
//     }

//     return (
//       <td>
//         <input
//           type={type}
//           name={name}
//           value={inputValue}
//           onChange={handleLocalChange}
//           className="form-input rounded-md shadow-sm mt-1 block w-full"
//           autoComplete="off"
//           ref={inputRef}
//         />
//       </td>
//     );
//   }

//   function formatDateForInput(dateStr) {
//     const date = new Date(dateStr);
//     if (!isNaN(date.getTime())) {
//       return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
//     }
//     return '';
//   }

//   function formatDateDisplay(dateStr) {
//     const date = new Date(dateStr);
//     if (!isNaN(date.getTime())) {
//       return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
//     }
//     return "Invalid date";
//   }
// }

// export default ManageYouth;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

function ManageYouth() {
  const [campers, setCampers] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentField, setCurrentField] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // State to manage form visibility
  const [newCamper, setNewCamper] = useState({
    username: '', first_name: '', last_name: '', email: '',
    phone_num: '', gender: '', dob: '', parent_guardian_name: '',
    parent_guardian_phone: '', parent_guardian_email: '', relationship_to_camper: '',
    activity_preferences: '', role: 'Youth'
  });

  const fetchCampers = () => {
    axios.get('http://localhost:3000/admin/manage_youth')
      .then(response => {
        setCampers(response.data);
      })
      .catch(error => console.error('Error fetching campers:', error));
  };


  useEffect(() => {
  fetchCampers();
  }, []);

  const handleInputChange = useCallback(
    debounce((id, name, value) => {
      setCampers(previousCampers =>
        previousCampers.map(camper =>
          camper.camper_id === id ? { ...camper, [name]: value } : camper
        )
      );
    }, 300),
    []
  );

  const handleChange = (id, name, value) => {
    setCampers(previousCampers =>
      previousCampers.map(camper =>
        camper.camper_id === id ? { ...camper, [name]: value } : camper
      )
    );
    handleInputChange(id, name, value);
  };

  const handleNewCamperChange = (e) => {
    const { name, value } = e.target;
    setNewCamper(prevState => ({ ...prevState, [name]: value }));
  };

  const validateCamper = (camper) => {
    if (!camper.first_name || !camper.last_name || !camper.email || !camper.phone_num ||
      !camper.gender || !camper.dob || !camper.parent_guardian_name ||
      !camper.parent_guardian_phone || !camper.parent_guardian_email ||
      !camper.relationship_to_camper || !camper.activity_preferences) {
      alert('Please fill in all fields');
      return false;
    }

    const phoneNumPattern = /^\d{10}$/;
    if (!phoneNumPattern.test(camper.phone_num)) {
      alert('Please enter a valid phone number');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(camper.email) || !emailPattern.test(camper.parent_guardian_email)) {
      alert('Please enter a valid email address');
      return false;
    }

    const today = new Date();
    const dob = new Date(camper.dob);
    if (dob >= today) {
      alert('Date of birth cannot be in the future');
      return false;
    }

    return true;
  };

  const handleSave = (id) => {
    setIsLoading(true);
    const camper = campers.find(camper => camper.camper_id === id);
    const updatedCamper = {
      ...camper,
      dob: formatDateForBackend(camper.dob)
    };

    if (!validateCamper(updatedCamper)) {
      alert('Please check your inputs!');
      setIsLoading(false);
      return;
    }

    axios.put(`http://localhost:3000/admin/manage_youth/${id}`, updatedCamper)
      .then(response => {
        setIsEditing(null);
        alert('Camper profile updated successfully');
        fetchCampers(); // Fetch updated campers list
      })
      .catch(error => {
        console.error('Error updating camper:', error);
        alert('Failed to update camper profile');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    setSearchTerm(searchInput.toLowerCase());
  };

  const handleAddCamper = () => {
    if (!validateCamper(newCamper)) {
      alert('Please check your inputs!');
      return;
    }

    axios.post('http://localhost:3000/admin/manage_youth', newCamper)
      .then(response => {
        alert("Camper added successfully");
        fetchCampers(); // Fetch updated campers list
        setNewCamper({
          username: '', first_name: '', last_name: '', email: '',
          phone_num: '', gender: '', dob: '', parent_guardian_name: '',
          parent_guardian_phone: '', parent_guardian_email: '', relationship_to_camper: '',
          activity_preferences: ''
        });
        setShowAddForm(false); // Hide the form after adding the camper
      })
      .catch(error => {
        console.error('Error adding camper:', error);
        alert('Failed to add camper');
      });
  };

  const handleDeleteCamper = (id) => {
    if (!window.confirm('Are you sure you want to delete this camper?')) {
      return;
    }

    axios.delete(`http://localhost:3000/admin/manage_youth/${id}`)
      .then(response => {
        alert("Camper deleted successfully");
        fetchCampers(); // Fetch updated campers list
      })
      .catch(error => {
        console.error('Error deleting camper:', error);
        alert('Failed to delete camper');
      });
  };

  const filteredCampers = campers.filter(camper =>
    camper.first_name.toLowerCase().includes(searchTerm) ||
    camper.last_name.toLowerCase().includes(searchTerm) ||
    camper.username.toLowerCase().includes(searchTerm) ||
    camper.phone_num.includes(searchTerm)
  );

  const toggleEdit = (id) => {
    if (isEditing === id) {
      setIsEditing(null);
    } else {
      setIsEditing(id);
    }
  };

  function formatDateForBackend(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    }
    return null;
  }

  return (
    <div className="main-content">
      <h1 className="text-xl font-bold mb-4">Manage Youth Campers</h1>
      <div className="search-container my-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="form-input rounded-md shadow-sm mt-1 w-1/3 pointer-events-auto"
          placeholder="Search campers by their username/name/phone number..."
        />
        <button 
          className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={handleSearch}
        >
          Search
        </button>
        
  
      <button
        className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
        onClick={() => window.history.back()}
      >
        Manage other accounts
      </button>
      </div>
      <button
         className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 focus:outline-none"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Add later' : 'Add a new youth camper'}
      </button>
      {showAddForm && (
        <div className="new-camper-form my-4">
          <h2 className="text-lg font-bold mb-2">Add New Camper</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newCamper.username}
            onChange={handleNewCamperChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newCamper.password}
            onChange={handleNewCamperChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={newCamper.first_name}
            onChange={handleNewCamperChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={newCamper.last_name}
            onChange={handleNewCamperChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newCamper.email}
            onChange={handleNewCamperChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="phone_num"
            placeholder="Phone Number"
            value={newCamper.phone_num}
            onChange={handleNewCamperChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <select
            name="gender"
            value={newCamper.gender}
            onChange={handleNewCamperChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="date"
            name="dob"
            value={newCamper.dob}
            onChange={handleNewCamperChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="parent_guardian_name"
            placeholder="Parent/Guardian Name"
            value={newCamper.parent_guardian_name}
            onChange={handleNewCamperChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="parent_guardian_phone"
            placeholder="Parent/Guardian Phone"
            value={newCamper.parent_guardian_phone}
            onChange={handleNewCamperChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="email"
            name="parent_guardian_email"
            placeholder="Parent/Guardian Email"
            value={newCamper.parent_guardian_email}
            onChange={handleNewCamperChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="relationship_to_camper"
            placeholder="Relationship to Camper"
            value={newCamper.relationship_to_camper}
            onChange={handleNewCamperChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="text"
            name="activity_preferences"
            placeholder="Activity Preferences"
            value={newCamper.activity_preferences}
            onChange={handleNewCamperChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <button
            onClick={handleAddCamper}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none"
          >
            Add Camper
          </button>
        </div>
      )}
      <table className="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
            <th className="px-4 py-3">User Name</th>
            <th className="px-4 py-3">First Name</th>
            <th className="px-4 py-3">Last Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone Number</th>
            <th className="px-4 py-3">Gender</th>
            <th className="px-4 py-3">DOB</th>
            <th className="px-4 py-3">Parent/Guardian Name</th>
            <th className="px-4 py-3">Parent/Guardian Phone</th>
            <th className="px-4 py-3">Parent/Guardian Email</th>
            <th className="px-4 py-3">Relationship</th>
            <th className="px-4 py-3">Activities</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCampers.map(camper => (
            <tr key={camper.camper_id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-3">{camper.username}</td>
              {isEditing === camper.camper_id ? (
                <>
                  <EditableField type="text" name="first_name" value={camper.first_name} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="last_name" value={camper.last_name} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="email" name="email" value={camper.email} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="phone_num" value={camper.phone_num} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField
                    type="select"
                    name="gender"
                    value={camper.gender}
                    onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)}
                    setCurrentField={setCurrentField}
                    currentField={currentField}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" }
                    ]}
                  />
                  <EditableField type="date" name="dob" value={formatDateForInput(camper.dob)} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="parent_guardian_name" value={camper.parent_guardian_name} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="parent_guardian_phone" value={camper.parent_guardian_phone} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="email" name="parent_guardian_email" value={camper.parent_guardian_email} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="relationship_to_camper" value={camper.relationship_to_camper} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                  <EditableField type="text" name="activity_preferences" value={camper.activity_preferences} onChange={(e) => handleChange(camper.camper_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                </>
              ) : (
                <>
                  <td>{camper.first_name}</td>
                  <td>{camper.last_name}</td>
                  <td>{camper.email}</td>
                  <td>{camper.phone_num}</td>
                  <td>{camper.gender}</td>
                  <td>{formatDateDisplay(camper.dob)}</td>
                  <td>{camper.parent_guardian_name}</td>
                  <td>{camper.parent_guardian_phone}</td>
                  <td>{camper.parent_guardian_email}</td>
                  <td>{camper.relationship_to_camper}</td>
                  <td>{camper.activity_preferences}</td>
                </>
              )}
              <td className="px-4 py-3">
                {isEditing === camper.camper_id ? (
                  <div>
                    <button onClick={() => {
                      if (validateCamper(camper)) {
                        handleSave(camper.camper_id);
                        setIsEditing(null);
                      }
                    }}
                      className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Save</button>
                    <button onClick={() => { setIsEditing(null); window.location.reload(); }}
                      className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                  </div>
                ) : (
                  <div>
                  <button onClick={() => toggleEdit(camper.camper_id)}
                    className="text-sm bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Edit</button>
                    <button onClick={() => handleDeleteCamper(camper.camper_id)}
                    className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function EditableField({ type = "text", name, value, onChange, setCurrentField, currentField, options = [] }) {
    const [inputValue, setInputValue] = useState(value);
    const inputRef = useRef(null);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleLocalChange = (e) => {
      setInputValue(e.target.value);
      onChange(e);
      setCurrentField(e.target.name);
    };

    useEffect(() => {
      if (inputRef.current && currentField === name) {
        inputRef.current.focus();
      }
    }, [currentField, name]);

    if (type === "select") {
      return (
        <td>
          <select
            name={name}
            value={inputValue}
            onChange={handleLocalChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
            ref={inputRef}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </td>
      );
    }

    return (
      <td>
        <input
          type={type}
          name={name}
          value={inputValue}
          onChange={handleLocalChange}
          className="form-input rounded-md shadow-sm mt-1 block w-full"
          autoComplete="off"
          ref={inputRef}
        />
      </td>
    );
  }

  function formatDateForInput(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    }
    return '';
  }

  function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
  }
}

export default ManageYouth;

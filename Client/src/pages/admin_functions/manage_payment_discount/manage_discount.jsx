import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import '../../../App.css';

function ManageDiscounts() {
  const [discounts, setDiscounts] = useState([]);
  const [camps, setCamps] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentField, setCurrentField] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    camp_id: '', discount_type: '', discount_start_date: '', discount_end_date: '',
    discount_percentage: ''
  });

  useEffect(() => {
    fetchDiscounts();
    fetchCamps();
  }, []);

  const fetchDiscounts = () => {
    axios.get('http://localhost:3000/admin/manage_discounts')
      .then(response => {
        setDiscounts(response.data);
      })
      .catch(error => console.error('Error fetching discounts:', error));
  };

  const fetchCamps = () => {
    axios.get('http://localhost:3000/admin/camps_for_discounts')
      .then(response => {
        setCamps(response.data);
      })
      .catch(error => console.error('Error fetching camps:', error));
  };

  const handleInputChange = useCallback(
    debounce((id, name, value) => {
      setDiscounts(previousDiscounts =>
        previousDiscounts.map(discount =>
          discount.discount_id === id ? { ...discount, [name]: value } : discount
        )
      );
    }, 300),
    []
  );

  const handleChange = (id, name, value) => {
    setDiscounts(previousDiscounts =>
      previousDiscounts.map(discount =>
        discount.discount_id === id ? { ...discount, [name]: value } : discount
      )
    );
    handleInputChange(id, name, value);
  };

  const handleNewDiscountChange = (e) => {
    const { name, value } = e.target;
    setNewDiscount(prevState => ({ ...prevState, [name]: value }));
  };

  const validateDiscount = (discount) => {
    if (!discount.camp_id || !discount.discount_type || !discount.discount_percentage) {
      alert('Please fill in all required fields');
      return false;
    }

    const percentagePattern = /^[0-9]+(\.[0-9]{1,2})?$/;
    if (!percentagePattern.test(discount.discount_percentage)) {
      alert('Please enter a valid discount percentage');
      return false;
    }

    return true;
  };

  const handleSave = (id) => {
    setIsLoading(true);
    const discount = discounts.find(discount => discount.discount_id === id);
    const updatedDiscount = { ...discount,
      discount_start_date: formatDateForBackend(discount.discount_start_date),
      discount_end_date: formatDateForBackend(discount.discount_end_date)};

    if (!validateDiscount(updatedDiscount)) {
      setIsLoading(false);
      return;
    }

    axios.put(`http://localhost:3000/admin/manage_discounts/${id}`, updatedDiscount)
      .then(response => {
        setIsEditing(null);
        alert('Discount updated successfully');
        fetchDiscounts();
      })
      .catch(error => {
        console.error('Error updating discount:', error);
        alert('Failed to update discount');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    setSearchTerm(searchInput.toLowerCase());
  };

  const handleAddDiscount = () => {
    const sanitizedDiscount = sanitizeDiscount(newDiscount);
    if (!validateDiscount(sanitizedDiscount)) {
      return;
    }

    axios.post('http://localhost:3000/admin/manage_discounts', sanitizedDiscount)
      .then(response => {
        alert("Discount added successfully");
        fetchDiscounts();
        setNewDiscount({
          camp_id: '', discount_type: '', discount_start_date: '', discount_end_date: '',
          discount_percentage: ''
        });
        setShowAddForm(false);
      })
      .catch(error => {
        console.error('Error adding discount:', error);
        alert('Failed to add discount');
      });
  };

  const sanitizeDiscount = (discount) => {
    return Object.fromEntries(
      Object.entries(discount).map(([key, value]) => [key, value || null])
    );
  };

  const handleDeleteDiscount = (id) => {
    if (!window.confirm('Are you sure you want to delete this discount?')) {
      return;
    }

    axios.delete(`http://localhost:3000/admin/manage_discounts/${id}`)
      .then(response => {
        alert("Discount deleted successfully");
        fetchDiscounts();
      })
      .catch(error => {
        console.error('Error deleting discount:', error);
        alert('Failed to delete discount');
      });
  };

  const filteredDiscounts = discounts.filter(discount =>
    discount.discount_type.toLowerCase().includes(searchTerm) ||
    discount.camp_id.toString().includes(searchTerm)
  );

  const toggleEdit = (id) => {
    if (isEditing === id) {
      setIsEditing(null);
    } else {
      setIsEditing(id);
    }
  };

  function formatDateForBackend(dateStr) {
    if (!dateStr) return null; // Return "N/A" or any default text for null dates

    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    }
    return null;
  }

  return (
    <div className="main-content">
      <h1 className="text-xl font-bold mb-4">Manage Discounts</h1>
      <div className="search-container my-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="form-input rounded-md shadow-sm mt-1 w-1/3"
          placeholder="Search discounts by type/camp ID..."
        />
        <button 
          className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={handleSearch}
        >
          Search
        </button>
        <br />
        <button
          className="bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={() => window.history.back()}
        >
          Back
        </button>
      </div>
      <button
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Hide Add Discount Form' : 'Show Add Discount Form'}
      </button>
      {showAddForm && (
        <div className="add_new_form my-4">
          <h2 className="text-lg font-bold mb-2">Add New Discount</h2>
          <select
            name="camp_id"
            value={newDiscount.camp_id}
            onChange={handleNewDiscountChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
          >
            <option value="">Select Camp</option>
            {camps.map(camp => (
              <option key={camp.camp_id} value={camp.camp_id}>
                {camp.camp_id} {camp.camp_name} Starting:{formatDateDisplay(camp.start_date)} 
              </option>
            ))}
          </select>
       
          <input
            type="text"
            name="discount_type"
            placeholder="Discount Type"
            value={newDiscount.discount_type}
            onChange={handleNewDiscountChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="date"
            name="discount_start_date"
            placeholder="Start Date"
            value={formatDateForInput(newDiscount.discount_start_date)}
            onChange={handleNewDiscountChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="date"
            name="discount_end_date"
            placeholder="End Date"
            value={formatDateForInput(newDiscount.discount_end_date)}
            onChange={handleNewDiscountChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <input
            type="float"
            name="discount_percentage"
            placeholder="Discount Percentage"
            value={newDiscount.discount_percentage}
            onChange={handleNewDiscountChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
            onClick={handleAddDiscount}
          >
            Add Discount
          </button>
        </div>
      )}
      <div className="discount-list mt-4">
        {filteredDiscounts.length === 0 ? (
          <p>No discounts found</p>
        ) : (
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                <th className="px-4 py-3">Discount ID</th>
                <th className="px-4 py-3">Camp ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Percentage</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscounts.map(discount => (
                <tr key={discount.discount_id} className="bg-white border-b hover:bg-gray-50">
                  <td className='px-1 py-3'>{discount.discount_id}</td>
                  {isEditing === discount.discount_id ? (
                    <>
                      <EditableField type="select" name="camp_id" value={discount.camp_id} onChange={(e) => handleChange(discount.discount_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} options={camps.map(camp => ({ value: camp.camp_id, label: `${camp.camp_id} ${camp.camp_name}` }))} />
                      <EditableField type="text" name="discount_type" value={discount.discount_type} onChange={(e) => handleChange(discount.discount_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField type="date" name="discount_start_date" value={formatDateForInput(discount.discount_start_date)} onChange={(e) => handleChange(discount.discount_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField type="date" name="discount_end_date" value={formatDateForInput(discount.discount_end_date)} onChange={(e) => handleChange(discount.discount_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField type="text" name="discount_percentage" value={discount.discount_percentage} onChange={(e) => handleChange(discount.discount_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                    </>
                  ) : (
                    <>
                      <td>{discount.camp_id}</td>
                      <td>{discount.discount_type}</td>
                      <td>{formatDateDisplay(discount.discount_start_date)}</td>
                      <td>{formatDateDisplay(discount.discount_end_date)}</td>
                      <td>{discount.discount_percentage}</td>
                    </>
                  )}
                  <td className="px-4 py-3">
                    {isEditing === discount.discount_id ? (
                      <div>
                        <button onClick={() => {
                          if (validateDiscount(discount)) {
                            handleSave(discount.discount_id);
                            setIsEditing(null);
                          }
                        }}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
                        <button onClick={() => { setIsEditing(null); window.location.reload(); }}
                          className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <button onClick={() => toggleEdit(discount.discount_id)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                        <button onClick={() => handleDeleteDiscount(discount.discount_id)}
                          className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
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
}

function formatDateForInput(dateStr) {
    if (!dateStr) return "N/A"; // Return "N/A" or any default text for null dates

    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    }
    return '';
  }
  function formatDateDisplay(dateStr) {
    if (!dateStr) return "N/A"; // Return "N/A" or any default text for null dates
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
  }
  

export default ManageDiscounts;

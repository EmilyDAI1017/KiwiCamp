import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const ManagePayments = () => {
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [camps, setCamps] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentField, setCurrentField] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPayment, setNewPayment] = useState({
        user_id: '',
        camp_id: '',
        amount: '',
        request_date: '',
        description: '',
        payment_status: 'Unpaid',
        payment_date: '',
        pay_type: 'Card'
    });

    const fetchPayments = () => {
        setIsLoading(true);
        axios.get('http://localhost:3000/admin/manage_payments')
            .then(response => {
                setPayments(response.data);
            })
            .catch(error => console.error('Error fetching payments:', error))
            .finally(() => setIsLoading(false));
    };

    const fetchUsers = () => {
        axios.get('http://localhost:3000/admin_manage_camp_registrations/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error('Error fetching users:', error));
    };

    const fetchCamps = () => {
        axios.get('http://localhost:3000/admin_manage_camp_registrations/groups')
            .then(response => {
                setCamps(response.data);
            })
            .catch(error => console.error('Error fetching camps:', error));
    };

    useEffect(() => {
        fetchPayments();
        fetchUsers();
        fetchCamps();
    }, []);

    const handleInputChange = useCallback(
        debounce((id, name, value) => {
            setPayments(prevPayments =>
                prevPayments.map(payment =>
                    payment.payment_id === id ? { ...payment, [name]: value } : payment
                )
            );
        }, 300),
        []
    );

    const handleChange = (id, name, value) => {
        setPayments(prevPayments =>
            prevPayments.map(payment =>
                payment.payment_id === id ? { ...payment, [name]: value } : payment
            )
        );
        handleInputChange(id, name, value);
    };

    const handleNewPaymentChange = (e) => {
        const { name, value } = e.target;
        setNewPayment(prevState => ({ ...prevState, [name]: value }));
    };

    const validatePayment = (payment) => {
        if (!payment.user_id || !payment.camp_id || !payment.amount || !payment.request_date || !payment.pay_type) {
            alert('Please fill in all required fields');
            return false;
        }
        return true;
    };

    const handleSave = async (id) => {
        setIsLoading(true);
        const payment = payments.find(payment => payment.payment_id === id);
        const updatedPayment = { ...payment 
            , request_date: formatDateForBackend(payment.request_date)
            , payment_date: formatDateForBackend(payment.payment_date)};

        if (!validatePayment(updatedPayment)) {
            setIsLoading(false);
            return;
        }

        try {
            await axios.put(`http://localhost:3000/admin/manage_payments/${id}`, updatedPayment);
            setIsEditing(null);
            alert('Payment updated successfully');
            fetchPayments();
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPayment = () => {
        if (!validatePayment(newPayment)) {
            return;
        }

        axios.post('http://localhost:3000/admin/manage_payments', newPayment)
            .then(response => {
                alert("Payment added successfully");
                fetchPayments();
                setNewPayment({
                    user_id: '',
                    camp_id: '',
                    amount: '',
                    request_date: '',
                    description: '',
                    payment_status: 'Unpaid',
                    payment_date: '',
                    pay_type: 'Card'
                });
                setShowAddForm(false);
            })
            .catch(error => {
                console.error('Error adding payment:', error);
                alert('Failed to add payment');
            });
    };

    const handleDeletePayment = (id) => {
        if (!window.confirm('Are you sure you want to delete this payment?')) {
            return;
        }

        axios.delete(`http://localhost:3000/admin/manage_payments/${id}`)
            .then(response => {
                alert("Payment deleted successfully");
                fetchPayments();
            })
            .catch(error => {
                console.error('Error deleting payment:', error);
                alert('Failed to delete payment');
            });
    };

    const handleSearch = () => {
        setSearchTerm(searchInput.toLowerCase());
    };


    const filteredPayments = payments.filter(payment =>
        (payment.description || '').toLowerCase().includes(searchTerm)
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
            <h1 className="text-xl font-bold mb-4">Manage Payments</h1>
            <div className="search-container my-4">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="form-input rounded-md shadow-sm mt-1 w-1/3"
                    placeholder="Search payments by description..."
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
                    Back to dashboard
                </button>
            </div>
            <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none"
                onClick={() => setShowAddForm(!showAddForm)}
            >
                {showAddForm ? 'Hide Add Payment Form' : 'Show Add Payment Form'}
            </button>
            {showAddForm && (
                <div className="new-payment-form my-4">
                    <h2 className="text-lg font-bold mb-2">Add New Payment</h2>
                    <label className="block text-sm font-medium text-gray-700">Choose a user</label>
                    <select
                        name="user_id"
                        value={newPayment.user_id}
                        onChange={handleNewPaymentChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user.user_id} value={user.user_id}>
                                Id: {user.user_id} Username: {user.username}
                            </option>
                        ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700">Choose a camp</label>
                    <select
                        name="camp_id"
                        value={newPayment.camp_id}
                        onChange={handleNewPaymentChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="">Select Camp</option>
                        {camps.map(camp => (
                            <option key={camp.camp_id} value={camp.camp_id}>
                                {camp.camp_id} {camp.camp_name} Starting:{formatDateDisplay(camp.start_date)} 
                            </option>
                        ))}
                    </select>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={newPayment.amount}
                        onChange={handleNewPaymentChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Request Date</label>
                    <input
                        type="date"
                        name="request_date"
                        placeholder="Request Date"
                        value={formatDateForInput(newPayment.request_date)}
                        onChange={handleNewPaymentChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={newPayment.description}
                        onChange={handleNewPaymentChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                    <input
                        type="date"
                        name="payment_date"
                        placeholder="Payment Date"
                        value={formatDateForInput(newPayment.payment_date)}
                        onChange={handleNewPaymentChange}
                        className="form-input rounded-md shadow-sm mt-1 block w-full"
                    />
                    <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                    <select
                        name="payment_status"
                        value={newPayment.payment_status}
                        onChange={handleNewPaymentChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Due">Due</option>
                    </select>
                    <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                    <select
                        name="pay_type"
                        value={newPayment.pay_type}
                        onChange={handleNewPaymentChange}
                        className="form-select rounded-md shadow-sm mt-1 block w-full"
                    >
                        <option value="Card">Card</option>
                        <option value="Bank">Bank</option>
                    </select>
                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                        onClick={handleAddPayment}
                    >
                        Add Payment
                    </button>
                </div>
            )}
            <div className="payment-list mt-4">
                {filteredPayments.length === 0 ? (
                    <p>No payments found</p>
                ) : (
                    <table className="table-auto w-full text-left whitespace-no-wrap">
                        <thead>
                            <tr className="font-semibold text-gray-700 bg-gray-100">
                                <th className="px-2 py-3">Payment ID</th>
                                <th className="px-2 py-3">User ID</th>
                                <th className="px-2 py-3">Camp ID</th>
                                <th className="px-2 py-3">Amount</th>
                                <th className="px-2 py-3">Request Date</th>
                                <th className="px-2 py-3">Description</th>
                                <th className="px-2 py-3">Payment Status</th>
                                <th className="px-2 py-3">Payment Date</th>
                                <th className="px-2 py-3">Payment Type</th>
                                <th className="px-2 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(payment => (
                                <tr key={payment.payment_id} className="bg-white border-b hover:bg-gray-50">
                                    {isEditing === payment.payment_id ? (
                                        <>
                                            <td>{payment.payment_id}</td>
                                            <EditableField type="select" name="user_id" value={payment.user_id} onChange={(e) => handleChange(payment.payment_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} options={users.map(user => ({ value: user.user_id, label: `${user.user_id} ${user.username}` }))} />
                                            <EditableField type="select" name="camp_id" value={payment.camp_id} onChange={(e) => handleChange(payment.payment_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} options={camps.map(camp => ({ value: camp.camp_id, label: `${camp.camp_id} ${camp.camp_name}` }))} />
                                            <EditableField type="number" name="amount" value={payment.amount} onChange={(e) => handleChange(payment.payment_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="date" name="request_date" value={formatDateForInput(payment.request_date)} onChange={(e) => handleChange(payment.payment_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField type="text" name="description" value={payment.description} onChange={(e) => handleChange(payment.payment_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField
                                                type="select"
                                                name="payment_status"
                                                value={payment.payment_status}
                                                onChange={(e) => handleChange(payment.payment_id, e.target.name, e.target.value)}
                                                setCurrentField={setCurrentField}
                                                currentField={currentField}
                                                options={[
                                                    { value: "Unpaid", label: "Unpaid" },
                                                    { value: "Paid", label: "Paid" },
                                                    { value: "Due", label: "Due" }
                                                ]}
                                            />
                                            <EditableField type="date" name="payment_date" value={formatDateForInput(payment.payment_date)} onChange={(e) => handleChange(payment.payment_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                                            <EditableField
                                                type="select"
                                                name="pay_type"
                                                value={payment.pay_type}
                                                onChange={(e) => handleChange(payment.payment_id, e.target.name, e.target.value)}
                                                setCurrentField={setCurrentField}
                                                currentField={currentField}
                                                options={[
                                                    { value: "Card", label: "Card" },
                                                    { value: "Bank", label: "Bank" }
                                                ]}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <td>{payment.payment_id}</td>
                                            <td>{payment.user_id}</td>
                                            <td>{payment.camp_id}</td>
                                            <td>{payment.amount}</td>
                                            <td>{formatDateDisplay(payment.request_date)}</td>
                                            <td>{payment.description}</td>
                                            <td>{payment.payment_status}</td>
                                            <td>{formatDateDisplay(payment.payment_date)}</td>
                                            <td>{payment.pay_type}</td>
                                        </>
                                    )}
                                    <td className="px-4 py-3">
                                        {isEditing === payment.payment_id ? (
                                            <div>
                                                <button onClick={() => handleSave(payment.payment_id)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
                                                <button onClick={() => setIsEditing(null)}
                                                    className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                                            </div>
                                        ) : (
                                            <div>
                                                <button onClick={() => toggleEdit(payment.payment_id)}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                                                <button onClick={() => handleDeletePayment(payment.payment_id)}
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

    function EditableField({ type = "text", name, value, onChange, setCurrentField, currentField, options = [], disabled = false }) {
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
                        disabled={disabled}
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
                    disabled={disabled}
                />
            </td>
        );
    }
};

function formatDateForInput(dateStr) {
    if (!dateStr) return "N/A"; // Return "N/A" or any default text for null dates

    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    }
    return '';}

function formatDateDisplay(dateStr) {
    if (!dateStr) return "N/A"; // Return "N/A" or any default text for null dates
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }
    return "Invalid date";
  }
  

export default ManagePayments;

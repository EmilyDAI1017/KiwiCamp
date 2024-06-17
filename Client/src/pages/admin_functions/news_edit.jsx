import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

function ManageNews() {
  const [news, setNews] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentField, setCurrentField] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNews, setNewNews] = useState({
    receiver_id: '', title: '', content: '', publish_date: '', to_all: 'No', to_group: ''
  });

  const fetchNews = () => {
    axios.get('http://localhost:3000/admin_manage_news')
      .then(response => {
        setNews(response.data);
      })
      .catch(error => console.error('Error fetching news:', error));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleInputChange = useCallback(
    debounce((id, name, value) => {
      setNews(previousNews =>
        previousNews.map(newsItem =>
          newsItem.news_id === id ? { ...newsItem, [name]: value } : newsItem
        )
      );
    }, 300),
    []
  );

  const handleChange = (id, name, value) => {
    setNews(previousNews =>
      previousNews.map(newsItem =>
        newsItem.news_id === id ? { ...newsItem, [name]: value } : newsItem
      )
    );
    handleInputChange(id, name, value);
  };

  const handleNewNewsChange = (e) => {
    const { name, value } = e.target;
    setNewNews(prevState => ({ ...prevState, [name]: value }));
  };

  const validateNews = (newsItem) => {
    if (!newsItem.title || !newsItem.content || !newsItem.publish_date) {
      alert('Please fill in all required fields');
      return false;
    }

    return true;
  };

  const handleSave = (id) => {
    setIsLoading(true);
    const newsItem = news.find(newsItem => newsItem.news_id === id);
    const updatedNews = { 
        ...newsItem,
    publish_date: formatDateForBackend(newsItem.publish_date)
    };


    if (!validateNews(updatedNews)) {
      setIsLoading(false);
      return;
    }

    axios.put(`http://localhost:3000/admin_manage_news/${id}`, updatedNews)
      .then(response => {
        setIsEditing(null);
        alert('News updated successfully');
        fetchNews();
      })
      .catch(error => {
        console.error('Error updating news:', error);
        alert('Failed to update news');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    setSearchTerm(searchInput.toLowerCase());
  };

  const handleAddNews = () => {
    if (!validateNews(newNews)) {
      return;
    }

    axios.post('http://localhost:3000/admin_manage_news', newNews)
      .then(response => {
        alert("News added successfully");
        fetchNews();
        setNewNews({
          receiver_id: '', title: '', content: '', publish_date: '', to_all: 'No', to_group: ''
        });
        setShowAddForm(false);
      })
      .catch(error => {
        console.error('Error adding news:', error);
        alert('Failed to add news');
      });
  };

  const handleDeleteNews = (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) {
      return;
    }

    axios.delete(`http://localhost:3000/admin_manage_news/${id}`)
      .then(response => {
        alert("News deleted successfully");
        fetchNews();
      })
      .catch(error => {
        console.error('Error deleting news:', error);
        alert('Failed to delete news');
      });
  };

  const filteredNews = news.filter(newsItem =>
    newsItem.title.toLowerCase().includes(searchTerm) ||
    newsItem.content.toLowerCase().includes(searchTerm)
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
      <h1 className="text-xl font-bold mb-4">Manage News</h1>
      <div className="search-container my-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="form-input rounded-md shadow-sm mt-1 w-1/3"
          placeholder="Search news by title/content..."
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
        {showAddForm ? 'Hide Add News Form' : 'Show Add News Form'}
      </button>
      {showAddForm && (
        <div className="add_new_form my-4">
          <h2 className="text-lg font-bold mb-2">Add New News</h2>
            <label className="block text-sm font-medium text-gray-700">Receiver ID</label>
          <input
            type="text"
            name="receiver_id"
            placeholder="Receiver ID"
            value={newNews.receiver_id}
            onChange={handleNewNewsChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
            disabled={newNews.to_all === 'Yes'}
          />

            <label className="block text-sm font-medium text-gray-700">News Title</label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newNews.title}
            onChange={handleNewNewsChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
        <label className="block text-sm font-medium text-gray-700">New Content</label>

          <textarea
            name="content"
            placeholder="Content"
            value={newNews.content}
            onChange={handleNewNewsChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
            <label className="block text-sm font-medium text-gray-700">Publish Date</label>
          <input
            type="date"
            name="publish_date"
            value={newNews.publish_date}
            onChange={handleNewNewsChange}
            className="form-input rounded-md shadow-sm mt-1 block w-full"
          />
            <label className="block text-sm font-medium text-gray-700">To all users?</label>
          <select
            name="to_all"
            value={newNews.to_all}
            onChange={handleNewNewsChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
            <label className="block text-sm font-medium text-gray-700">To Group</label>
          <select
            name="to_group"
            value={newNews.to_group}
            onChange={handleNewNewsChange}
            className="form-select rounded-md shadow-sm mt-1 block w-full"
          >
            <option value="">Select Group</option>
            <option value="No">No</option>
            <option value="Youth">Youth</option>
            <option value="Adult Leader">Adult Leader</option>
            <option value="Group Leader">Group Leader</option>
          </select>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
            onClick={handleAddNews}
          >
            Add News
          </button>
        </div>
      )}
      <div className="news-list mt-4">
        {filteredNews.length === 0 ? (
          <p>No news found</p>
        ) : (
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                <th className="px-4 py-3">News ID</th>
                <th className="px-4 py-3">Receiver ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Content</th>
                <th className="px-4 py-3">Publish Date</th>
                <th className="px-4 py-3">To All</th>
                <th className="px-4 py-3">To Group</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map(newsItem => (
                <tr key={newsItem.news_id} className="bg-white border-b hover:bg-gray-50">
                  <td className='px-1 py-3'>{newsItem.news_id}</td>
                  
                  {isEditing === newsItem.news_id ? (
                    <>
                      <EditableField type="text" name="receiver_id" value={newsItem.receiver_id} onChange={(e) => handleChange(newsItem.news_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} disabled={newNews.to_all === 'Yes'}/>
                      <EditableField type="text" name="title" value={newsItem.title} onChange={(e) => handleChange(newsItem.news_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField type="textarea" name="content" value={newsItem.content} onChange={(e) => handleChange(newsItem.news_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField type="date" name="publish_date" value={formatDateForInput(newsItem.publish_date)} onChange={(e) => handleChange(newsItem.news_id, e.target.name, e.target.value)} setCurrentField={setCurrentField} currentField={currentField} />
                      <EditableField
                        type="select"
                        name="to_all"
                        value={newsItem.to_all}
                        onChange={(e) => handleChange(newsItem.news_id, e.target.name, e.target.value)}
                        setCurrentField={setCurrentField}
                        currentField={currentField}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" }
                        ]}
                      />
                      <EditableField
                        type="select"
                        name="to_group"
                        value={newsItem.to_group}
                        onChange={(e) => handleChange(newsItem.news_id, e.target.name, e.target.value)}
                        setCurrentField={setCurrentField}
                        currentField={currentField}
                        options={[
                        { value: "No", label: "Select Group" },
                          { value: "Youth", label: "Youth" },
                          { value: "Adult Leader", label: "Adult Leader" },
                          { value: "Group Leader", label: "Group Leader" }
                        ]}
                      />
                    </>
                  ) : (
                    <>
                      <td>{newsItem.receiver_id}</td>
                      <td>{newsItem.title}</td>
                      <td>{newsItem.content}</td>
                      <td>{formatDateDisplay(newsItem.publish_date)}</td>
                      <td>{newsItem.to_all}</td>
                      <td>{newsItem.to_group}</td>
                    </>
                  )}
                  <td className="px-4 py-3">
                    {isEditing === newsItem.news_id ? (
                      <div>
                        <button onClick={() => {
                          if (validateNews(newsItem)) {
                            handleSave(newsItem.news_id);
                            setIsEditing(null);
                          }
                        }}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
                        <button onClick={() => { setIsEditing(null); window.location.reload(); }}
                          className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <button onClick={() => toggleEdit(newsItem.news_id)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                        <button onClick={() => handleDeleteNews(newsItem.news_id)}
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

    if (type === "textarea") {
      return (
        <td>
          <textarea
            name={name}
            value={inputValue}
            onChange={handleLocalChange}
            className="form-textarea rounded-md shadow-sm mt-1 block w-full"
            autoComplete="off"
            ref={inputRef}
          />
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



export default ManageNews;

import { useState, useCallback } from 'react';
import {useAuth} from "../context/AuthContext";
import axios from 'axios';
import Popup from 'reactjs-popup';

// Configure axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function Form() {
  const {verifyAuth} = useAuth();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    heading:'',
    projectTitle: '',
    year: '',
    location: '',
    services: '',
    serviceDetails: [],
    projectImage: null,
  });
  const [showServiceDetails, setShowServiceDetails] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  }, []);

  const removeImage = useCallback(() => {
    setFormData(prev => ({ ...prev, projectImage: null }));
  }, []);

  const handleAddServices = useCallback(() => {
    const services = formData.services
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');
    
    if (services.length > 0) {
      const newServiceDetails = services.map((_, index) => 
        index < formData.serviceDetails.length ? formData.serviceDetails[index] : ''
      );
      
      setFormData(prev => ({
        ...prev,
        services: services.join(', '),
        serviceDetails: newServiceDetails,
      }));
      setShowServiceDetails(true);
    }
  }, [formData.services, formData.serviceDetails]);

  const clearServices = useCallback(() => {
    setShowServiceDetails(false);
    setFormData(prev => ({ ...prev, services: '', serviceDetails: [] }));
  }, []);

  const handleServiceDetailsChange = useCallback((e, index) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      serviceDetails: prev.serviceDetails.map((item, i) => 
        i === index ? value : item
      ),
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      alert('Session expired. Please login again.');
      navigate('/login');
      return;
    }
    const confirmSubmission = window.confirm("Are you sure you want to add this project?");
    if (!confirmSubmission) {
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('heading', formData.heading);
      formDataToSend.append('projectTitle', formData.projectTitle);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('services', formData.services);
      formData.serviceDetails.forEach(detail => {
        formDataToSend.append('serviceDetails', detail);
      });
      if (formData.projectImage) {
        formDataToSend.append('projectImage', formData.projectImage);
      }

      const token = document.cookie.split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];

      await api.post('/api/add_project', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true
      });

      // Reset form after successful submission
      setFormData({
        projectTitle: '',
        year: '',
        location: '',
        services: '',
        serviceDetails: [],
        projectImage: null,
      });
      setShowServiceDetails(false);
      
      alert('Project added successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to add project. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Portfolio Updater</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            Log Out
          </button>
        </div>
        <p className='text-xl pb-9'>Ensure to confirm content update with the pop-up before Submitting</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* heading */}
          <div>
            <label htmlFor="heading" className="block text-sm font-medium text-slate-700 mb-1">
              Project Heading
            </label>
            <input
              type="text"
              id="heading"
              name="heading"
              placeholder='Example: Certification Services'
              value={formData.heading}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {/* Project Title */}
          <div>
            <label htmlFor="projectTitle" className="block text-sm font-medium text-slate-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              id="projectTitle"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-slate-700 mb-1">
              Year
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Services */}
          <div>
            <label htmlFor="services" className="block text-sm font-medium text-slate-700 mb-1">
              Services (comma separated)
            </label>
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                id="services"
                name="services"
                value={formData.services}
                onChange={handleChange}
                placeholder="Enter services separated by commas"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleAddServices}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Details
                </button>
                <button
                  type="button"
                  onClick={clearServices}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Service Details */}
          {showServiceDetails && formData.serviceDetails.length > 0 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Service Details
              </label>
              {formData.serviceDetails.map((detail, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    {formData.services.split(', ')[index]}
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={detail}
                    onChange={(e) => handleServiceDetailsChange(e, index)}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Project Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Image
            </label>
            <div className="relative">
              <input
                type="file"
                id="projectImage"
                name="projectImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                multiple={false}
              />
              <label
                htmlFor="projectImage"
                className="w-full px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <span className="block text-sm text-slate-600">Choose Image, Only an image is allowed</span>
                <span className="block text-xs text-slate-500 mt-1">PNG, JPG, or other image formats</span>
              </label>
              <div className="absolute right-3 top-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('projectImage').click()}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Upload
                </button>
              </div>
              {formData.projectImage && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-slate-600">{formData.projectImage.name}</span>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;

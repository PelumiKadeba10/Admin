import { useState, useCallback } from 'react';
import { useAuth } from "../context/AuthContext";
import axios from 'axios';

// Configure axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const useData = () => {
  const { verifyAuth } = useAuth();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    heading: '',
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
      if (formData.projectImage instanceof File) {
        formDataToSend.append('projectImage', formData.projectImage);
      }

      const token = document.cookie.split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      await api.post('/api/add_project', formDataToSend, {
        headers: {
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

  return {
    formData,
    showServiceDetails,
    handleChange,
    removeImage,
    handleAddServices,
    clearServices,
    handleServiceDetailsChange,
    handleSubmit,
    handleLogout
  };
};
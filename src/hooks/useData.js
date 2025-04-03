import { useState, useCallback } from 'react';
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Configure axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const useData = () => {
  const { verifyAuth, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    heading: '',
    projectTitle: '',
    year: '',
    location: '',
    services: '',
    serviceDetails: [],
    projectImages: [],
  });
  const [showServiceDetails, setShowServiceDetails] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && name === 'projectImages') {
      // Convert FileList to array and combine with existing files
      const newFiles = Array.from(files).filter(file => 
        !formData.projectImages.some(img => img.name === file.name) // Prevent duplicate images
      );
      setFormData(prev => ({
        ...prev,
        projectImages: [...prev.projectImages, ...newFiles],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  }, [formData.projectImages]);

  const removeImage = useCallback((index) => {
    setFormData(prev => {
      const updatedImages = [...prev.projectImages];
      updatedImages.splice(index, 1);
      return { ...prev, projectImages: updatedImages };
    });
  }, []);

  const clearAllImages = useCallback(() => {
    setFormData(prev => ({ ...prev, projectImages: [] }));
  }, []);

  const handleAddServices = useCallback(() => {

    const servicesString = typeof formData.services === 'string' 
    ? formData.services 
    : '';
    const servicesArray = servicesString
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');
    
    if (servicesArray.length > 0) { 
      const newServiceDetails = servicesArray.map(() => '');
  
      setFormData(prev => ({
        ...prev,
        services: [...servicesArray],
        serviceDetails: newServiceDetails,
      }));
      setShowServiceDetails(true);
      console.log('Service details visible:', true);
    }
  }, [formData.services]);
  

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
      const servicesArray = Array.isArray(formData.services) ? formData.services : formData.services.split(',').map(s => s.trim());
      servicesArray.forEach(service => {
        formDataToSend.append('services', service);
      });
      formData.serviceDetails.forEach(detail => {
        formDataToSend.append('serviceDetails', detail);
      });
      formData.projectImages.forEach((image, index) => {
        formDataToSend.append(`projectImages`, image); // Note: backend should expect multiple files with same field name
      });

      const token = document.cookie.split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      await api.post('/api/add_project', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      // Reset form after successful submission
      setFormData({
        heading: '',
        projectTitle: '',
        year: '',
        location: '',
        services: '',
        serviceDetails: [],
        projectImages: [],
      });
      setShowServiceDetails(false);
      setTimeout(() => {
        alert('Project added successfully!');
      }, 100);

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
    clearAllImages,
    handleAddServices,
    clearServices,
    handleServiceDetailsChange,
    handleSubmit,
    handleLogout
  };
};
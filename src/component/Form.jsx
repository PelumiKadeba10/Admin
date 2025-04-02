import { useData } from '../hooks/useData'; 

function Form() {
  const {
    formData,
    showServiceDetails,
    handleChange,
    removeImage,
    handleAddServices,
    clearServices,
    handleServiceDetailsChange,
    handleSubmit,
    handleLogout
  } = useData();

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

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
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
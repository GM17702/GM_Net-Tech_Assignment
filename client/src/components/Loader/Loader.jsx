import './Loader.css';  // Ensure you have imported the CSS file if you're using one

const Loader = () => (
  <div className="loader-container">
    <div className="spinner"></div>
    <p className="loading-text">Loading...</p> {/* Added class for styling */}
  </div>
);

export default Loader;
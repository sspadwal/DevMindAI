import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { Heart, Loader, RefreshCw } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import './Community.css';
axios.defaults.baseURL = import.meta.env.VITE_BASEURL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [likingCreation, setLikingCreation] = useState(null);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching creations...');
      
      const token = await getToken();
      console.log('Token obtained:', !!token);
      
      const { data } = await axios.get('/api/user/get-published-creations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('API Response:', data);
      
      if (data.success) {
        setCreations(data.creations || []);
        console.log(`Successfully loaded ${data.creations?.length || 0} creations`);
        
        if (data.creations?.length === 0) {
          console.log('No published creations found');
        }
      } else {
        console.error('API returned error:', data.message);
        setError(data.message || 'Failed to fetch creations');
        toast.error(data.message || 'Failed to fetch creations');
        setCreations([]);
      }
    } catch (error) {
      console.error('Fetch creations error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch creations';
      setError(errorMessage);
      toast.error(errorMessage);
      setCreations([]);
    } finally {
      setLoading(false);
    }
  };

  const imageLikeToggle = async (id) => {
    if (!user) {
      toast.error('Please login to like creations');
      return;
    }

    try {
      setLikingCreation(id);
      
      const token = await getToken();
      const { data } = await axios.post('/api/user/toggle-like-creation', 
        { id }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (data.success) {
        // Update the specific creation in state
        setCreations(prev => prev.map(creation => 
          creation.id === id 
            ? { 
                ...creation, 
                likes: data.likes || []
              }
            : creation
        ));
        
        console.log('Like toggle successful:', data.message);
      } else {
        console.error('Like toggle failed:', data.message);
        toast.error(data.message || 'Failed to toggle like');
      }
    } catch (error) {
      console.error('Like toggle error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to toggle like');
    } finally {
      setLikingCreation(null);
    }
  };

  // Check if current user has liked a creation
  const hasUserLiked = (creation) => {
    if (!user || !creation.likes || !Array.isArray(creation.likes)) return false;
    return creation.likes.includes(user.id);
  };

  useEffect(() => {
    if (user) {
      console.log('User available, fetching creations...');
      fetchCreations();
    } else {
      console.log('No user available yet...');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading community creations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-red-500 text-lg">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800">Failed to Load Creations</h3>
          <p className="text-gray-600 max-w-md">{error}</p>
          <button
            onClick={fetchCreations}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className="community-container">
    <div className="community-header">
      <h1 className="community-title">Community Creations</h1>
      <div className="community-stats">
        <p className="creation-count">{creations.length} public creations</p>
        <button
          onClick={fetchCreations}
          className="refresh-button"
        >
          <RefreshCw className="refresh-icon" />
          Refresh
        </button>
      </div>
    </div>
    
    <div className="gallery-container">
      {creations.length === 0 ? (
        <div className="empty-state">
          <Heart className="empty-icon" />
          <h3 className="empty-title">No Public Creations Yet</h3>
          <p className="empty-message">Be the first to share your AI-generated images with the community!</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {creations.map((creation) => (
            <div key={creation.id} className="creation-card">
              <img
                src={creation.content}
                alt={creation.prompt || 'AI Generated Image'}
                className="creation-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              
              <div className="image-fallback">
                <div className="fallback-content">
                  <div className="fallback-icon">🖼️</div>
                  <p className="fallback-text">Image not available</p>
                </div>
              </div>
              
              <div className="card-overlay">
                <div className="creator-info">
                  by {creation.creator_username || 'Anonymous'}
                </div>
                <p className="prompt-text">
                  {creation.prompt || 'No description available'}
                </p>
                <div className="card-footer">
                  <div className="creation-date">
                    {creation.created_at ? new Date(creation.created_at).toLocaleDateString() : 'Unknown date'}
                  </div>
                  <div className="like-section">
                    <span className="like-count">
                      {Array.isArray(creation.likes) ? creation.likes.length : 0}
                    </span>
                    <button
                      onClick={() => imageLikeToggle(creation.id)}
                      disabled={likingCreation === creation.id}
                      className="like-button"
                    >
                      {likingCreation === creation.id ? (
                        <Loader className="loading-spinner" />
                      ) : (
                        <Heart
                          className={`like-icon ${
                            hasUserLiked(creation) ? 'liked' : 'not-liked'
                          }`}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
};

export default Community;
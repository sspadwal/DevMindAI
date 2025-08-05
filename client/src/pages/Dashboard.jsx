import React, { useEffect, useState } from 'react';
import { Gem, Sparkles, Loader, RefreshCw } from 'lucide-react';
import { Protect, useAuth } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem';
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from 'framer-motion';
import './Dashboard.css';

axios.defaults.baseURL = import.meta.env.VITE_BASEURL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      setRefreshing(true);
      setLoading(true);
      
      const token = await getToken();
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000
      });
      
      if (data.success) {
        setCreations(Array.isArray(data.creations) ? data.creations : []);
      } else {
        throw new Error(data.message || 'Failed to load creations');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setCreations([]);
      toast.error('Failed to load creations. Please try again later.', {
        id: 'fetch-error'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="dashboard-loading"
      >
        <div className="loading-container">
          <Loader className="loading-spinner" />
          <p className="loading-text">Loading your dashboard...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dashboard-container"
    >
      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div whileHover={{ y: -4 }} className="stat-card">
          <div className="stat-content">
            <p className="stat-label">Total Creations</p>
            <h2 className="stat-value">{creations.length}</h2>
          </div>
          <div className="stat-icon blue-gradient">
            <Sparkles className="icon" />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="stat-card">
          <div className="stat-content">
            <p className="stat-label">Active Plan</p>
            <h2 className="stat-value">
              <Protect plan='premium' fallback='Free'>
                Premium
              </Protect>
            </h2>
          </div>
          <div className="stat-icon purple-gradient">
            <Gem className="icon" />
          </div>
        </motion.div>
      </div>

      {/* Recent Creations Section */}
      <div className="creations-section">
        <div className="section-header">
          <h3 className="section-title">Recent Creations</h3>
          <button
            onClick={getDashboardData}
            disabled={refreshing}
            className="refresh-button"
          >
            <RefreshCw className={`refresh-icon ${refreshing ? 'spinning' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {creations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <Sparkles className="empty-icon" />
            <h4 className="empty-title">No Creations Found</h4>
            <p className="empty-message">
              {refreshing 
                ? 'Loading your creations...' 
                : 'Start creating to see your creations here!'}
            </p>
            {!refreshing && (
              <button 
                onClick={getDashboardData}
                className="retry-button"
              >
                Try Again
              </button>
            )}
          </motion.div>
        ) : (
          <div className="creations-list-container">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="creations-list"
            >
              {creations.map((item) => (
                <CreationItem key={item.id} item={item} />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
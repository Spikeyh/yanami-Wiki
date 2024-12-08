// src/components/SharedResources/index.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.scss';

const SharedResources = ({ section }) => {
  const [resources, setResources] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resourcesResponse, requestsResponse] = await Promise.all([
          axios.get('/api/shared-resources'),
          axios.get('/api/resource-requests'),
        ]);
        setResources(resourcesResponse.data);
        setRequests(requestsResponse.data);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="shared-resources-card">
      <div className="card-head">资源共享</div>
      {loading && <p>加载中...</p>}
      {error && <p className="error-message">{error}</p>}
      {section === 'resources' && (
        <div>
          <h2>共享资源</h2>
          <ul>
            {resources.map((resource) => (
              <li key={resource.id}>{resource.name}</li>
            ))}
          </ul>
        </div>
      )}
      {section === 'requests' && (
        <div>
          <h2>资源请求</h2>
          <ul>
            {requests.map((request) => (
              <li key={request.id}>{request.description}</li>
            ))}
          </ul>
        </div>
      )}
      {!section && <div>请选择资源共享选项</div>}
    </div>
  );
};

export default SharedResources;

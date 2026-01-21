import React, { useState, useEffect } from 'react';

function App() {
  const [rootData, setRootData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [statusData, setStatusData] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Route /
        fetch(`${API_URL}/`).then(res => res.json()).then(setRootData);
        // Route /health
        fetch(`${API_URL}/health`).then(res => res.json()).then(setHealthData);
        // Route /api/getAll
        fetch(`${API_URL}/api/getAll`).then(res => res.json()).then(setAllData);
        // Route /api/status
        fetch(`${API_URL}/api/status`).then(res => res.json()).then(setStatusData);
      } catch (err) {
        console.error("Erreur de chargement globale:", err);
      }
    };
    fetchAll();
  }, [API_URL]);

  const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#1a1a1a' }}>Railway Full-Stack Monitor</h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* CARTE 1: Infos de Base (Route /) */}
        <div style={cardStyle}>
          <h3 style={{ color: '#007bff', marginTop: 0 }}>🏠 API Root</h3>
          {rootData ? (
            <>
              <p><strong>Message:</strong> {rootData.message}</p>
              <code style={{ background: '#f8f9fa', padding: '5px' }}>{rootData.addition}</code>
              <code style={{ background: '#f8f9fa', padding: '5px', marginTop: '5px' }}>{rootData.multiplication}</code>
            </>
          ) : <p>Chargement...</p>}
        </div>

        {/* CARTE 2: Santé (Route /health) */}
        <div style={cardStyle}>
          <h3 style={{ color: '#28a745', marginTop: 0 }}>⚙️ Health Check</h3>
          {healthData ? (
            <>
              <p>Status: <span style={{ color: 'green', fontWeight: 'bold' }}>{healthData.status}</span></p>
              <small>Uptime: {Math.floor(healthData.uptime)}s</small>
              <small>Time: {new Date(healthData.timestamp).toLocaleTimeString()}</small>
            </>
          ) : <p>Chargement...</p>}
        </div>

        {/* CARTE 3: Base de données (Route /api/status) */}
        <div style={cardStyle}>
          <h3 style={{ color: '#6f42c1', marginTop: 0 }}>🗄️ Database Status</h3>
          {statusData ? (
            <>
              <p>Connecté: {statusData.data?.database?.connected ? '✅' : '❌'}</p>
              <p>Env: <span style={{ textTransform: 'uppercase' }}>{statusData.data?.environment}</span></p>
              <small style={{ fontSize: '10px', color: '#666' }}>{statusData.data?.database?.version}</small>
            </>
          ) : <p>Vérification...</p>}
        </div>

        {/* CARTE 4: Contenu de la table (Route /api/getAll) */}
        <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <h3 style={{ color: '#e83e8c', marginTop: 0 }}>📊 Table Data (test)</h3>
          {allData.length > 0 ? (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {allData.map(item => (
                <div key={item.id} style={{ background: '#f8f9fa', padding: '10px 20px', borderRadius: '20px', border: '1px solid #ddd' }}>
                  <strong>{item.id}:</strong> {item.name}
                </div>
              ))}
            </div>
          ) : <p>Aucune donnée dans la table 'test'.</p>}
        </div>

      </div>
    </div>
  );
}

export default App;
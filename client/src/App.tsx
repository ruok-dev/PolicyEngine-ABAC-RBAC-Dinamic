
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Settings, Activity, Plus, Trash2, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Policy {
  id: string;
  name: string;
  description: string;
  effect: 'allow' | 'deny';
  action: string | string[];
  resource: string | string[];
  rules: any[];
  priority: number;
}

function App() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulation, setSimulation] = useState({
    user: { role: 'user', id: 'u1' },
    resource: { id: 'file-123', type: 'document' },
    action: 'read'
  });
  const [evalResult, setEvalResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'policies' | 'simulator' | 'logs'>('policies');
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchPolicies();
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab]);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get('/api/policies');
      setPolicies(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEvaluate = async () => {
    try {
      const res = await axios.post('/api/evaluate', simulation);
      setEvalResult(res.data);
      if (activeTab === 'logs') fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="bg-gradient" />
      
      {/* Header */}
      <header className="glass" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', margin: 0 }}>PolicyEngine</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Advanced Dynamic Authorization</p>
          </div>
        </div>
        
        <nav style={{ display: 'flex', gap: '20px' }}>
          <button 
            onClick={() => setActiveTab('policies')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: activeTab === 'policies' ? 'white' : 'var(--text-secondary)' }}
          >
            Policies
          </button>
          <button 
            onClick={() => setActiveTab('simulator')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: activeTab === 'simulator' ? 'white' : 'var(--text-secondary)' }}
          >
            Simulator
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: activeTab === 'logs' ? 'white' : 'var(--text-secondary)' }}
          >
            Audit Logs
          </button>
        </nav>
      </header>

      <main style={{ padding: '0 20px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'policies' ? (
            <motion.section
              key="policies"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Active Policies</h2>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={18} /> New Policy
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {loading ? (
                  <p>Loading policies...</p>
                ) : policies.map(policy => (
                  <div key={policy.id} className="glass" style={{ padding: '20px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        background: policy.effect === 'allow' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: policy.effect === 'allow' ? 'var(--success)' : 'var(--error)',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {policy.effect}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Priority: {policy.priority}</span>
                    </div>
                    <h3 style={{ marginBottom: '8px' }}>{policy.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>{policy.description}</p>
                    
                    <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                      <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Rules</h4>
                      {policy.rules.map((rule, idx) => (
                        <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '4px', display: 'flex', gap: '8px' }}>
                          <code style={{ color: 'var(--accent-primary)' }}>{rule.attribute}</code>
                          <span style={{ color: 'var(--text-secondary)' }}>{rule.operator}</span>
                          <code>{JSON.stringify(rule.value)}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ) : activeTab === 'simulator' ? (
            <motion.section
              key="simulator"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}
            >
              <div className="glass" style={{ padding: '30px' }}>
                <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={24} /> Simulator
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>User Role</label>
                    <select 
                      value={simulation.user.role} 
                      onChange={(e) => setSimulation({...simulation, user: {...simulation.user, role: e.target.value}})}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', color: 'white', padding: '10px', borderRadius: '8px' }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="guest">Guest</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Resource ID</label>
                    <input 
                      type="text"
                      value={simulation.resource.id}
                      onChange={(e) => setSimulation({...simulation, resource: {...simulation.resource, id: e.target.value}})}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', color: 'white', padding: '10px', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Action</label>
                    <select 
                      value={simulation.action} 
                      onChange={(e) => setSimulation({...simulation, action: e.target.value})}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', color: 'white', padding: '10px', borderRadius: '8px' }}
                    >
                      <option value="read">Read</option>
                      <option value="write">Write</option>
                      <option value="delete">Delete</option>
                    </select>
                  </div>

                  <button className="btn-primary" onClick={handleEvaluate} style={{ marginTop: '10px', padding: '15px' }}>
                    Run Evaluation
                  </button>
                </div>
              </div>

              <div>
                {evalResult ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      backgroundColor: evalResult.isHoneytoken ? 'rgba(239, 68, 68, 0.15)' : 'rgba(20, 20, 25, 0.7)'
                    }}
                    className="glass" 
                    style={{ 
                      padding: '30px', 
                      height: '100%', 
                      borderLeft: `4px solid ${evalResult.isHoneytoken ? 'var(--error)' : (evalResult.allowed ? 'var(--success)' : 'var(--error)')}`,
                      boxShadow: evalResult.isHoneytoken ? '0 0 30px rgba(239, 68, 68, 0.3)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px' }}>
                      {evalResult.isHoneytoken ? (
                        <div className="pulse-icon">
                           <XCircle size={48} color="var(--error)" />
                        </div>
                      ) : evalResult.allowed ? (
                        <CheckCircle size={48} color="var(--success)" />
                      ) : (
                        <XCircle size={48} color="var(--error)" />
                      )}
                      <div>
                        <h2 style={{ fontSize: '2rem', margin: 0, color: evalResult.isHoneytoken ? 'var(--error)' : 'inherit' }}>
                          {evalResult.isHoneytoken ? 'INTRUSION DETECTED' : (evalResult.allowed ? 'GRANTED' : 'DENIED')}
                        </h2>
                        <p style={{ color: evalResult.isHoneytoken ? 'white' : 'var(--text-secondary)', margin: 0, fontWeight: evalResult.isHoneytoken ? 'bold' : 'normal' }}>
                          {evalResult.isHoneytoken ? 'Honeytoken Triggered - Attacker Identity Exposed' : evalResult.reason}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={18} /> Evaluation Context
                      </h3>
                      <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px', fontSize: '0.8rem', overflowX: 'auto', border: evalResult.isHoneytoken ? '1px solid var(--error)' : '1px solid var(--card-border)' }}>
                        {JSON.stringify(evalResult.context, null, 2)}
                      </pre>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Security Metadata</h3>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)' }}>
                          ID: {Math.random().toString(36).substr(2, 9)}
                        </span>
                        {evalResult.isHoneytoken && (
                          <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '20px', background: 'var(--error)', color: 'white', fontWeight: 'bold' }}>
                            THREAT: CRITICAL
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="glass" style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderStyle: 'dashed' }}>
                    <Activity size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
                    <h3 style={{ opacity: 0.5 }}>Run evaluation to see results</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px' }}>Choose attributes on the left to simulate a real-time authorization request.</p>
                  </div>
                )}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="logs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Audit Trail & IDS Logs</h2>
              <div className="glass" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    <tr>
                      <th style={{ padding: '15px 20px' }}>Timestamp</th>
                      <th style={{ padding: '15px 20px' }}>Status</th>
                      <th style={{ padding: '15px 20px' }}>User</th>
                      <th style={{ padding: '15px 20px' }}>Resource</th>
                      <th style={{ padding: '15px 20px' }}>Severity</th>
                      <th style={{ padding: '15px 20px' }}>Reason</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.9rem' }}>
                    {logs.map(log => (
                      <tr key={log.id} style={{ 
                        borderTop: '1px solid var(--card-border)',
                        background: log.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                      }}>
                        <td style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td style={{ padding: '15px 20px' }}>
                          <span style={{ 
                            color: log.effect === 'allow' ? 'var(--success)' : 'var(--error)', 
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {log.effect === 'deny' && log.severity === 'critical' && <Activity size={14} />}
                            {log.effect.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '15px 20px' }}><code>{log.user}</code></td>
                        <td style={{ padding: '15px 20px' }}>{log.resource}</td>
                        <td style={{ padding: '15px 20px' }}>
                           <span style={{ 
                             fontSize: '0.65rem', 
                             padding: '2px 8px', 
                             borderRadius: '10px',
                             background: log.severity === 'critical' ? 'var(--error)' : (log.severity === 'warning' ? 'var(--warning)' : 'rgba(255,255,255,0.1)'),
                             color: log.severity === 'info' ? 'white' : 'white',
                             fontWeight: 'bold'
                           }}>
                             {log.severity.toUpperCase()}
                           </span>
                        </td>
                        <td style={{ padding: '15px 20px', color: log.severity === 'critical' ? 'white' : 'var(--text-secondary)' }}>{log.reason}</td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No logs found. Run a simulation first!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer style={{ marginTop: 'auto', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        <p>© 2026 PolicyEngine Core - Dynamic Context-Aware Authorization System</p>
      </footer>
    </div>
  );
}

export default App;

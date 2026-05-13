import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Mail, Phone, Link, PlusCircle, Loader2 } from 'lucide-react';
import { getContacts, addContact } from '../lib/dataService';
import './Contacts.css';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Contact Form State
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    const data = await getContacts();
    setContacts(data);
    setLoading(false);
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    
    await addContact({
      name: newName,
      company: newCompany,
      role: newRole,
      email: newEmail,
      status: 'Lead'
    });
    
    setIsModalOpen(false);
    setNewName(''); setNewCompany(''); setNewRole(''); setNewEmail('');
    loadContacts();
  };

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">Contacts Database</h1>
          <p className="page-subtitle">Manage and enrich your customer relationships.</p>
        </div>
        <button className="glass-button primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Add Contact
        </button>
      </header>

      <div className="glass-panel table-container">
        <div className="table-actions">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" className="glass-input" placeholder="Search contacts..." />
          </div>
          <button className="glass-button"><Filter size={18} /> Filters</button>
        </div>

        {loading ? (
           <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader2 className="animate-spin" color="var(--accent-color)" size={32} />
           </div>
        ) : (
          <table className="glass-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company & Role</th>
                <th>Contact Info</th>
                <th>Status</th>
                <th>Enriched Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="contact-name-cell">
                      <div className="avatar">{c.name.charAt(0)}</div>
                      <strong>{c.name}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="company-info">
                      <strong>{c.company}</strong>
                      <span>{c.role}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-links">
                      <a href={`mailto:${c.email}`} title={c.email}><Mail size={16} /></a>
                      <a href="#" title="Call"><Phone size={16} /></a>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                  </td>
                  <td>
                    {c.enriched ? (
                      <span className="enriched-badge"><Link size={14} /> Profile Linked</span>
                    ) : (
                      <span className="pending-badge">Pending</span>
                    )}
                  </td>
                  <td>
                    <button className="icon-btn"><MoreHorizontal size={18} /></button>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    No contacts found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Contact Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <h2 style={{ marginBottom: '16px' }}>Add New Contact</h2>
            <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Full Name *</label>
                <input type="text" className="glass-input" style={{ width: '100%' }} value={newName} onChange={e => setNewName(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Email Address *</label>
                <input type="email" className="glass-input" style={{ width: '100%' }} value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Company</label>
                  <input type="text" className="glass-input" style={{ width: '100%' }} value={newCompany} onChange={e => setNewCompany(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Role</label>
                  <input type="text" className="glass-input" style={{ width: '100%' }} value={newRole} onChange={e => setNewRole(e.target.value)} />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="glass-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="glass-button primary">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;

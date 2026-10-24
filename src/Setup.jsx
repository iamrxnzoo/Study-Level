import { useState } from 'react';
import { useApp } from './context/AppContext';
import { ArrowRight } from 'lucide-react';

export default function Setup() {
  const { completeSetup } = useApp();
  const [name, setName] = useState('');
  const [petName, setPetName] = useState('Mochi');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    completeSetup(name.trim(), petName.trim());
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(180deg, #F0F4FF 0%, #FAFAFF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
      
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '30px', textAlign: 'center', animation: 'slideUp 0.5s ease' }}>
        
        <style>{`
          @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `}</style>

        <div style={{ fontSize: '60px', marginBottom: '10px' }}>🐱</div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748', margin: '0 0 10px 0' }}>Welcome to StudyLevel!</h1>
        <p style={{ fontSize: '14px', color: '#a0aec0', fontWeight: '600', marginBottom: '30px' }}>Let's get you set up so we can start tracking your progress.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          
          <div>
            <label style={{ fontSize: '13px', fontWeight: '800', color: '#4a5568', marginBottom: '5px', display: 'block' }}>What is your name?</label>
            <input 
              type="text" 
              placeholder="e.g. Marlow" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '15px', outline: 'none', backgroundColor: '#f8fafc' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '800', color: '#4a5568', marginBottom: '5px', display: 'block' }}>Name your study pet</label>
            <input 
              type="text" 
              placeholder="e.g. Mochi" 
              value={petName} 
              onChange={(e) => setPetName(e.target.value)} 
              style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '15px', outline: 'none', backgroundColor: '#f8fafc' }} 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Let's Go! <ArrowRight size={18} />
          </button>
        </form>

      </div>
    </div>
  );
}
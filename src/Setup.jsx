import { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sparkles } from 'lucide-react';

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
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
      
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '35px 25px', textAlign: 'center', animation: 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)', border: '4px solid #FFD1DC' }}>
        
        <style>{`
          @keyframes bounceIn { 
            0% { transform: scale(0.5); opacity: 0; } 
            80% { transform: scale(1.05); opacity: 1; } 
            100% { transform: scale(1); } 
          }
        `}</style>

        <div style={{ fontSize: '80px', marginBottom: '10px', animation: 'float 3s ease-in-out infinite' }}>🐱</div>
        <style>{`
          @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        `}</style>

        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#FF85A2', margin: '0 0 10px 0', textShadow: '1px 1px 0 white' }}>Welcome to StudyLevel! ✨</h1>
        <p style={{ fontSize: '15px', color: '#B0A0B0', fontWeight: '600', marginBottom: '30px' }}>Let's get you set up so we can start tracking your progress together.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          
          <div>
            <label style={{ fontSize: '14px', fontWeight: '700', color: '#FF85A2', marginBottom: '8px', display: 'block' }}>What is your name?</label>
            <input 
              type="text" 
              placeholder="e.g. Marlow" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              style={{ width: '100%', padding: '16px', borderRadius: '20px', border: '3px solid #FFE4E1', fontSize: '16px', fontWeight: '600', outline: 'none', backgroundColor: '#FFF9FB', color: '#4a3b4a', transition: 'border 0.2s' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '700', color: '#FF85A2', marginBottom: '8px', display: 'block' }}>Name your study pet</label>
            <input 
              type="text" 
              placeholder="e.g. Mochi" 
              value={petName} 
              onChange={(e) => setPetName(e.target.value)} 
              style={{ width: '100%', padding: '16px', borderRadius: '20px', border: '3px solid #FFE4E1', fontSize: '16px', fontWeight: '600', outline: 'none', backgroundColor: '#FFF9FB', color: '#4a3b4a', transition: 'border 0.2s' }} 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Let's Go! <Sparkles size={20} />
          </button>
        </form>

      </div>
    </div>
  );
}
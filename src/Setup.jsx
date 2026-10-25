import { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sparkles } from 'lucide-react';

export default function Setup() {
  const { completeSetup } = useApp();
  const [name, setName] = useState('');
  const [petName, setPetName] = useState('Mochi');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    
    // completeSetup now handles the async Supabase update
    await completeSetup(name.trim(), petName.trim());
    
    // No need to setLoading(false) if the component unmounts, but just in case
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
      
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '35px 25px', textAlign: 'center', animation: 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)', border: '4px solid var(--card-border)' }}>
        
        <style>{`
          @keyframes bounceIn { 
            0% { transform: scale(0.5); opacity: 0; } 
            80% { transform: scale(1.05); opacity: 1; } 
            100% { transform: scale(1); } 
          }
          @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        `}</style>

        <div style={{ fontSize: '80px', marginBottom: '10px', animation: 'float 3s ease-in-out infinite' }}>🐱</div>

        <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--primary)', margin: '0 0 10px 0' }}>Welcome to StudyLevel! ✨</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '30px' }}>Let's get you set up so we can start tracking your progress together.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          
          <div>
            <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>What is your name?</label>
            <input 
              type="text" 
              placeholder="e.g. Marlow" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              style={{ width: '100%', padding: '16px', borderRadius: '20px', border: '3px solid var(--card-border)', fontSize: '16px', fontWeight: '600', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>Name your study pet</label>
            <input 
              type="text" 
              placeholder="e.g. Mochi" 
              value={petName} 
              onChange={(e) => setPetName(e.target.value)} 
              style={{ width: '100%', padding: '16px', borderRadius: '20px', border: '3px solid var(--card-border)', fontSize: '16px', fontWeight: '600', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' }} 
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? "Saving..." : "Let's Go! ✨"}
          </button>
        </form>

      </div>
    </div>
  );
}
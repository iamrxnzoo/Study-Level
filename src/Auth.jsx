import { useState } from 'react';
import { supabase } from './supabaseClient';
import { BookOpen } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', background: 'linear-gradient(180deg, #F0F4FF 0%, #FAFAFF 100%)' }}>
      
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px 30px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <BookOpen size={48} color="var(--primary)" />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>StudyLevel</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '30px' }}>Plan • Study • Level Up!</p>

        {error && <div style={{ backgroundColor: '#ffe6e6', color: '#eb5757', padding: '10px', borderRadius: '10px', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '16px', borderRadius: '15px', border: '2px solid var(--card-border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '15px', outline: 'none' }} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '16px', borderRadius: '15px', border: '2px solid var(--card-border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '15px', outline: 'none' }} 
          />
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? "Please wait..." : (isLogin ? "Log In" : "Create Account")}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(null); }} 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </span>
        </div>
      </div>
    </div>
  );
}
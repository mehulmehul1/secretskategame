import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Auth } from './screens/Auth';
import { Onboarding } from './screens/Onboarding';
import { Map } from './screens/Map';
import { Profile } from './screens/Profile';
import { Challenges } from './screens/Challenges';
import { Explore } from './screens/Explore';
import { Navigation } from './components/Navigation';
import { supabase } from './lib/supabase';

function App() {
  const { user, signOut } = useAuthStore();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        signOut();
      }
    });

    return () => subscription.unsubscribe();
  }, [signOut]);

  return (
    <Router>
      <div className="h-screen flex flex-col">
        <Routes>
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/" /> : <Auth />} 
          />
          <Route 
            path="/onboarding" 
            element={user ? <Onboarding /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/" 
            element={user ? <Map /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/explore" 
            element={user ? <Explore /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/challenges" 
            element={user ? <Challenges /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/auth" />} 
          />
        </Routes>
        {user && <Navigation />}
      </div>
    </Router>
  );
}

export default App;
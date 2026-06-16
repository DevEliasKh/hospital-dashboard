// src/components/Header.jsx
import { supabase } from '../lib/supabase';

export default function Header({ user, isAdmin, onAdminToggle, showAdmin }) {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className='header'>
            <div className='header-left'>
                <h1>🏥 سیستم مدیریت شیفت</h1>
            </div>
            <div className='header-right'>
                <span className='user-email'>{user?.email}</span>

                {isAdmin && (
                    <button
                        onClick={onAdminToggle}
                        className={`admin-toggle-btn ${showAdmin ? 'active' : ''}`}
                    >
                        {showAdmin ? '📋 مشاهده شیفت‌ها' : '🛠️ مدیریت'}
                    </button>
                )}

                <button onClick={handleLogout} className='logout-btn'>
                    خروج
                </button>
            </div>
        </header>
    );
}

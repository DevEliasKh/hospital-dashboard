// src/components/Header.jsx
import { supabase } from '../lib/supabase';

export default function Header({
    user,
    userProfile,
    isAdmin,
    onAdminToggle,
    onUsersToggle,
    showAdmin,
    showUsers,
}) {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const getRoleLabel = () => {
        const roles = {
            admin: 'مدیر سیستم',
            head_nurse: ' سرپرستار',
            viewer: ' بازدیدکننده',
        };
        return roles[userProfile?.role] || 'کاربر';
    };

    return (
        <header className='header'>
            <div className='header-left'>
                <h1>🏥 سیستم مدیریت شیفت</h1>
            </div>
            <div className='header-right'>
                <span className='user-email'>
                    {user?.email}
                    <span className='role-badge-header'>{getRoleLabel()}</span>
                </span>
                <div className='buttons'>
                    {isAdmin && (
                        <>
                            <button
                                onClick={onAdminToggle}
                                className={`admin-toggle-btn ${showAdmin ? 'active' : ''}`}
                            >
                                {showAdmin ? '📋 شیفت‌ها' : '🏢 مدیریت'}
                            </button>
                            <button
                                onClick={onUsersToggle}
                                className={`admin-toggle-btn ${showUsers ? 'active' : ''}`}
                            >
                                {showUsers ? '📋 شیفت‌ها' : '👥 کاربران'}
                            </button>
                        </>
                    )}

                    <button onClick={handleLogout} className='logout-btn'>
                        خروج
                    </button>
                </div>
            </div>
        </header>
    );
}

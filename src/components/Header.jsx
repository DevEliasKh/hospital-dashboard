import { supabase } from '../lib/supabase';

export default function Header({ user }) {
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
                <button onClick={handleLogout} className='logout-btn'>
                    خروج
                </button>
            </div>
        </header>
    );
}

// src/App.jsx
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import ShiftTable from './components/ShiftTable';
import SectionSelector from './components/SectionSelector';
import Header from './components/Header';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
    const [session, setSession] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [showAdmin, setShowAdmin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            // بررسی نقش کاربر (ادمین)
            checkUserRole(session?.user?.email);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            checkUserRole(session?.user?.email);
        });

        return () => subscription.unsubscribe();
    }, []);

    // بررسی ادمین بودن (بر اساس ایمیل)
    const checkUserRole = (email) => {
        // شما می‌توانید این لیست را در دیتابیس هم ذخیره کنید
        const adminEmails = ['admin@hospital.com', 'manager@hospital.com'];
        setIsAdmin(adminEmails.includes(email));
    };

    if (!session) {
        return <Login />;
    }

    return (
        <div className='app'>
            <Header
                user={session.user}
                isAdmin={isAdmin}
                onAdminToggle={() => setShowAdmin(!showAdmin)}
                showAdmin={showAdmin}
            />

            {!showAdmin ? (
                <>
                    <div className='controls'>
                        <SectionSelector
                            onSelect={setSelectedSection}
                            selectedId={selectedSection}
                        />

                        <div className='month-nav'>
                            <button
                                onClick={() =>
                                    setCurrentMonth((m) =>
                                        m === 1 ? 12 : m - 1
                                    )
                                }
                            >
                                ◀
                            </button>
                            <span>
                                {currentYear}/{currentMonth}
                            </span>
                            <button
                                onClick={() =>
                                    setCurrentMonth((m) =>
                                        m === 12 ? 1 : m + 1
                                    )
                                }
                            >
                                ▶
                            </button>
                        </div>
                    </div>

                    {selectedSection && (
                        <ShiftTable
                            sectionId={selectedSection}
                            month={currentMonth}
                            year={currentYear}
                        />
                    )}
                </>
            ) : (
                <AdminPanel />
            )}
        </div>
    );
}

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div className='login-container'>
            <div className='login-box'>
                <h2>🏥 سیستم مدیریت شیفت</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type='email'
                        placeholder='ایمیل'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type='password'
                        placeholder='رمز عبور'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <div className='error'>{error}</div>}
                    <button type='submit' disabled={loading}>
                        {loading ? 'در حال ورود...' : 'ورود'}
                    </button>
                </form>
                <p className='hint'>
                    برای تست: admin@hospital.com / password123
                </p>
            </div>
        </div>
    );
}

export default App;

// src/App.jsx
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import ShiftTable from './components/ShiftTable';
import SectionSelector from './components/SectionSelector';
import Header from './components/Header';
import AdminPanel from './components/AdminPanel';
import UserManagement from './components/UserManagement';
import './App.css';

function App() {
    const [session, setSession] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [showAdmin, setShowAdmin] = useState(false);
    const [showUsers, setShowUsers] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            } else {
                setUserProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (userId) => {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*, sections(name)')
            .eq('id', userId)
            .single();
        if (!error && data) {
            setUserProfile(data);
            // اگر سرپرستار است، بخش خودش را انتخاب کن
            if (data.role === 'head_nurse' && data.section_id) {
                setSelectedSection(data.section_id);
            }
        }
    };

    // بررسی دسترسی‌ها
    const isAdmin = userProfile?.role === 'admin';
    const isHeadNurse = userProfile?.role === 'head_nurse';
    const isViewer = userProfile?.role === 'viewer';
    const canEdit = isAdmin || isHeadNurse;
    const userSectionId = userProfile?.section_id;

    if (!session) {
        return <Login />;
    }

    return (
        <div className='app'>
            <Header
                user={session.user}
                userProfile={userProfile}
                isAdmin={isAdmin}
                onAdminToggle={() => {
                    setShowAdmin(!showAdmin);
                    setShowUsers(false);
                }}
                onUsersToggle={() => {
                    setShowUsers(!showUsers);
                    setShowAdmin(false);
                }}
                showAdmin={showAdmin}
                showUsers={showUsers}
            />

            {showAdmin && isAdmin ? (
                <AdminPanel />
            ) : showUsers && isAdmin ? (
                <UserManagement />
            ) : (
                <>
                    <div className='controls'>
                        <SectionSelector
                            onSelect={setSelectedSection}
                            selectedId={selectedSection}
                            userRole={userProfile?.role}
                            userSectionId={userSectionId}
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
                            canEdit={canEdit}
                            userRole={userProfile?.role}
                            userSectionId={userSectionId}
                        />
                    )}
                </>
            )}
        </div>
    );
}

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // src/App.jsx - بخش لاگین را به‌روز کنید

    // در src/App.jsx - هنگام لاگین
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. لاگین کردن
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // 2. گرفتن پروفایل کاربر
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('role, section_id')
                .eq('id', data.user.id)
                .single();

            if (profileError) throw profileError;

            // 3. به‌روزرسانی metadata کاربر
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    role: profile.role,
                    section_id: profile.section_id,
                },
            });

            if (updateError) {
                console.warn('Could not update user metadata:', updateError);
                // اگر خطا داد، ادامه دهید
            }

            // 4. رفرش کردن session
            await supabase.auth.refreshSession();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
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

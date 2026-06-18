import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // State برای فرم اضافه کردن کاربر
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'viewer',
        section_id: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // دریافت لیست کاربران
            const { data: userData, error: userError } = await supabase
                .from('user_profiles')
                .select('*, sections(name)')
                .order('created_at', { ascending: false });

            if (userError) throw userError;
            setUsers(userData || []);

            // دریافت لیست بخش‌ها
            const { data: sectionData } = await supabase
                .from('sections')
                .select('*')
                .order('name');

            setSections(sectionData || []);
        } catch (error) {
            showMessage('error', 'خطا در دریافت اطلاعات: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const addUser = async (e) => {
        e.preventDefault();

        if (!newUser.email || !newUser.password || !newUser.full_name) {
            showMessage('error', 'لطفاً همه فیلدها را پر کنید');
            return;
        }

        try {
            // 1. ایجاد کاربر در Auth
            const { data: authData, error: authError } =
                await supabase.auth.admin.createUser({
                    email: newUser.email,
                    password: newUser.password,
                    email_confirm: true,
                    user_metadata: { full_name: newUser.full_name },
                });

            if (authError) throw authError;

            // 2. ایجاد پروفایل کاربر
            const { error: profileError } = await supabase
                .from('user_profiles')
                .insert({
                    id: authData.user.id,
                    email: newUser.email,
                    full_name: newUser.full_name,
                    role: newUser.role,
                    section_id:
                        newUser.role === 'head_nurse'
                            ? newUser.section_id
                            : null,
                });

            if (profileError) throw profileError;

            showMessage(
                'success',
                `کاربر "${newUser.full_name}" با موفقیت اضافه شد`
            );

            // ریست فرم
            setNewUser({
                email: '',
                password: '',
                full_name: '',
                role: 'viewer',
                section_id: '',
            });

            fetchData(); // رفرش لیست
        } catch (error) {
            showMessage('error', 'خطا در اضافه کردن کاربر: ' + error.message);
        }
    };

    const deleteUser = async (id, fullName) => {
        if (!confirm(`آیا از حذف کاربر "${fullName}" مطمئن هستید؟`)) return;

        try {
            // حذف پروفایل (به دلیل CASCADE، خودکار حذف می‌شود)
            const { error } = await supabase
                .from('user_profiles')
                .delete()
                .eq('id', id);

            if (error) throw error;

            showMessage('success', `کاربر "${fullName}" با موفقیت حذف شد`);
            fetchData();
        } catch (error) {
            showMessage('error', 'خطا در حذف کاربر: ' + error.message);
        }
    };

    const getRoleLabel = (role) => {
        const roles = {
            admin: '👑 ادمین',
            head_nurse: '🧑‍⚕️ سرپرستار',
            viewer: '👀 بازدیدکننده',
        };
        return roles[role] || role;
    };

    if (loading) return <div className='loading'>در حال بارگذاری...</div>;

    return (
        <div className='user-management'>
            <h2>👥 مدیریت کاربران</h2>

            {message.text && (
                <div className={`message ${message.type}`}>{message.text}</div>
            )}

            <div className='admin-grid'>
                {/* فرم اضافه کردن کاربر */}
                <div className='admin-card'>
                    <h3>➕ اضافه کردن کاربر جدید</h3>
                    <form onSubmit={addUser}>
                        <input
                            type='text'
                            placeholder='ایمیل'
                            value={newUser.email}
                            onChange={(e) =>
                                setNewUser({
                                    ...newUser,
                                    email: e.target.value,
                                })
                            }
                            className='admin-input'
                            required
                        />
                        <input
                            type='password'
                            placeholder='رمز عبور'
                            value={newUser.password}
                            onChange={(e) =>
                                setNewUser({
                                    ...newUser,
                                    password: e.target.value,
                                })
                            }
                            className='admin-input'
                            required
                            minLength='6'
                        />
                        <input
                            type='text'
                            placeholder='نام کامل'
                            value={newUser.full_name}
                            onChange={(e) =>
                                setNewUser({
                                    ...newUser,
                                    full_name: e.target.value,
                                })
                            }
                            className='admin-input'
                            required
                        />

                        <select
                            value={newUser.role}
                            onChange={(e) =>
                                setNewUser({ ...newUser, role: e.target.value })
                            }
                            className='admin-input'
                        >
                            <option value='viewer'>👀 بازدیدکننده</option>
                            <option value='head_nurse'>🧑‍⚕️ سرپرستار</option>
                            <option value='admin'>👑 ادمین</option>
                        </select>

                        {newUser.role === 'head_nurse' && (
                            <select
                                value={newUser.section_id}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        section_id: e.target.value,
                                    })
                                }
                                className='admin-input'
                                required
                            >
                                <option value=''>انتخاب بخش...</option>
                                {sections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                        {section.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        <button
                            type='submit'
                            className='admin-btn primary'
                            style={{ width: '100%' }}
                        >
                            اضافه کردن کاربر
                        </button>
                    </form>
                </div>

                {/* لیست کاربران */}
                <div className='admin-card'>
                    <h3>📋 لیست کاربران</h3>
                    <div className='item-list'>
                        {users.length === 0 ? (
                            <p>هیچ کاربری تعریف نشده است</p>
                        ) : (
                            users.map((user) => (
                                <div key={user.id} className='item-row'>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>
                                            {user.full_name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '12px',
                                                color: '#888',
                                            }}
                                        >
                                            {user.email}
                                        </div>
                                        <div style={{ fontSize: '12px' }}>
                                            <span className='role-badge'>
                                                {getRoleLabel(user.role)}
                                            </span>
                                            {user.role === 'head_nurse' &&
                                                user.sections?.name && (
                                                    <span className='section-tag'>
                                                        📍 {user.sections.name}
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() =>
                                                deleteUser(
                                                    user.id,
                                                    user.full_name
                                                )
                                            }
                                            className='admin-btn danger small'
                                        >
                                            حذف
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminPanel() {
    const [sections, setSections] = useState([]);
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);

    // State برای فرم‌ها
    const [newSectionName, setNewSectionName] = useState('');
    const [newPersonnelName, setNewPersonnelName] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    // دریافت داده‌ها
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // دریافت بخش‌ها
            const { data: sectionsData } = await supabase
                .from('sections')
                .select('*')
                .order('name');

            setSections(sectionsData || []);

            // دریافت پرسنل با اطلاعات بخش
            const { data: personnelData } = await supabase
                .from('personnel')
                .select('*, sections(name)')
                .order('name');

            setPersonnel(personnelData || []);
        } catch (error) {
            showMessage('error', 'خطا در دریافت اطلاعات: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // نمایش پیام
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    // اضافه کردن بخش جدید
    const addSection = async (e) => {
        e.preventDefault();
        if (!newSectionName.trim()) {
            showMessage('error', 'لطفاً نام بخش را وارد کنید');
            return;
        }

        try {
            const { error } = await supabase
                .from('sections')
                .insert({ name: newSectionName.trim() });

            if (error) throw error;

            showMessage(
                'success',
                `بخش "${newSectionName}" با موفقیت اضافه شد`
            );
            setNewSectionName('');
            fetchData(); // رفرش لیست
        } catch (error) {
            showMessage('error', 'خطا در اضافه کردن بخش: ' + error.message);
        }
    };

    // اضافه کردن پرسنل جدید
    const addPersonnel = async (e) => {
        e.preventDefault();
        if (!newPersonnelName.trim()) {
            showMessage('error', 'لطفاً نام پرسنل را وارد کنید');
            return;
        }
        if (!selectedSection) {
            showMessage('error', 'لطفاً بخش را انتخاب کنید');
            return;
        }

        try {
            const { error } = await supabase.from('personnel').insert({
                name: newPersonnelName.trim(),
                section_id: parseInt(selectedSection),
            });

            if (error) throw error;

            showMessage(
                'success',
                `پرسنل "${newPersonnelName}" با موفقیت اضافه شد`
            );
            setNewPersonnelName('');
            setSelectedSection('');
            fetchData(); // رفرش لیست
        } catch (error) {
            showMessage('error', 'خطا در اضافه کردن پرسنل: ' + error.message);
        }
    };

    // حذف بخش
    const deleteSection = async (id, name) => {
        if (!confirm(`آیا از حذف بخش "${name}" مطمئن هستید؟`)) return;

        try {
            const { error } = await supabase
                .from('sections')
                .delete()
                .eq('id', id);

            if (error) throw error;

            showMessage('success', `بخش "${name}" با موفقیت حذف شد`);
            fetchData();
        } catch (error) {
            showMessage('error', 'خطا در حذف بخش: ' + error.message);
        }
    };

    // حذف پرسنل
    const deletePersonnel = async (id, name) => {
        if (!confirm(`آیا از حذف پرسنل "${name}" مطمئن هستید؟`)) return;

        try {
            const { error } = await supabase
                .from('personnel')
                .delete()
                .eq('id', id);

            if (error) throw error;

            showMessage('success', `پرسنل "${name}" با موفقیت حذف شد`);
            fetchData();
        } catch (error) {
            showMessage('error', 'خطا در حذف پرسنل: ' + error.message);
        }
    };

    if (loading) return <div className='loading'>در حال بارگذاری...</div>;

    return (
        <div className='admin-panel'>
            <h2>🛠️ پنل مدیریت</h2>

            {/* پیام‌ها */}
            {message.text && (
                <div className={`message ${message.type}`}>{message.text}</div>
            )}

            <div className='admin-grid'>
                {/* فرم اضافه کردن بخش */}
                <div className='admin-card'>
                    <h3>➕ اضافه کردن بخش جدید</h3>
                    <form onSubmit={addSection}>
                        <input
                            type='text'
                            placeholder='نام بخش (مثال: ENT)'
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            className='admin-input'
                        />
                        <button type='submit' className='admin-btn primary'>
                            اضافه کردن بخش
                        </button>
                    </form>

                    <h4 style={{ marginTop: '20px' }}>📋 لیست بخش‌ها</h4>
                    <div className='item-list'>
                        {sections.length === 0 ? (
                            <p>هیچ بخشی تعریف نشده است</p>
                        ) : (
                            sections.map((section) => (
                                <div key={section.id} className='item-row'>
                                    <span>{section.name}</span>
                                    <button
                                        onClick={() =>
                                            deleteSection(
                                                section.id,
                                                section.name
                                            )
                                        }
                                        className='admin-btn danger small'
                                    >
                                        حذف
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* فرم اضافه کردن پرسنل */}
                <div className='admin-card'>
                    <h3>👤 اضافه کردن پرسنل جدید</h3>
                    <form onSubmit={addPersonnel}>
                        <input
                            type='text'
                            placeholder='نام و نام خانوادگی'
                            value={newPersonnelName}
                            onChange={(e) =>
                                setNewPersonnelName(e.target.value)
                            }
                            className='admin-input'
                        />
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className='admin-input'
                        >
                            <option value=''>انتخاب بخش...</option>
                            {sections.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                        <button type='submit' className='admin-btn primary'>
                            اضافه کردن پرسنل
                        </button>
                    </form>

                    <h4 style={{ marginTop: '20px' }}>📋 لیست پرسنل</h4>
                    <div className='item-list'>
                        {personnel.length === 0 ? (
                            <p>هیچ پرسنلی تعریف نشده است</p>
                        ) : (
                            personnel.map((person) => (
                                <div key={person.id} className='item-row'>
                                    <span>
                                        {person.name}
                                        <span className='section-tag'>
                                            {person.sections?.name ||
                                                'بدون بخش'}
                                        </span>
                                    </span>
                                    <button
                                        onClick={() =>
                                            deletePersonnel(
                                                person.id,
                                                person.name
                                            )
                                        }
                                        className='admin-btn danger small'
                                    >
                                        حذف
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

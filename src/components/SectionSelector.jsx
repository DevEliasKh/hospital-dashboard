import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SectionSelector({ onSelect, selectedId }) {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSections = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase
                    .from('sections')
                    .select('*')
                    .order('name');
                if (error) {
                    throw new Error(
                        `Supabase error: ${error.message} (${error.code})`
                    );
                }

                if (!data || data.length === 0) {
                    setError(
                        'هیچ بخشی در دیتابیس یافت نشد. لطفاً ابتدا بخش‌ها را اضافه کنید.'
                    );
                    setSections([]);
                    return;
                }

                setSections(data);

                // انتخاب اولین بخش به صورت پیش‌فرض
                if (!selectedId && data.length > 0) {
                    onSelect(data[0].id);
                }
            } catch (err) {
                console.error('❌ Error in fetchSections:', err);
                setError('خطا در دریافت اطلاعات بخش‌ها: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSections();
    }, []);

    if (loading) {
        return <div className='loading'>در حال بارگذاری بخش‌ها...</div>;
    }

    if (error) {
        return <div className='error-message'>{error}</div>;
    }

    return (
        <div className='section-selector'>
            <label>بخش:</label>
            <select
                value={selectedId || ''}
                onChange={(e) => onSelect(Number(e.target.value))}
            >
                <option value=''>انتخاب بخش...</option>
                {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                        {section.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

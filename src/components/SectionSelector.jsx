import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// src/components/SectionSelector.jsx - قسمت اصلی را به‌روز کنید
export default function SectionSelector({
    onSelect,
    selectedId,
    userRole,
    userSectionId,
}) {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSections = async () => {
            setLoading(true);
            try {
                let query = supabase.from('sections').select('*').order('name');

                // اگر سرپرستار است، فقط بخش خودش را ببیند
                if (userRole === 'head_nurse' && userSectionId) {
                    query = query.eq('id', userSectionId);
                }

                const { data, error } = await query;

                if (error) throw error;

                setSections(data || []);
                if (data && data.length > 0 && !selectedId) {
                    onSelect(data[0].id);
                }
            } catch (err) {
                setError(err.message);
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

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ShiftTable({ sectionId, month, year }) {
    const [personnel, setPersonnel] = useState([]);
    const [shifts, setShifts] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});

    const daysInMonth = new Date(year, month, 0).getDate();

    // دریافت پرسنل
    useEffect(() => {
        const fetchPersonnel = async () => {
            const { data } = await supabase
                .from('personnel')
                .select('*')
                .eq('section_id', sectionId)
                .order('name');

            if (data) setPersonnel(data);
        };
        fetchPersonnel();
    }, [sectionId]);
    // دریافت شیفت‌ها
    useEffect(() => {
        const fetchShifts = async () => {
            setLoading(true);
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
            const endDate = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

            const { data } = await supabase
                .from('shifts')
                .select('*')
                .gte('shift_date', startDate)
                .lte('shift_date', endDate);

            const shiftMap = {};
            data?.forEach((s) => {
                shiftMap[`${s.personnel_id}_${s.shift_date}`] = s.shift_type;
            });
            setShifts(shiftMap);
            setLoading(false);
        };
        fetchShifts();
    }, [sectionId, month, year, daysInMonth]);

    const updateShift = async (personnelId, date, shiftType) => {
        const key = `${personnelId}_${date}`;
        setUpdating((prev) => ({ ...prev, [key]: true }));

        const { error } = await supabase.from('shifts').upsert({
            personnel_id: personnelId,
            shift_date: date,
            shift_type: shiftType || null,
            updated_at: new Date().toISOString(),
        });

        if (!error) {
            setShifts((prev) => ({
                ...prev,
                [key]: shiftType,
            }));
        } else {
            alert('خطا در ذخیره: ' + error.message);
        }

        setUpdating((prev) => ({ ...prev, [key]: false }));
    };

    const shiftColors = {
        M: '#4CAF50', // سبز - صبح
        E: '#FF9800', // نارنجی - عصر
        N: '#2196F3', // آبی - شب
        OFF: '#9E9E9E', // خاکستری - استراحت
        SICK: '#F44336', // قرمز - مرخصی استعلاجی
        VACATION: '#FFEB3B', // زرد - مرخصی
    };

    const shiftLabels = {
        M: 'صبح',
        E: 'عصر',
        N: 'شب',
        OFF: 'استراحت',
        SICK: 'مرخصی',
        VACATION: 'مرخصی',
    };

    if (loading) return <div className='loading'>در حال بارگذاری...</div>;

    return (
        <div className='table-container'>
            <table className='shift-table'>
                <thead>
                    <tr>
                        <th>پرسنل</th>
                        {[...Array(daysInMonth)].map((_, i) => (
                            <th key={i}>{i + 1}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {personnel.map((person) => (
                        <tr key={person.id}>
                            <td className='person-name'>{person.name}</td>
                            {[...Array(daysInMonth)].map((_, dayIndex) => {
                                const date = `${year}-${String(month).padStart(2, '0')}-${String(dayIndex + 1).padStart(2, '0')}`;
                                const key = `${person.id}_${date}`;
                                const currentShift = shifts[key] || '';
                                const isUpdating = updating[key];

                                return (
                                    <td key={dayIndex} className='shift-cell'>
                                        <select
                                            value={currentShift}
                                            onChange={(e) =>
                                                updateShift(
                                                    person.id,
                                                    date,
                                                    e.target.value
                                                )
                                            }
                                            disabled={isUpdating}
                                            style={{
                                                backgroundColor: currentShift
                                                    ? shiftColors[currentShift]
                                                    : 'white',
                                                color: currentShift
                                                    ? 'white'
                                                    : 'black',
                                                border: '1px solid #ddd',
                                                padding: '4px',
                                                borderRadius: '4px',
                                                width: '100%',
                                                cursor: 'pointer',
                                                opacity: isUpdating ? 0.6 : 1,
                                            }}
                                        >
                                            <option value=''>-</option>
                                            <option value='M'>صبح</option>
                                            <option value='E'>عصر</option>
                                            <option value='N'>شب</option>
                                            <option value='OFF'>استراحت</option>
                                            <option value='SICK'>مرخصی</option>
                                            <option value='VACATION'>
                                                مرخصی
                                            </option>
                                        </select>
                                        {isUpdating && (
                                            <span className='loading-dot'>
                                                ⏳
                                            </span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

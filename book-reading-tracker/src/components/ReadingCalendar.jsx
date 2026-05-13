import { useReading } from '../context/ReadingContext';

export default function ReadingCalendar() {
  const { getCalendarData } = useReading();
  const calendarData = getCalendarData();

  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        day: i,
        date: dateStr,
        data: calendarData[dateStr]
      });
    }
    
    return days;
  };

  const days = generateCalendarDays();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const todayStr = new Date().toISOString().split('T')[0];

  const getDayClassName = (dayData) => {
    if (!dayData) return 'empty';
    const classes = ['day'];
    if (dayData.data) classes.push('has-reading');
    if (dayData.date === todayStr) classes.push('today');
    return classes.join(' ');
  };

  const getDayColor = (dayData) => {
    if (!dayData?.data) return {};
    const pages = dayData.data.pages;
    if (pages >= 50) return { backgroundColor: '#2ecc71' };
    if (pages >= 30) return { backgroundColor: '#27ae60' };
    if (pages >= 10) return { backgroundColor: '#52d98b' };
    return { backgroundColor: '#85e0a8' };
  };

  return (
    <div className="calendar">
      <h3>阅读日历</h3>
      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} className="week-day">{day}</div>
        ))}
        {days.map((dayData, index) => (
          <div 
            key={index} 
            className={getDayClassName(dayData)}
            style={getDayColor(dayData)}
            title={dayData?.data ? `${dayData.data.pages} 页, ${Math.round(dayData.data.duration)} 分钟` : ''}
          >
            {dayData?.day}
          </div>
        ))}
      </div>
      <div className="calendar-legend">
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#85e0a8' }}></span>
          10-29 页
        </span>
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#52d98b' }}></span>
          30-49 页
        </span>
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#27ae60' }}></span>
          50+ 页
        </span>
      </div>
    </div>
  );
}

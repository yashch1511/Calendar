import React, { useState, useEffect } from 'react';
import eventsData from './calendar.json';




function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState('');

 

 
   useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events'));
    
    if (storedEvents) {
      setEvents(storedEvents);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  function daysInMonth(date){
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  function startDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  function prevMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  function openEventDialog(date){
    setSelectedDate(date);
    setShowEventDialog(true);
  };

  function deleteEvent(){
    if (selectedDate && events[selectedDate]) {
      const updatedEvents = { ...events };
      delete updatedEvents[selectedDate]; 
  
      setEvents(updatedEvents);
      setShowEventDialog(false);
    }
  };
  function addEvent(){
    if (!newEventTitle) return;

    const updatedEvents = {
      ...events,
      [selectedDate]: newEventTitle,
    };

    setEvents(updatedEvents);
    setNewEventTitle('');
    setShowEventDialog(false);
  };

  function renderCalendar(){
    const totalDays = daysInMonth(currentDate);
    const firstDayOfMonth = startDayOfMonth(currentDate);
    const calendarDays = [];
    const today = new Date();
    

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
  
    for (let day = 1; day <= totalDays; day++) {
      const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let event = null;
      const isToday = today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

  
      if (events[date]) {
        event = events[date];
      } else {
        const holiday = eventsData.response.holidays.find(holiday => holiday.date.iso === date);
        if (holiday) {
          event = holiday.name;
        }
      }

      
  
      calendarDays.push(
        <div key={date} className={`calendar-day ${isToday ? 'today' : ''}`} onClick={() => openEventDialog(date)}>
          <span>{day}</span>
          {event && <div className="event">{event}</div>}
        </div>
      );
    }
  
    return calendarDays;
  };
  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="navigate" onClick={prevMonth}>Previous</button>
        <h2>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button className="navigate" onClick={nextMonth}>Next</button>
      </div>
      
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div  className="calendar-day-header">{day}</div>
        ))}
        {renderCalendar()}
      </div>
      {showEventDialog && (
        <div className="event-dialog">
          <h3>Add Event</h3>
          <input
            className="Title"
            id="haha"
            type="text"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            placeholder="Event title"
          />
          <button className='addevent' onClick={addEvent}>Add</button>
          <button className='cancel' onClick={() => setShowEventDialog(false)}>Cancel</button>
          <button className='cancel' onClick={deleteEvent}>Delete</button>
        </div>
      )}

     
    </div>
  );
}

export default Calendar;






import React, { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import './scss/_custom.scss';
import { useDispatch, useSelector } from "react-redux";
import { setCalendar } from "src/redux/calendarSlice";
import Swal from "sweetalert";
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getMonthData = (year, month) => {
  const totalDays = daysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  const monthData = [];
  let day = 1;

  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        week.push(null);
      } else if (day <= totalDays) {
        week.push(day);
        day++;
      }
    }
    monthData.push(week);
  }

  return monthData;
};

const App = () => {
  const dispatch = useDispatch();

  const events = useSelector((state) => state.calendar);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [isEditDay, setIsEditDay] = useState("");
  const [isEditIndex, setIsEditIndex] = useState("");

  const openModal = () => {
    const dayEvents = events[Number(yearString + monthString + selectedDay)] || [];
    
    if (dayEvents.length >= 3) {
      Swal("Maximum 3 events allowed for this day", "", "warning");
      return;
    }
    
    setIsEdit(false);
    setEventName('');
    setEventEmail('');
    setEventTime('00:00');
    setEventAmpm('am');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventEmail, setEventEmail] = useState('');
  const [eventTime, setEventTime] = useState('00:00');
  const [eventAmpm, setEventAmpm] = useState('am');
  const [year] = useState(new Date().getFullYear());
  const [month] = useState(new Date().getMonth());
  const [yearString] = useState(new Date().getFullYear().toString());
  const [monthString] = useState((new Date().getMonth() + 1).toString());
  const [monthData] = useState(getMonthData(year, month));
  const [selectedDay, setSelectedDay] = useState(null);
  const [usedColors, setUsedColors] = useState({});

  const getRandomColor = () => {
    const getRandomHex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  
    let color;
    do {
      color = `#${getRandomHex()}${getRandomHex()}${getRandomHex()}`;
    } while (isVeryLightColor(color)); // Repeat until a non-very-light color is generated
  
    return color;
  };
  
  const isVeryLightColor = (color) => {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
  
    // You can adjust these threshold values based on your preference
    return r > 220 && g > 220 && b > 220;
  };

  const getUniqueColorForDay = (day) => {
    const existingColors = usedColors[day] || [];
    let color;
    do {
      color = getRandomColor();
    } while (existingColors.includes(color));
    setUsedColors({
      ...usedColors,
      [day]: [...existingColors, color],
    });
    return color;
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  
  const isDaySelected = (day) => {
    return selectedDay === day;
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!selectedDay) {
      return; // No selected day, do nothing
    }

    const dayEvents = events[Number(yearString + monthString + selectedDay)] || [];

    Swal("are you sure to add new event?", {
      dangerMode: true,
      cancel: true,
      buttons: true,
      icon: "info",
    }).then((result) => {
      if (result) {
        const newEvent = { name: eventName, email: eventEmail, time: eventTime, zone: eventAmpm, background: getUniqueColorForDay(selectedDay) };
        const updatedEvents = [...dayEvents, newEvent];

        Swal("Data Successfully Created", "", "success");

        dispatch(
          setCalendar({
            calendar: {...events, [Number(yearString + monthString + selectedDay)]: updatedEvents}
          })
        );

        setIsModalOpen(false);
      }
    });
  };

  const handleEventClick = (event, index) => {
    setSelectedIndex(index);
  };

  const editModal = (day, index) => {
    if (!events[Number(yearString + monthString + day)]) {
      return; // Handle appropriately if events[day] is undefined
    }

    const currentEvent = events[Number(yearString + monthString + day)][index];

    setIsEdit(true);
    setEventName(currentEvent.name);
    setEventEmail(currentEvent.email);
    setEventTime(currentEvent.time);
    setEventAmpm(currentEvent.zone);
    setIsEditDay(day);
    setIsEditIndex(index);
    setIsModalOpen(true);
  };

  const handleEditEvent = (e) => {
    e.preventDefault();
    if (!events[Number(yearString + monthString + isEditDay)]) {
      return; // Handle appropriately if events[day] is undefined
    }

    Swal("are you sure to update this event?", {
      dangerMode: true,
      cancel: true,
      buttons: true,
      icon: "info",
    }).then((result) => {
      if (result) {
        const updatedEvents = [...events[Number(yearString + monthString + isEditDay)]];
        updatedEvents[isEditIndex] = {
          ...updatedEvents[isEditIndex],
          name: eventName,
          email: eventEmail,
          time: eventTime,
          zone: eventAmpm
        };
    
        Swal("Data Successfully Updated", "", "success");

        setIsEditDay('');
        setIsEditIndex('');
    
        dispatch(
          setCalendar({
            calendar: {...events, [Number(yearString + monthString + isEditDay)]: updatedEvents}
          })
        );

        setIsModalOpen(false);
      }
    })
  };

  const handleDeleteEvent = (day, index) => {
    Swal("are you sure to delete this event?", {
      dangerMode: true,
      cancel: true,
      buttons: true,
      icon: "info",
    }).then((result) => {
      if (result) {
        if (!events[Number(yearString + monthString + day)]) {
          return; // Handle appropriately if events[day] is undefined
        }
  
        const updatedEvents = events[Number(yearString + monthString + day)].filter((_, i) => i !== index);
  
        Swal("Data Successfully Deleted", "", "success");

        setSelectedIndex(null);
  
        dispatch(
          setCalendar({
            calendar: {...events, [Number(yearString + monthString + day)]: updatedEvents}
          })
        );
      }
    })
  };

  const renderEvents = (day) => {
    const dayEvents = events[Number(yearString + monthString + day)] || [];

    return dayEvents.map((event, index) => (
      <div
        key={index}
        className="event"
        style={{ backgroundColor: event.background }}
        onClick={() => handleEventClick(day, index)}
      >
        <span>
          <table className="table-name">
            <thead className="thead-left">
              <tr>
                <th className="first-row">{event.name}</th>
                {(selectedDay === day && selectedIndex === index) && (
                <th className="second-row">
                    <button className="action" onClick={() => handleDeleteEvent(day, index)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                    <button className="action" onClick={() => editModal(day, index)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                </th>
                )}
              </tr>
            </thead>
          </table>
        </span>
        <span>{event.email}</span>
        <span>{event.time} {event.zone}</span>
      </div>
    ));
  };

  const renderCalendar = () => {
    return monthData.map((week, weekIndex) => (
      <tr key={weekIndex}>
        {week.map((day, dayIndex) => (
          <td
            style={{ background: isDaySelected(day) ? 'gray' : '#f0f0f0' }}
            key={dayIndex}
            className={`day ${day ? 'active' : ''} ${selectedDay === day ? 'selected' : ''}`}
            onClick={() => handleDayClick(day)}
          >
            <div className="day-label">{day}</div>
            <br/>
            {renderEvents(day)}
          </td>
        ))}
      </tr>
    ));
  };

  const monthYearTitle = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(year, month, 1)
  );
  
  const handleEvent = (e) => {
    setEventName(e.target.value);
  };

  const handleEmail = (e) => {
    setEventEmail(e.target.value);
  };

  const handleTime = (e) => {
    setEventTime(e.target.value);
  };

  const handleAmpm = (e) => {
    setEventAmpm(e.target.value);
  };

  return (
    <>
      <div id="app-element">
        {/* Content of your application */}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        appElement={document.getElementById('app-element')}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000, // Adjust the z-index as needed,
          },
          content: {
            width: '60%', // Set the content width to 30%
            height: '490px',
            margin: 'auto', // Center the modal horizontally
          }
        }}
      >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Data</h5>
      </div>
      <form onSubmit={isEdit ? handleEditEvent : handleAddEvent}>
        <div className="modal-body">
          <div className="form-group">
            <label  htmlFor="name" className="col-form-label">Nama Event</label>
            <input required type="text" className="form-control" value={eventName} onChange={handleEvent} />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="col-form-label">Email</label>
            <input required type="email" className="form-control" value={eventEmail} onChange={handleEmail} />
          </div>
          <div className="form-group">
            <label htmlFor="time" className="col-form-label">Jam</label>
            <div className="d-flex">
              <select type="text" value={eventTime} className="form-control" onChange={handleTime}>
                <option value="00:00">00:00</option>
                <option value="01:00">01:00</option>
                <option value="02:00">02:00</option>
                <option value="03:00">03:00</option>
                <option value="04:00">04:00</option>
                <option value="05:00">05:00</option>
                <option value="06:00">06:00</option>
                <option value="07:00">07:00</option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
              </select>
              <select type="text" value={eventAmpm} className="form-control" onChange={handleAmpm}>
                <option value="am">am</option>
                <option value="pm">pm</option>
              </select>
            </div>
          </div>    
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
          <button type="submit" className="btn btn-primary">{isEdit ? "Update" : "Save"}</button>
        </div>
      </form>
      </Modal>
      
      <div className="title">
        <h2>{monthYearTitle}</h2>
      </div>
      <table className="body-responsive">
        <thead>
          <tr>
            <th>
              <div className="App container">
                <table className="calendar">
                  <thead className="thead-day">
                    <tr>
                      <th>Sunday</th>
                      <th>Monday</th>
                      <th>Tuesday</th>
                      <th>Wednesday</th>
                      <th>Thursday</th>
                      <th>Friday</th>
                      <th>Saturday</th>
                    </tr>
                  </thead>
                  <tbody>{renderCalendar()}</tbody>
                </table>
              </div>
            </th>
            {selectedDay && (
              <th>
                <div>
                  <span onClick={openModal} className="circle-button"><FaPlusCircle /></span>
                </div>
              </th>
            )}
          </tr>
        </thead>
      </table>
    </>
  );
};

export default App;

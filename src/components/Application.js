import React, { useState, useEffect } from "react";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
const axios = require('axios').default;

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "3pm",
    interview: {
      student: "Gabi Geollegue",
      interviewer: {
        id: 1,
        name: "Tori Malcolm",
        avatar: "https://i.imgur.com/Nmx0Qxo.png",
      }
    }
  },
  {
    id: 4,
    time: "4pm",
    interview: {
      student: "Test User 3",
      interviewer: {
        id: 1,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png",
      }
    }
  },
  {
    id: 5,
    time: "2pm",
    interview: {
      student: "Test User 4",
      interviewer: {
        id: 1,
        name: "Sven Jones",
        avatar: "https://i.imgur.com/twYrpay.jpg",
      }
    }
  }
];


export default function Application(props) {
  const [day, setDay] = useState("Monday");
  const [days, setDays] = useState([]);
  const allAppointments = appointments.map(appointment => {
    return (
      <Appointment
        key={appointment.id}
        {...appointment}
      />
    );
  });

  useEffect(() => {
    axios.get('/api/days')
      .then(function (response) {
        // handle success
        setDays(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }, []);
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList 
          days={days} 
          day={day} 
          setDay={setDay} 
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {allAppointments}
    <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

import React, { useState, useEffect } from "react";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay} from "helpers/selectors";

const axios = require('axios').default;

export default function Application() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({...state, day})

  const allAppointments = getAppointmentsForDay(state, state.day);
  const allInterviewers = getInterviewersForDay(state, state.day);
  
  function bookInterview(id, interview) {
    // console.log("bookInterview: ID:", id, "Interview:",interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
  };
   return axios.put(`/api/appointments/${id}`,{interview})
    .then((data) => {
      // console.log(data)
      setState({
        ...state,
        appointments
      });
    })
  }
  function cancelInterview(id, interview) {
    console.log("bookCancel: ID:", id, "Interview:", interview);
    interview = null;
    return axios.delete(`/api/appointments/${id}`)
  };
  const schedule = allAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={allInterviewers}
        bookInterview = {bookInterview}
        cancelInterview= {cancelInterview}
      />
    );
  });

 

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers'))

    ]).then((data) => {
      setState(() => ({ 
        day:"Monday", 
        days: data[0].data, 
        appointments: data[1].data, 
        interviewers: data[2].data}));
    });
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
          days={state.days} 
          day={state.day} 
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
        {schedule}
    <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

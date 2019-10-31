import React, { useState, useEffect } from 'react';
const axios = require('axios').default;


export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({ ...state, day })

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, { interview })
      .then((data) => {
        setState({
          ...state,
          appointments
        });
      })
  }

  function cancelInterview(id, interview) {
    interview = null;
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${id}`, { interview })
      .then((data) => {
        // console.log(data)
        setState({
          ...state,
          appointments
        });
      })
  };
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers'))
    ]).then((data) => {
      setState(() => ({
        day: "Monday",
        days: data[0].data,
        appointments: data[1].data,
        interviewers: data[2].data
      }));
    });
  }, []);

  return {state, setDay, bookInterview, cancelInterview}
};

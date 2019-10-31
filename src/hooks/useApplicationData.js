import React, { useReducer, useEffect } from 'react';

const axios = require('axios').default;

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value }
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };
    case SET_INTERVIEW: {
      const appointment = {
        ...state.appointments[action.eventData.id],
        interview: action.eventData.interview
          ? { ...action.eventData.interview }
          : null
      };
      const appointments = {
        ...state.appointments,
        [action.eventData.id]: appointment
      };

      return { ...state, appointments}
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({type: SET_DAY, value: day});

  function bookInterview(id, interview) {
    let input = {id, interview};
    return axios.put(`/api/appointments/${id}`, { interview })
      .then((data) => {
        dispatch({ type: SET_INTERVIEW, input });
      })
  };

  function cancelInterview(id, interview) {
    let input = { id, interview };
    return axios.delete(`/api/appointments/${id}`, { interview })
      .then((data) => {
        dispatch({ type: SET_INTERVIEW, input })
      })
  };

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers'))
    ]).then((data) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        day: "Monday",
        days: data[0].data,
        appointments: data[1].data,
        interviewers: data[2].data
      });
    });
  }, []);

  return {state, setDay, bookInterview, cancelInterview}
};


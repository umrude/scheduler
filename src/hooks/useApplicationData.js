// eslint-disable-next-line no-unused-vars
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
        ...state.appointments[action.input.id],
        interview: { ...action.input.interview }
      };
      const appointments = {
        ...state.appointments,
        [action.input.id]: appointment
      };

      for (const day of { ...state }.days){
        if(day.name === state.day){
          day.spots += action.spots;
        }
      }
      return { ...state, appointments}
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

const initialState = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
};

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setDay = day => dispatch({type: SET_DAY, value: day});

  function bookInterview(id, interview) {
    let input = {id:id, interview};
    let spots = -1;
    if (state.appointments[id].interview) {
      spots = 0;
    }

    return axios.put(`/api/appointments/${id}`, { interview })
      .then((data) => {
        dispatch({ type: SET_INTERVIEW, input, spots });
      })
  };

  function cancelInterview(id, interview) {
    let spots = 1;


    let input = { id:id, interview: null };
    return axios.delete(`/api/appointments/${id}`)
      .then((data) => {
        dispatch({ type: SET_INTERVIEW, input, spots })
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
        days: data[0].data,
        appointments: data[1].data,
        interviewers: data[2].data
      });
    });
  }, []);

  return {state, setDay, bookInterview, cancelInterview}
};


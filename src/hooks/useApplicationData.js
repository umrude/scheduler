// eslint-disable-next-line no-unused-vars
import React, { useReducer, useEffect } from 'react';
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";


const initialState = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
};

//handles axios requests for booking/deleting; gets api data for initial data
export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setDay = day => dispatch({ type: SET_DAY, value: day });

  function bookInterview(id, interview) {
    const input = { id: id, interview };
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
    const spots = 1;

    const input = { id: id, interview: null };
    return axios.delete(`/api/appointments/${id}`)
      .then((data) => {
        dispatch({ type: SET_INTERVIEW, input, spots })
      })
  };

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((data) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: data[0].data,
        appointments: data[1].data,
        interviewers: data[2].data
      });
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview }
};


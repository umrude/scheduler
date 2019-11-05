
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
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
        interview: action.input.interview && { ...action.input.interview }
      };
      const appointments = {
        ...state.appointments,
        [action.input.id]: appointment
      };

      const modifiedDay = state.days.find(day => day.appointments.includes(action.input.id))
      const days = state.days.map(day => {
        if (day.name === modifiedDay.name) {

          return {
            ...day,
            spots: day.spots + action.spots
          }
        }

        return day;
      })

      return { ...state, days, appointments }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, reducer };

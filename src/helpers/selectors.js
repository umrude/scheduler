export function getAppointmentsForDay(state, day) {
  let result = [];
  const allDays = state.days.filter((dayIn) => {
      return dayIn.name === day;
  })

  if (allDays[0] === undefined) {
    return result
  }
  allDays[0].appointments.forEach((id) => {
    result.push(state.appointments[id.toString()]);
  });
  return result;
}



export function getInterview(state, interview) {
  if (interview === null) {
    return null;
  } 
  const interviews = {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  };
  
  return interviews;
}

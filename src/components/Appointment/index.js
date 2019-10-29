import React, { Fragment } from 'react';

import "components/Appointment/styles.scss";
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
// import Form from './Form';
// import Status from './Status';
// import Confirm from './Confirm';
// import Error from './Error';
import "components/Appointment/styles.scss";

export default function Appointment(props) {
  console.log(props);
  return (
  <article className="appointment">
    <Header time={props.time}></Header>
    {props.interview ? 
    <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
    ></Show> : <Empty></Empty>}
  </article>);
}
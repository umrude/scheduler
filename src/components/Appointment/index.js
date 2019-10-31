import React from 'react';

import "components/Appointment/styles.scss";
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';


import "components/Appointment/styles.scss";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE"
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRMDEL = "CONFIRMDEL";
const EDIT = "EDIT";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
  }

  function deleteInterview(id, interview) {
    props.cancelInterview(id, interview).then(() => transition(EMPTY))
  }
  function confirmDel() {
    transition(CONFIRMDEL);
  }
  return (
  <article className="appointment">
    <Header time={props.time}></Header>

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onDelete = {() => confirmDel()}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={(name, interviewer) => { 
            save(name, interviewer); 
            transition(SAVING)
          }}
        />
      )}
      {mode === SAVING && (
        <Status
          message="Saving"
        />
      )}
      {mode === DELETING && (
        <Status
          message="Deleting"
        />
      )}
      {mode === CONFIRMDEL && (
        <Confirm
          message="Are you sure you would like to delete this appointment?"
          onCancel={() => transition(SHOW)}
          onConfirm={() => { deleteInterview(props.id, props.interview); transition(DELETING) }}
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          name={props.interview.student}
          onCancel={() => back()}
          onSave={(name, interviewer) => { save(name, interviewer); transition(SAVING)}}
        />
      )}
      
  </article>

  );
}
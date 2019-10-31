import React from 'react';

import "components/Appointment/styles.scss";
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';


import "components/Appointment/styles.scss";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE"
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRMDEL = "CONFIRMDEL";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE"

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  function save(name, interviewer) {
    transition(SAVING, true)
    const interview = {
      student: name,
      interviewer
    };
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  function deleteInterview(id, interview) {
    transition(DELETING, true);
    props
      .cancelInterview(id, interview)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
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
            save(name, interviewer)
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
          message="Are you sure you want to delete this appointment?"
          onCancel={() => transition(SHOW)}
          onConfirm={() => { deleteInterview(props.id, props.interview) }}
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          name={props.interview.student}
          onCancel={() => back()}
          onSave={(name, interviewer) => { save(name, interviewer)}}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Error in saving appointment."
          onClose={() => back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Could not delete appointment."
          onClose={() => back()}
        />
      )}
      
  </article>

  );
}
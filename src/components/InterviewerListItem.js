import React from "react";

import "components/InterviewerListItem.scss";

let classNames = require('classnames');

export default function InterviewerListItem(props) {
  let itemClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });
  return (
    <li className={itemClass}
      onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}
import React from 'react';
import './Card.css';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Card = (props) => {
  const duration = moment(props.time).fromNow();

  return (
    <div className="Card">
       <Link to={'post/' + props.id} className="Card-link">
      <div className="Card-header">
        <h2 className="Card-title">{props.title}</h2>
        <p>{props.user}</p>
      </div>
      <div className="Card-meta">
        <p className="Card-date">Created {duration}</p>
        <p className="Card-votes">{props.vote} votes</p>
      </div>
      <div className="Card-content">
        <p>{props.description}</p>
      </div>
       </Link>
    </div>
  );
};

export default Card;

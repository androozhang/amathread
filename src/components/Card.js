import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useAuth } from '../context/AuthProvider';

const Card = (props) => {
  const duration = moment(props.time).fromNow();

  return (
    <div className="w-full bg-white mt-4 p-0 rounded border border-gray-400 shadow-md">
      <Link to={'/post/' + props.id} className="no-underline">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl text-black font-bold">{props.title}</h2>
          <p>{props.user}</p>
        </div>
        <div className="flex justify-between p-4 text-sm text-gray-600">
          <p className="mr-4">Created {duration}</p>
          <p>{props.vote} votes</p>
        </div>
        <div className="p-4">
          <p className="text-lg text-black">{props.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default Card;

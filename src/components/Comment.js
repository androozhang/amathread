import React from 'react';

const Comment = ({ comment }) => {
    return (
        <div className="comment">
            <h5>{comment.username}</h5>
            <p>{comment.description}</p>
        </div>
    );
};

export default Comment;

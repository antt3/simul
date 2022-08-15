import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as channelMessagesReducer from '../../store/channelMessages';

const EditChat = ({ socket, setShowModal, message }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [content, setContent] = useState(message.message);
    const [validationErrors, setValidationErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false)

    useEffect(() => {
		const errors = [];

		if (!content) errors.push("A message is required.");
        if (content.length > 255) errors.push("The message must be less than 250 characters long.")

		setValidationErrors(errors);
	}, [content]);

    const onSubmit = async(e) => {
        e.preventDefault();
        setHasSubmitted(true);

        if (!validationErrors.length) {
            setHasSubmitted(false);

            const res = await dispatch(channelMessagesReducer.thunkEditMessage(content, message.created_at, message.id));
            // console.log('--------EditRes: ', res, '-----------');
            if (res) {
                setContent("");
                setShowModal(false);
                history.push(`/channels/${message.channel.id}`);
                socket.emit("chat", res);
            };
        };
    };

    const handleClick = async(e) => {

        e.preventDefault();
        setShowModal(false);

    };

    return (
        <div className='c_div'>
            <h1>Edit Your Message</h1>
            {hasSubmitted && validationErrors.length > 0 && (
                <div className='form_errors'>
                    <ul>
                        {validationErrors.map(error => (
                            <li className="form_error" key={error}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            { message && <form className="form" onSubmit={onSubmit}>
                <textarea
                    value={content}
                    className='dark edit_chat_textarea'
                    placeholder={`Message #${message.channel.title}`}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div>
                    <button className='form_divs other_cancel' onClick={(e) => handleClick(e)}>Cancel</button>
                    <button className="form_divs other_submit" type="submit">Confirm</button>
                </div>
            </form> }
        </div>
    );
};

export default EditChat;
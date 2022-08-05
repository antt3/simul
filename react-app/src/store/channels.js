const GET_CHANNELS = "channels/GET_CHANNEL";
const ADD_CHANNEL = "channels/ADD_CHANNEL";
const EDIT_CHANNEL = "channels/EDIT_CHANNEL";
const DELETE_CHANNEL = "channels/DELETE_CHANNEL";

const actionGetChannels = (channels) => {
	return {
		type: GET_CHANNELS,
		channels
	};
};

const actionAddChannel = (channel) => {
	return {
		type: ADD_CHANNEL,
		channel,
	};
};

const actionEditChannel = (channel) => {
	return {
		type: EDIT_CHANNEL,
		channel,
	};
};

const actionDeleteChannel = (channelId) => {
	return {
		type: DELETE_CHANNEL,
		channelId,
	};
};

export const thunkGetChannels = (channels) => async (dispatch) => {
	const res = await fetch("/api/channels/");
	const channels = await res.json();
	dispatch(actionGetChannels(channels));
	return res;
};


export const thunkAddChannel = (channel) => async (dispatch) => {
	const response = await fetch("/api/channels/", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(channel),
	});
	const data = await response.json();
	dispatch(actionAddChannel(data));
	return data;
};

export const thunkEditChannel = (channel) => async (dispatch) => {
	const response = await fetch(`/api/channels/${channel.id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(channel),
	});

	const data = await response.json();
	dispatch(actionEditChannel(data));
	return data;
};

export const thunkDeleteChannel = (channelId) => async (dispatch) => {
	const response = await fetch(`/api/channels/${channelId}`, {
		method: "DELETE",
	});
	dispatch(actionDeleteChannel(channelId));
	return response;
};

const channelReducer = (state = {}, action) => {
	const newState = { ...state };
	switch (action.type) {
		case GET_CHANNELS:
			action.channels.channels.forEach((channel) => {
				newState[channel.id] = channel;
			});
			return newState;

		case ADD_CHANNEL:
			newState[action.channel.id] = action.channel;
			return newState;

		case DELETE_CHANNEL:
			delete newState[action.channelId];
			return newState;

		default:
			return state;
	}
};

export default channelReducer;
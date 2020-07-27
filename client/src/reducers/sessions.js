const initialState = {
	accessToken: undefined
};

const sessions = (state = initialState, action) => {
	switch (action.type) {
		case 'SIGN_IN':
			console.log("SIGN_IN: ", action.accessToken);
			return Object.assign({}, state, {
		    	accessToken: action.accessToken
		    });
		case 'SIGN_OUT':
			return Object.assign({}, state, initialState)
		default:
			return state;
	}
}

export default sessions;
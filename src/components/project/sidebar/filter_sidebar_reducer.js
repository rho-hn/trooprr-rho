const initialState = {
	filterItems: {}
}

export default (state = initialState, action) => {
	switch(action.type){
    case 'SET_SQUAD_FILTER':
    // console.log("old state:", state.filterItems)
      let newstate = {
        ...state,
        filterItems: { 
          ...state.filterItems, 
          [action.sqId]:action.filterItems,
        // filterItems:action.filterItems
        }
      }
      // console.log("new state:", newstate)
      return newstate;

		default:
			return state;
	}
}
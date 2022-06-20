export function setSquadFilter(filterItems, sqId){
	return{
		type: 'SET_SQUAD_FILTER',
    filterItems,
    sqId
	}
}

// export function setFilterSidebarValue(value){
// 	return{
// 		type: 'SET_FILTER_VALUE',
// 		payload: value
// 	}
// }
// export function searchForTags(value){
// 	return{
// 		type: 'SEARCH_TAGS',
// 		value
// 	}
// }

// export function clearTagsSearch(){
// 	return{
// 		type: 'CLEAR_TAGS_SEARCH'
// 	}
// }

// export function setTagValue(tag){
// 	return{
// 		type: 'SET_TAG_VALUE',
// 		tag
// 	}
// }

// export function removeTag(tag){
// 	return {
// 		type: 'REMOVE_TAG',
// 		tag
// 	}
// }

// export function setMembers(member){
// 	return{
// 		type: 'BY_MEMBER',
// 		member
// 	}
// }

// export function setUnassigned(isFromHeader){
// 	return{
// 		type: 'SET_UNASSIGNED',
// 		isFromHeader: !isFromHeader
// 	}
// }

// export function clearFilters(filter){
// 	return{
// 		type: 'CLEAR_FILTERS',
// 		filter
// 	}
// }

// export function setStackValue(sortValue){
// 	return {
// 		type: 'SET_STACK_VALUE',
// 		sortValue
// 	}	
// }

// export function setMyspaceDefaultView(){
//   return{
//     type: 'SET_MYSPACE_FILTER_VALUE'
//   }
// }
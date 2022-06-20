export const loadState = () => {
  try {
    let filterObj = {
      filterSidebarValue: {
        filterItems:{}
      }
    }
    for (let i = 0; i < localStorage.length; i++){
      if (localStorage.key(i).startsWith("redux_store.filter.")) {
        let matchingKey = localStorage.key(i)
        let serializedValue = localStorage.getItem(matchingKey)
        if(serializedValue != null) {
          try{
            filterObj.filterSidebarValue.filterItems[matchingKey.split("redux_store.filter.")[1]] = JSON.parse(serializedValue)
          }catch(e){
            console.error(e)
          }
        }
      }
    }
    // console.log("got this from localstorage:",filterObj)
    return filterObj
  } catch (e) {
    console.error(e)
    return {}}
}

export const saveState = (store) => {
  try {
    let ftr = store.filterSidebarValue.filterItems
    if(ftr) {
      Object.keys(ftr).forEach(sqId =>{
        // console.log("will write to localstorage now..")
        localStorage.setItem("redux_store.filter."+sqId, JSON.stringify(store.filterSidebarValue.filterItems[sqId]))
      })
    }
  } catch (e) {console.error(e)}
}
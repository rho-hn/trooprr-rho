
export const GenerateProjectKey = (projectname, projectkeys = []) => {
  if (projectname.length == 1||projectname.length==0) return "";
  let key = getKey(projectname,2);
  let uniquekey = getUniqueKey(key, projectkeys,2,projectname);
  return uniquekey;
};

const getKey = (projectname,count) => {
  let key = "";
  let words = projectname.split(/[\s-_]+/g);
  //split by -_"""
  if (words.length == 1) {

    key = words[0].replace(/[^\w\s]/gi, "")
    //replace all special characters
        
  } else {
    key = words
      .reduce((response, word) => (response += word.slice(0, 1)), "")
      .replace(/[^\w\s]/gi, "")

  }
  let filteredKey=""
  // let cou=0
  let letterNumber = /^[a-zA-Z]+$/;
  for (let i = 0; i < key.length; i++) {
    if(filteredKey.length<2 &&key[i].match(letterNumber)){
      filteredKey+=key[i]
    }
    else if(filteredKey.length>=2){
           filteredKey+=key[i]
    }
  
  }
    return filteredKey.slice(0,count).toUpperCase();

};

export const uniqueKeyCheck = (key="", projectkeys=[]) => {
  let isExist = projectkeys.find((el) => el.key == key);
  if (!isExist) return { isValid: true, key };
  return { isValid: false, projectname: isExist.project_id.name };
};

const getUniqueKey = (key = "", projectkeys, count = 2,projectname,loop=0) => {
  let isUniqueKey = uniqueKeyCheck(key, projectkeys);
  if (isUniqueKey.isValid && isUniqueKey.key.length > 1) {
    return key;
  } else if (isUniqueKey.isValid &&(isUniqueKey.key.length == 1 || isUniqueKey.key.length == 0)) {
   
    let randstring=2
    if(loop>40)randstring=4
    let randomstring = getRandomString(randstring);
    let uniqueStr = key + randomstring;
    return getUniqueKey(uniqueStr, projectkeys, count,projectname,++loop);
  } else {
     let genkey;   
 if(count>4){
     genkey= key.slice(0, 2)+getRandomString(2)    
    }
 else{   
 genkey=getKey(projectname,++count)
if(genkey.length==key.length){
  let randomcount=1;
   if(key.length>=3){
  genkey = key.slice(0,3)+ getRandomString(randomcount);
   }else{
       let slicecount=3
 if(loop>20){randomcount=2;slicecount=2}      
genkey=key.slice(0,slicecount)+getRandomString(randomcount)       
   } 
}

 }
 return getUniqueKey(genkey,projectkeys,count,projectname,++loop)
};
}

const getRandomString = (length) => {
  var randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
};

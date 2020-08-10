export const capitaliseFirstLetter = (word)=>{
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export const deleteObjectFromArray = (objectId, originalArray)=>{
    return new Promise((resolve, reject)=>{
        let updatedArray = originalArray.filter(object=> object._id!==objectId);
        resolve(updatedArray);})
}

export const editObjectInArray = (originalArray, newObjectValues)=>{
    return new Promise((resolve, reject)=>{
       let arrCopy = [...originalArray];
            arrCopy.forEach((object, index)=>{
                if(newObjectValues._id === object._id){
                    arrCopy[index] = newObjectValues;
                }
            })
            resolve(arrCopy);
        })}
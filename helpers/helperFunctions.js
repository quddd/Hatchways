/*
  Function to compare object array
  input: sortBy -  key to sort by
         direction - order of resulting array
*/
function compareValues(sortBy,direction='asc'){
  return function innerSort(a,b){

    let comparison = 0;
    if(a[sortBy] > b[sortBy])
      comparison = 1;
    else if(a[sortBy] < b[sortBy])
      comparison = -1;
    return (
      (direction ==='desc') ? (comparison * -1) : comparison
    );
  };
}
/*
  Function to merge object array and de-duplicate
  input: arr, arr2 - arrays to merge
  output: merged array
*/
const mergeArr = (arr, arr2) => {
  let uniqueArr = arr.concat(arr2.filter(item =>
    !JSON.stringify(arr).includes(JSON.stringify(item))
  ));
  return uniqueArr;
}

module.exports = {compareValues, mergeArr};

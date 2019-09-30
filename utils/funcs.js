const toCollect = (data, demension = 2) => {
  let returnObj = JSON.parse(JSON.stringify(data));
  const numberCollections = Math.ceil(returnObj.length / demension);
  const resultArray = [];

  for (let i = 0; i < numberCollections; i++) {
    const group = returnObj.splice(0, demension);
    if (group.length) {
      resultArray.push(group);
    }
  }

  return resultArray;
};


export const sleep = delay => new Promise(resolve => {
  setTimeout(() => {
    // console.log('sleep');
    resolve()
  }, delay)
}, delay);

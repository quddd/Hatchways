const express = require('express');
const router = express.Router();
const axios = require('axios');

const {compareValues, mergeArr} = require('../helpers/helperFunctions');

router.get('/posts', (req, res) => {
  let { tags, sortBy, direction } = req.query;

  const sortEnum = {
    ID: 'id', //defualt
    READS: 'reads',
    LIKES: 'likes',
    POULARITY: 'popularity'
  }
  const directionEnum = {
    ASC: 'asc', //default
    DESC: 'desc'
  }
  /* check if sortBy and direction is not included.
      If it isn't included set to deafult values
  */
  if(!sortBy)
    sortBy = sortEnum.ID;

  if(!direction)
    direction = directionEnum.ASC;

  if(!tags){
    res.status(400).send({
      "error": "Tags parameter is required"
    })
  }
  else if(!Object.values(sortEnum).includes(sortBy)){
    res.status(400).send({
      "error": "sortBy parameter is invalid"
    })
  }
  else if(!Object.values(directionEnum).includes(direction)){
    res.status(400).send({
      "error": "direction parameter is invalid"
    })
  }//implementation for a tag that has multiple values
  else if(tags.indexOf(",") !== -1){
    let tagsArr = tags.split(",");
    let urlPaths = tagsArr.map((tag, i) => {
      return axios.get("https://api.hatchways.io/assessment/blog/posts?tag="+tag)
    });

    axios.all([...urlPaths]).then((response) => {
      let arr = [];

      response.forEach(posts =>{
        arr = mergeArr(arr,posts.data.posts)
      })
      res.status(200).send({
        "posts": arr.sort(compareValues(sortBy,direction))
      })
    }).catch((error) => {
        res.status(400).send({
          "error": error
        });
    });
  } else {
      const result = axios.get("https://api.hatchways.io/assessment/blog/posts?tag="+tags)
      .then(data => {
        res.status(200).send({
          "posts": data.data.posts.sort(compareValues(sortBy,direction))
        });
      })
      .catch((error) => {
        res.status(400).send({
          "error": error
        });
      });
  }

})
module.exports = router;

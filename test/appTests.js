let chai = require("chai");
let chaiHttp = require('chai-http');
let server = require('../app');


const {compareValues, mergeArr} = require('../helpers/helperFunctions');

//assertion style
chai.should();
chai.use(chaiHttp);

describe('HatchWays Backend Assesment', () => {
  /*
  Test ping
  */
  describe("Ping Routes", () => {
    it("Test should return correct body and status code for a valid ping route", (done) => {
      chai.request(server)
        .get("/api/ping")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.success.should.equal(true);
        done();
        })
    })
    it("Test should return correct status code for invalid ping route", (done) => {
      chai.request(server)
        .get("/api/pings")
        .end((err, response) => {
          response.should.have.status(404);
        done();
          })
    })
  })
  /**
  Test Posts
  */
  describe("Posts Routes", () => {
    it("Test should return correct status code and body for a post route with a valid tags parameter", (done) => {
      chai.request(server)
        .get("/api/posts?tags=tech")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
        done();
        })
    })
    it("Test should return correct status code and body for a post route with no valid tags parameter", (done) => {
      chai.request(server)
        .get("/api/posts?tags=")
        .end((err, response) => {
          response.should.have.status(400);
          response.body.error.should.equal('Tags parameter is required');
        done();
        })
    })
    it("Test should return correct status code and body for a post route with no valid sortBy parameter", (done) => {
      chai.request(server)
        .get("/api/posts?tags=tech&sortBy=name")
        .end((err, response) => {
          response.should.have.status(400);
          response.body.error.should.equal('sortBy parameter is invalid');
        done();
        })
    })
    it("Test should return correct status code and body for a post route with no valid direction parameter", (done) => {
      chai.request(server)
        .get("/api/posts?tags=tech&direction=ascending")
        .end((err, response) => {
          response.should.have.status(400);
          response.body.error.should.equal('direction parameter is invalid');
        done();
        })
    })
    it("Test should make sure posts array is de-duplicated", (done) => {
      chai.request(server)
        .get("/api/posts?tags=tech,history")
        .end((err, response) => {
          let pass = true;
          let posts = response.body.posts;
          let ids = [];

          for(var i=0; i < posts.length; i++){
            ids.push(posts[i].id);
          }
          let data = {}
          ids.forEach(post => {
            data[post] = data[post] ? data[post] + 1 : 1
          })
          for(var key in data){
            if(data[key] > 1)
              pass = false;
          }
          pass.should.equal(true);
        done();
        })
    })
    it("Test should make sure posts are sorted and in DESCENDING ORDER", (done) => {
      chai.request(server)
        .get("/api/posts?tags=tech,history&sortBy=reads&direction=desc")
        .end((err, response) => {
          let test = false;
          let posts = response.body.posts;
          posts.sort(compareValues("reads","desc"));
          if(posts.toString() == response.body.posts.toString()){
            test = true;
          }
          test.should.equal(true);
        done();
        })
    })
    it("Test should make sure posts are sorted and in ASCENDING ORDER", (done) => {
      chai.request(server)
        .get("/api/posts?tags=tech,history&sortBy=reads&direction=asc")
        .end((err, response) => {
          let test = false;
          let posts = response.body.posts;
          posts.sort(compareValues("reads","asc"));
          if(posts.toString() == response.body.posts.toString()){
            test = true;
          }
          test.should.equal(true);
        done();
        })
    })
  })
});

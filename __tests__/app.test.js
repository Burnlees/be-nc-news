const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("should should respond with a status code of 200 when successful", () => {
    return request(app).get("/api/topics").expect(200);
  });
  it("should respond with a status code of 200 when successful, and an array of topic objects - each with the properties - slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  it('should respond with a 404: Not Found when passed an endpoint that is incorrect or does not exist', () => {
    return request(app)
      .get("/api/topocs")
      .expect(404).then(({body}) => {
        expect(body.msg).toBe('Not Found')
      })
  });
});

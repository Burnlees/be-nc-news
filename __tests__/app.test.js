const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpointsDocs = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Wrong path error handling", () => {
  it("should respond with a 404: Not Found when passed an endpoint that is incorrect or does not exist", () => {
    return request(app)
      .get("/api/topocs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/topics", () => {
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
});

describe("GET /api", () => {
  it("should respond with a status code of 200 when successful and an object containing information about the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpointsDocs);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("should respond with a 200 status code, and an object of article data corrosponding to the selected article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  it("should per feature request now respond with an object that also includes a comment count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });
  it("should per feature request now respond with an object that also includes a comment count property of 0, when a article has no comments", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(2);
        expect(body.article.comment_count).toBe(0)
      });
  });
  it("should respond with a 404: Not Found when passed an article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found, article id does not exist");
      });
  });
  it("should respond with a 400: Bad Request when passed NaN as an article id", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Input");
      });
  });
});

describe("GET /api/articles", () => {
  it("should when successful respond with a 200 status code and an array of all article objects without the body property present and and a comment_count column", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  it("should when successful respond with an array of articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("should respond with the articles filtered by topic when passed with the valid query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  it("should respond with an empty array if passed a topic query with no articles related to it", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(0);
      });
  });
  it("should respond with 404: Not Found if passed with a topic that does not exist", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("should when successful respond with a 200 status code and an array of comments for the given article_id of which each comment should have the following properties: comment_id, votes, created_at, author, body, article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  it("should respond with an empty array of comments, when passed the article id for an article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(0);
      });
  });
  it("should responding with an array of comments, with the most recent comment first", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("should respond with 404: Not Found when passed an article id that does not exist", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("should respond with 400: Bad Request when passed NaN as an article id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Input");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("should when successful respond with a 201 status code, it should create a new comment on corresponding article per the passed article id and respond with the newly created comment", () => {
    const input = { username: "butter_bridge", body: "I agree!" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "I agree!",
          article_id: 1,
        });
      });
  });
  it("should when respond with a 404: Not Found when passed an article id that does not exist", () => {
    const input = { username: "butter_bridge", body: "I agree!" };
    return request(app)
      .post("/api/articles/99999/comments")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("should when respond with a 404: Not Found when passed an user that does not exist", () => {
    const input = { username: "bob", body: "I disagree!" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found: user doesn't exist");
      });
  });
  it("should respond with a 400: Bad Request when passed NaN as article id", () => {
    const input = { username: "butter_bridge", body: "I agree!" };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Input");
      });
  });
  it("should respond with 400: Bad Request when post request body is missing a required field", () => {
    const input = { body: "I agree!" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Missing Required Field");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("should when successful respond with a status code of 200 and the updated article, where the votes data is incremented", () => {
    const input = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("should when successful respond with a status code of 200 and the updated article, where the votes data is decremented", () => {
    const input = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("should respond with 404: Not Found when passed an article id that does not exist", () => {
    const input = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/9999")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("should respond with 400: Bad Request when passed NaN as article id", () => {
    const input = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/banana")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Input");
      });
  });
  it("should respond with 400: Bad Request when passed an invalid value type as patch request", () => {
    const input = { inc_votes: "banana" };
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Input");
      });
  });
  it("should respond with 400: Request when patch request is missing required field", () => {
    const input = {};
    return request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Missing Required Field");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("should when successful remove the selected comment and respond with a 204 status code with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db
          .query(`SELECT * FROM comments WHERE comment_id = 1`)
          .then((res) => {
            expect(res.rows).toHaveLength(0);
          });
      });
  });
  it("should respond with 404: Not Found when passed a comment id that does not exist", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("should respond with 400: Bad Request when passed NaN as comment id", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Input");
      });
  });
});

describe("GET api/users", () => {
  it("should when successful respond with a 200 status code and an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

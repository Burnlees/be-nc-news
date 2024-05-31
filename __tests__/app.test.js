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
        expect(body.article.comment_count).toBe(0);
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
  it("should when passed with no sort_by query, provide a response sorted by the default of created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("should when passed with no sort_by query and an order query of asc, provide a response sorted by the default of created_at in ascending order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  it("should when passed with a valid sort_by query and no order query, provide a response sorted by given query in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("article_id", { descending: true });
      });
  });
  it("should when passed with a different valid sort_by query and an order query of asc, provide a response sorted by given query in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("comment_count", {
          ascending: true,
        });
      });
  });
  it("should respond with 400: Bad Request when passed an invalid sort query", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  it("should respond with 400: Bad Request when passed an invalid order query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=up")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
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

describe("POST /api/articles", () => {
  it("should when successful respond with a 201 status code and the newly added article object, the article_img_url should default when not provided", () => {
    const input = {
      author: "butter_bridge",
      title: "How to cook an egg",
      body: "Fry it!",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: expect.any(Number),
          author: "butter_bridge",
          title: "How to cook an egg",
          body: "Fry it!",
          topic: "mitch",
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
          article_img_url: expect.any(String),
        });
      });
  });
  it("should when successful respond with the newly added article object, including the passed avatar_img_url when one is present in the post request", () => {
    const input = {
      author: "butter_bridge",
      title: "How to cook an egg",
      body: "Fry it!",
      topic: "mitch",
      article_img_url:
        "https://cookieandkate.com/images/2018/09/crispy-fried-egg-recipe.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: expect.any(Number),
          author: "butter_bridge",
          title: "How to cook an egg",
          body: "Fry it!",
          topic: "mitch",
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
          article_img_url:
            "https://cookieandkate.com/images/2018/09/crispy-fried-egg-recipe.jpg",
        });
      });
  });
  it("should respond with 400: Bad Request when passed a request body missing required fields", () => {
    const input = {
      title: "How to cook an egg",
      body: "Fry it!",
      topic: "mitch",
      article_img_url:
        "https://cookieandkate.com/images/2018/09/crispy-fried-egg-recipe.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Missing Required Field");
      });
  });
  it("should when passed a request body that contains username that does not exist, respond with 404: Not Found", () => {
    const input = {
      author: "bob",
      title: "How to cook an egg",
      body: "Fry it!",
      topic: "mitch",
      article_img_url:
        "https://cookieandkate.com/images/2018/09/crispy-fried-egg-recipe.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found: user doesn't exist");
      });
  });
  it("should when passed a request body the contains addtional properties other than the required, add data from the required fields", () => {
    const input = {
      author: "butter_bridge",
      title: "How to cook an egg",
      body: "Fry it!",
      topic: "mitch",
      article_img_url:
        "https://cookieandkate.com/images/2018/09/crispy-fried-egg-recipe.jpg",
      votes: 100,
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: expect.any(Number),
          author: "butter_bridge",
          title: "How to cook an egg",
          body: "Fry it!",
          topic: "mitch",
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
          article_img_url:
            "https://cookieandkate.com/images/2018/09/crispy-fried-egg-recipe.jpg",
        });
      });
  });
  it('should when passed a request body that contains a topic the does not exist, respond with a 404: Not Found', () => {
    const input = {
      author: "butter_bridge",
      title: "How to cook an egg",
      body: "Fry it!",
      topic: "frying",
      article_img_url:
        "https://cookieandkate.com/images/2018/09/crispy-fried-egg-recipe.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found')
      });
  });
  it('should respond with 400: Bad Request if passed an article_img_url that is either invalid or not of type .jpg or .png', () => {
    const input = {
      author: "butter_bridge",
      title: "How to cook an egg",
      body: "Fry it!",
      topic: "frying",
      article_img_url:
        "cookieandkate.com/images/2018/09/crispy-fried-egg-recipe",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request: Invalid Image Type')
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
  it("should when passed additional properties on  the patch request body, only update the required ones", () => {
    const input = {
      inc_votes: -100,
      topic: "paper",
      created_at: "2020-08-09T21:11:00.000Z",
    };
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

describe("GET /api/users/:username", () => {
  it("should when successful respond with a 200 status code and a user object corresponding to the passed username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  it("should respond with 404: Not Found when passed a username that does not exist", () => {
    return request(app)
      .get("/api/users/bob")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  it("should when successful respond with a 200 and the updated comment object when vote is incremented", () => {
    const input = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  it("should when successful respond with a 200 and the updated comment object when vote is decremented", () => {
    const input = { inc_votes: -3 };
    return request(app)
      .patch("/api/comments/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 13,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  it("should respond with a 404: Not Found when passed the id for a comment that doesnt exist", () => {
    const input = { inc_votes: -3 };
    return request(app)
      .patch("/api/comments/999999")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("should respond with 400: Bad Request when passed NaN as comment id", () => {
    const input = { inc_votes: -3 };
    return request(app)
      .patch("/api/comments/banana")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Input");
      });
  });
  it("should respond with 400: Bad Request when passed a patch request missing the required fields", () => {
    const input = {};
    return request(app)
      .patch("/api/comments/1")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Missing Required Field");
      });
  });
  it("should when passed with a patch request containing extra properties, only update the required fields", () => {
    const input = { inc_votes: -3, author: "bob" };
    return request(app)
      .patch("/api/comments/1")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 13,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
});

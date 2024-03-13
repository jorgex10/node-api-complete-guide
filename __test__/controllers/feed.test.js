const mongoose = require("mongoose");

const Post = require("../../models/post");
const User = require("../../models/user");
const FeedController = require("../../controllers/feed");

describe("Feed Controller", () => {
  beforeAll((done) => {
    mongoose
      .connect(
        "mongodb+srv://jorgex10:nuttertools@cluster0.7wosptt.mongodb.net/messages-test?retryWrites=true&w=majority"
      )
      .then(() => {
        const user = new User({
          email: "tester@test.com",
          password: "tester",
          name: "Tester",
          _id: "65f229f65a6572f368074082",
          posts: [],
        });

        return user.save();
      })
      .then(() => {
        done();
      });
  });

  test("should add a created post to the posts of the creator", (done) => {
    const req = {
      body: {
        title: "New Post",
        content: "Some interest content",
      },
      file: {
        path: "url",
      },
      userId: "65f229f65a6572f368074082",
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).toHaveProperty("posts");
      expect(savedUser.posts).toHaveLength(1);
      done();
    });
  });

  afterAll((done) => {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});

const mongoose = require("mongoose");

const User = require("../../models/user");
const AuthController = require("../../controllers/auth");

describe("Auth Controller", () => {
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

  describe("POST login", () => {
    test("should throw an error id accessing the database fails", (done) => {
      const req = {
        body: {
          email: "test@test.com",
          password: "tester",
        },
      };

      AuthController.login(req, {}, () => {}).then((result) => {
        expect(result).toThrowError;
        expect(result).toHaveProperty("statusCode", 404);
        done();
      });
    });
  });

  describe("GET userStatus", () => {
    test("should send a response with a valid user status for an existing user", (done) => {
      const req = { userId: "65f229f65a6572f368074082" };
      const res = {
        statusCode: 500,
        userStatus: null,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.userStatus = data.status;
        },
      };

      AuthController.getUserStatus(req, res, () => {}).then(() => {
        expect(res.statusCode).toBe(200);
        expect(res.userStatus).toBe("I am new!");
        done();
      });
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

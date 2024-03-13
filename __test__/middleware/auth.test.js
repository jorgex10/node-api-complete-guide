const jwt = require("jsonwebtoken");

const authMiddleware = require("../../middleware/auth");

jest.mock("jsonwebtoken");

describe("Auth middleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get: function () {
        return null;
      },
    };

    authMiddleware(req, {}, () => {});

    expect(req).toHaveProperty("isAuth", false);
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: function () {
        return "foo";
      },
    };

    authMiddleware(req, {}, () => {});

    expect(req).toHaveProperty("isAuth", false);
  });

  it("should yield isAuth and userId if the authorization header is correct", () => {
    const req = {
      get: function () {
        return "Bearer foo";
      },
    };

    const verify = jest.spyOn(jwt, "verify");
    verify.mockImplementation(() => ({ userId: "abc" }));

    authMiddleware(req, {}, () => {});

    expect(jwt.verify.mock.calls).toHaveLength(2);
    expect(req).toHaveProperty("userId", "abc");
    expect(req).toHaveProperty("isAuth", true);
  });
});

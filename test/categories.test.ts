const mockingoose = require("mockingoose");
import request, { Request, Response } from "supertest";
import app from "../index";

import { Category } from "../src/models/category";

describe("test mongoose Categories model", () => {
  it("should return newly created doc", () => {
    mockingoose(Category).toReturn(
      { name: "Fruits", color: "#E2E1F0", icon: "fruits", _id: "123" },
      "save"
    );
    return request(app)
      .post("/api/v/categories")
      .send({
        name: "Fruits",
        color: "#E2E1F0",
        icon: "fruits",
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            success: true,
            data: expect.objectContaining({
              name: "Fruits",
              color: "#E2E1F0",
              icon: "fruits",
            }),
          })
        );
      });
  });
});

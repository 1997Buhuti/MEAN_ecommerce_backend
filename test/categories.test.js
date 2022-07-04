const mockingoose = require("mockingoose");
const request = require("supertest");
const app = require("../index");

const { Category } = require("../models/category");

describe("test mongoose Categories model", () => {
  //testing getting a category by Id
  // it.only("should return the doc with findById", () => {
  //   const _doc = {
  //     _id: "5f15d5b2cb4a6642bddc0fe7",
  //     name: "House",
  //     color: "#E2E1F0",
  //     icon: "home",
  //   };
  //   console.log();
  //   mockingoose(Category).toReturn(_doc, "findOne");

  //   return Category.findById({ _id: "5f15d5b2cb4a6642bddc0fe7" }).then(
  //     (doc) => {
  //       expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
  //     }
  //   );
  // });

  it.only("should return newly created doc", () => {
    return request(app)
      .post("/category")
      .send({
        name: "Fruits",
        color: "#E2E1F0",
        icon: "fruits",
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            name: "Fruits",
            color: "#E2E1F0",
            icon: "fruits",
          })
        );
      });
  });

  // //testing updating a category by Id
  // it("should return the doc with update", () => {
  //   const _doc = {
  //     _id: "5f15d5b2cb4a6642bddc0fe7",
  //     name: "Roka Fan",
  //     color: "#E2E1F0",
  //     icon: "home",
  //   };

  //   mockingoose(Category).toReturn(doc, "update");

  //   return Category.updateOne({ name: "Roka Fan" }) // this won't really change anything
  //     .where({ _id: "507f191e810c19729de860ea" })
  //     .then((doc) => {
  //       expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
  //     });
  // });
});

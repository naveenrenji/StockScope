//require express, express router and bcrypt as shown in lecture code
const express = require("express");
const router = express.Router();
const helpers = require("../helpers");
const data = require("../data");
const recipes = data.recipes;
const { ObjectId } = require("mongodb");

router.route("/recipes").get(async (req, res) => {
  //code here for GET

  try {

    let queryObject = req.query;

    //Object is Empty or  it does not have "page" key or page query does not have any value then display first 50 records with 200 status code
    if (queryObject.length === 0 || !queryObject.page || queryObject.page === '' || parseInt(queryObject.page) === 1) {

      let results = await recipes.getRecipe(1);
      return res.status(200).json(results);
    }

    let pageNumber = queryObject.page;

    //console.log(`Original pageNumber ${pageNumber} and its length is `)

    let cleanPageNumber = ~~pageNumber;
    //console.log(`Updated Pagenumber ${cleanPageNumber}`);
    if (cleanPageNumber === 'NaN' || cleanPageNumber === 0 || cleanPageNumber <= 0) throw {
      code: 400,
      message: "Please pass only positive numbers in the pagenumber"
    }

    let results = await recipes.getRecipe(cleanPageNumber);
    return res.status(200).json(results);
  }

  catch (e) {
    return res.status(e.code).json({
      error: e.message
    })
  }

})
  .post(async (req, res) => {

    try {

      let title = req.body.title;
      let ingredients = req.body.ingredients;
      let steps = req.body.steps;
      let cookingSkillRequired = req.body.cookingSkillRequired;
      let username = req.session.user;
      let userId = req.session.userId;

      title = helpers.checkTitle(title);
      ingredients = helpers.checkIngredients(ingredients);
      steps = helpers.checkSteps(steps);
      cookingSkillRequired = helpers.checkCookingSkillRequired(cookingSkillRequired);
      username = helpers.checkUser(username);

      if (!userId) throw {
        code: 400,
        message: `Please pass User Id`,
      };

      //Checking if the id is valid string or not
      if (typeof userId !== "string") throw {
        code: 400,
        message: `Recipe Id should be String`,
      }

      userId = userId.trim();

      //Validating the id
      if (userId.length === 0)
        throw {
          code: 400,
          message: `userId Id should not contain only leading and trailing spaces`,
        };

      //Checking if the id is valid
      if (!ObjectId.isValid(userId))
        throw { code: 400, message: `Invalid object ID` };


      const data = await recipes.addRecipe(title, ingredients, steps, cookingSkillRequired, username, userId);
      return res.status(200).json(data);
    }

    catch (e) {

      return res.status(e.code).json({ error: e.message });
    }

  });

router.route("/recipes/:id").get(async (req, res) => {
  //code here for GET

  try {

    let id = req.params.id;

    if (!id) throw {
      code: 400,
      message: `Please pass Recipe Id`,
    };

    //Checking if the id is valid string or not
    if (typeof id !== "string") throw {
      code: 400,
      message: `Recipe Id should be String`,
    }

    id = id.trim();

    //Validating the id
    if (id.length === 0)
      throw {
        code: 400,
        message: `Id should not contain only leading and trailing spaces`,
      };

    //Checking if the id is valid
    if (!ObjectId.isValid(id))
      throw { code: 400, message: `Invalid object ID` };

    const recipeById = await recipes.getRecipeById(id);

    return res.status(200).json(recipeById);
  }
  catch (e) {

    return res.status(e.code).json({
      error: e.message
    })
  }
})
  .patch(async (req, res) => {

    try {

      let id = req.params.id;

      if (!id) throw {
        code: 400,
        message: `Please pass Recipe Id`,
      };

      //Checking if the id is valid string or not
      if (typeof id !== "string") throw {
        code: 400,
        message: `Recipe Id should be String`,
      }

      id = id.trim();

      //Validating the id
      if (id.length === 0)
        throw {
          code: 400,
          message: `Id should not contain only leading and trailing spaces`,
        };

      //Checking if the id is valid
      if (!ObjectId.isValid(id))
        throw { code: 400, message: `Invalid object ID` };

      const recipeById = await recipes.getRecipeById(id);

      let userThatCreated = recipeById.userThatPosted._id.toString();

      let userId = req.session.userId;

      if (userThatCreated !== userId) throw {
        code: 401,
        message: "User is not authorised to update the Recipe"
      }

      //Update recipe code
      if (req.body.length === 0) throw {
        code: 400,
        message: "Please pass atleast one parameter to update in the body"
      }

      let obj = {};
      if (req.body.title) {

        obj.title = req.body.title;
        obj.title = helpers.checkTitle(obj.title);
      }

      if (req.body.ingredients) {

        obj.ingredients = req.body.ingredients;
        obj.ingredients = helpers.checkIngredients(obj.ingredients);
      }

      if (req.body.cookingSkillRequired) {

        obj.cookingSkillRequired = req.body.cookingSkillRequired;
        obj.cookingSkillRequired = helpers.checkCookingSkillRequired(obj.cookingSkillRequired);
      }

      if (req.body.steps) {

        obj.steps = req.body.steps;
        obj.steps = helpers.checkSteps(obj.steps);
      }

      if (obj.length === 0) throw {
        code: 400,
        message: "Please pass atleast one parameter to update"
      }

      const updatedData = await recipes.updateRecipe(id, obj);
      return res.status(200).json(updatedData);
    }

    catch (e) {

      res.status(e.code).json({
        error: e.message
      })
    }
  });

router.route("/recipes/:id/comments").post(async (req, res) => {
  //code here for POST
  try {

    id = req.params.id;

    if (!id) throw {
      code: 400,
      message: `Please pass Recipe Id`,
    };

    //Checking if the id is valid string or not
    if (typeof id !== "string") throw {
      code: 400,
      message: `Recipe Id should be String`,
    }

    id = id.trim();

    //Validating the id
    if (id.length === 0)
      throw {
        code: 400,
        message: `Id should not contain only leading and trailing spaces`,
      };

    //Checking if the id is valid
    if (!ObjectId.isValid(id))
      throw { code: 400, message: `Invalid object ID` };

    let comment = req.body.comment;
    comment = helpers.checkComment(comment);

    let userId = req.session.userId;
    let userName = req.session.user;

    const newComment = await recipes.addComment(id, comment, userId, userName);

    return res.status(200).json(newComment);
  }

  catch (e) {

    res.status(e.code).json({
      error: e.message
    })
  }
});

router.route("/recipes/:recipeId/:commentId").delete(async (req, res) => {
  //code here for GET

  try {
    let recipedId = req.params.recipeId;
    let commentId = req.params.commentId;


    if (!recipedId) throw {
      code: 400,
      message: `Please pass Recipe Id`,
    };

    //Checking if the id is valid string or not
    if (typeof recipedId !== "string") throw {
      code: 400,
      message: `Recipe Id should be String`,
    }

    recipedId = recipedId.trim();

    //Validating the id
    if (recipedId.length === 0)
      throw {
        code: 400,
        message: `Id should not contain only leading and trailing spaces`,
      };

    //Checking if the id is valid
    if (!ObjectId.isValid(recipedId))
      throw { code: 400, message: `Invalid object ID` };

    if (!commentId) throw {
      code: 400,
      message: `Please pass Comment Id`,
    };

    //Checking if the id is valid string or not
    if (typeof commentId !== "string") throw {
      code: 400,
      message: `Comment Id should be String`,
    }

    commentId = commentId.trim();

    //Validating the id
    if (commentId.length === 0)
      throw {
        code: 400,
        message: `Id should not contain only leading and trailing spaces`,
      };

    //Checking if the id is valid
    if (!ObjectId.isValid(commentId))
      throw { code: 400, message: `Invalid object ID` };

    let userId = req.session.userId;

    const data = await recipes.deleteComment(recipedId, commentId, userId);
    return res.status(200).json(data);
  }

  catch (e) {
    res.status(e.code).json({
      error: e.message
    })
  }
});

router.route("/recipes/:id/likes").post(async (req, res) => {
  //code here for GET
  return res.status(200).json({
    message: "/recipes/:id/likes POST route is hit"
  });

});

router.route("/signup").post(async (req, res) => {
  //code here for GET

  try {

    if (req.session.user) throw {
      code: 401,
      message: "User is already logged in"
    }

    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    name = helpers.checkName(name);
    username = helpers.checkUser(username);
    password = helpers.checkPassword(password);

    const temp = await recipes.createUser(name, username, password);

    return res.status(200).json(temp);
  }

  catch (e) {

    return res.status(e.code).json({
      error: e.message
    })
  }
});

router.route("/login").post(async (req, res) => {
  //code here for POST

  try {

    if (req.session.user) throw {
      code: 401,
      message: "User is already logged in"
    }

    let username = req.body.username;
    let password = req.body.password;

    username = helpers.checkUserLogin(username);
    password = helpers.checkPasswordLogin(password);

    const temp = await recipes.checkUser(username, password);
    req.session.user = temp.username;
    req.session.userId = temp._id;

    return res.status(200).json(temp);
  }

  catch (e) {
    return res.status(e.code).json({
      error: e.message
    })
  }
});

router.route("/logout").get(async (req, res) => {
  //code here for GET
  try {

    let data = req.session.user;

    if (!data) throw {
      code: 401,
      message: "User must be logged in to logged out successfully"
    }

    req.session.destroy();
    return res.status(200).json({
      message: "User logged out successfully"
    });

  }
  catch (e) {

    return res.status(e.code).json({
      error: e.message
    })
  }
});

module.exports = router;

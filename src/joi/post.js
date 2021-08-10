const Joi = require("joi");

const PostSchema = require("../schema/Post");
const UserSchema = require("../schema/User");

const PostAPI = {
  CreatePost: Joi.object({
    type: Joi.any().valid("news", "news_image").required(),

    title_catagory: Joi.any().valid("報名", "賽程", "消息").required(),

    title_content: Joi.string(),
    content: Joi.string().uri(),
  }),

  PostUpdate: Joi.object({
    post_id: Joi.string().required(),
    type: Joi.any().valid("news", "news_image"),

    title_catagory: Joi.any().valid("報名", "賽程", "消息"),

    title_content: Joi.string(),
    content: Joi.string().uri(),
  }),

  PostActive: Joi.string()
    .required()
    .custom(async (value, helper) => {
      if (!(await PostAPI.isValidUserID(value)))
        return helper.message("Invalid User ID");
      return true;
    }),
  GetPost: Joi.object({
    post_id: Joi.string(),
    type: Joi.any().valid("news", "news_image"),
    title_catagory: Joi.any().valid("報名", "賽程", "消息"),
  }),
};

const PostValider = {
  isUniqueTitle: async (title) => {
    const exist = await PostSchema.findOne({ title_content: title });
    return exist === undefined || exist === null;
  },
  isValidUserID: async (id) => {
    try {
      const exist = await UserSchema.findById(id);
      return exist !== undefined && exist !== null;
    } catch {
      return false;
    }
  },
  isValidPostID: async (id) => {
    try {
      const exist = await PostSchema.findById(id);
      return exist !== undefined && exist !== null;
    } catch {
      return false;
    }
  },
};

module.exports.PostAPI = PostAPI;
module.exports.PostValider = PostValider;

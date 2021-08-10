const exception = require("../modules/exception");
const { PostAPI, PostValider } = require("../joi/post");
const Logger = require("../modules/logger");
const PostSchema = require("../schema/Post");
const config = require("../config");

class Post {
  constructor(token) {
    this.token = token;
  }
}

Post.prototype.Create = async function (PostObj) {
  const TAG = "[Create Post]";
  const logger = new Logger();

  if (config.ADMIN_LEVEL[this.token.admin] < 2) {
    logger.error(
      TAG,
      `Adiminister (${this.token.adim}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }
  const validate = await PostAPI.CreatePost.validate(PostObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  const { title_content } = PostObj;
  if (!(await PostValider.isUniqueTitle(title_content))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError("BAD_REQUEST", "Title already exist");
  }

  PostObj.user_id = this.token.user_id;
  try {
    const post = new PostSchema(PostObj);
    post.save();
    return post;
  } catch (err) {
    logger.error(TAG, "Create Post Failed");
    throw exception.ServerError("SERVER_ERROR", "Create Post Failed:" + err);
  }
};

Post.prototype.Update = async function (PostObj) {
  const TAG = "[Update Post]";
  const logger = new Logger();

  if (config.ADMIN_LEVEL[this.token.admin] < 2) {
    logger.error(
      TAG,
      `Adiminister (${this.token.adim}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }
  const validate = await PostAPI.PostUpdate.validate(PostObj);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  try {
    const { post_id } = PostObj;
    delete PostObj.post_id;
    return await PostSchema.findByIdAndUpdate(post_id, PostObj, { new: true });
  } catch (err) {
    logger.error(TAG, "Update Post Failed");
    throw exception.ServerError("SERVER_ERROR", "Update Post Failed:" + err);
  }
};

Post.prototype.Delete = async function (PostID) {
  const TAG = "[Delete Post]";
  const logger = new Logger();
  if (config.ADMIN_LEVEL[this.token.admin] < 2) {
    logger.error(
      TAG,
      `Adiminister (${this.token.adim}) has no access to ${TAG}.`
    );
    throw exception.PermissionError("Permission Deny", "have no access");
  }

  if (!(await PostValider.isValidPostID(PostID))) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  try {
    await PostSchema.findByIdAndDelete(PostID);
    return "Success";
  } catch (err) {
    logger.error(TAG, "Delete Post Failed");
    throw exception.ServerError("SERVER_ERROR", "Delete Post Failed:" + err);
  }
};

Post.prototype.GetData = async function (ReqInfo) {
  const TAG = "[Delete Post]";
  const logger = new Logger();
  const validate = await PostAPI.GetPost.validate(ReqInfo);
  if (validate.error) {
    logger.error(TAG, "Invalid Parameters");
    throw exception.BadRequestError(
      "BAD_REQUEST",
      validate.error.details[0].message
    );
  }
  if (
    "post_id" in ReqInfo &&
    (await PostValider.isValidPostID(ReqInfo["post_id"]))
  )
    return await PostSchema.findById(ReqInfo["post_id"]);
  return await PostSchema.find(ReqInfo);
};
module.exports = Post;

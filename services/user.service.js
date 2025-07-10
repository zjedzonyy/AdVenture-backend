const db = require("../database/queries/index");
const bcrypt = require("bcryptjs");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/error.utils");
const supabaseAdmin = require("../database/supabase/supabase");
const { request } = require("express");

const register = async ({ username, password, email }) => {
  if (!username || !password || !email) {
    throw new BadRequestError("Missing registration fields");
  }
  // Check username and email uniqueness
  const existingUsername = await db.getUser(username);
  const existingEmail = await db.getUserByEmail(email);

  if (existingUsername) {
    throw new ConflictError("This username already exists.", "username");
  }
  if (existingEmail) {
    throw new ConflictError(
      "There is already an account associated with this email.",
      "email",
    );
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db.createUser(username, hashedPassword, email);

  return newUser;
};

const getUserProfile = async (requestingUserId, targetId) => {
  const targetUser = await db.getUserById(targetId);
  if (!targetUser) {
    throw new NotFoundError("User not found");
  }

  // If it is my own profile
  if (requestingUserId === targetId) {
    return await db.getUserPrivateData(targetId);
  }

  // If that is someone I follow
  const isFollowing = await db.isFollowing(requestingUserId, targetId);

  if (isFollowing) {
    return await db.getUserPublicData(targetId);
  } else {
    return await db.getUserBasicData(targetId);
  }
};

const getMineProfile = async (requestingUserId) => {
  return await db.getUserPrivateData(requestingUserId);
};

const uploadAvatar = async (requestingUserId, file) => {
  const fileName = `${requestingUserId}-avatar`;
  const filePath = `avatars/${requestingUserId}/${fileName}`;

  try {
    // Delete old file
    const { error: removeError } = await supabaseAdmin.storage
      .from("avatars")
      .remove([filePath]);

    // Ignore error if file doesn't exist
    if (removeError && !removeError.message.includes("not found")) {
      console.warn(`Remove warning: ${removeError.message}`);
    }

    // Upload new file
    const { data, error } = await supabaseAdmin.storage
      .from("avatars")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const publicUrl = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(filePath).data.publicUrl;

    // save in db
    const save = await db.uploadAvatar(requestingUserId, publicUrl);
    return save;
  } catch (error) {
    throw new Error(`Avatar upload failed: ${error.message}`);
  }
};

const deleteAvatar = async (requestingUserId) => {
  const fileName = `${requestingUserId}-avatar`;
  const filePath = `avatars/${requestingUserId}/${fileName}`;
  const { data, error } = await supabaseAdmin.storage
    .from("avatars")
    .remove([filePath]);

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  //delete link from db
  await db.deleteAvatar(requestingUserId);

  return;
};

module.exports = {
  register,
  getUserProfile,
  getMineProfile,
  uploadAvatar,
  deleteAvatar,
};

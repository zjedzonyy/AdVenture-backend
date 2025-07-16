const db = require("../database/queries/index");
const { BadRequestError, NotFoundError } = require("../utils/error.utils");
const prisma = require("../database/prisma");
const viewsCache = require("../utils/views.cache");
const { buildOrderByClause } = require("../utils/orderByBuilder");

const getAllIdeas = async (filters, requestingUserId) => {
  // Arguments to filter with prisma ORM
  const where = {};
  let orderBy = buildOrderByClause(filters.sort);
  const page = Math.max(1, parseInt(filters.page || 1));
  const limit = Math.min(10, Math.max(1, parseInt(filters.limit)) || 10);
  const skip = (page - 1) * limit;

  // Every statement expect query params in route
  // /ideas?*param*=value
  // wheras filters.param = value

  // Get username -> find UUID -> add filter
  if (filters.authorUsername) {
    const author = await db.getUser(filters.authorUsername);
    where.authorId = String(author.id);
  }

  if (filters.title) {
    where.title = {
      contains: String(filters.title),
      mode: "insensitive",
    };
  }

  if (filters.description) {
    where.description = {
      contains: String(filters.description),
      mode: "insensitive",
    };
  }

  // Every Date expect YYYY-MM-DD format in query params
  // E.g /ideas?created_at=2025-06-09
  if (filters.created_at) {
    const date = new Date(filters.created_at);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    where.createdAt = {
      gte: date,
      lt: nextDay,
    };
  }

  if (filters.created_after) {
    where.createdAt = {
      ...where.createdAt,
      gte: new Date(filters.created_after),
    };
  }

  if (filters.created_before) {
    where.createdAt = {
      ...where.createdAt,
      lte: new Date(filters.created_before),
    };
  }

  if (filters.updated_at) {
    const date = new Date(filters.updated_at);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    where.updatedAt = {
      gte: date,
      lt: nextDay,
    };
  }

  if (filters.updated_after) {
    where.updatedAt = {
      ...where.updatedAt,
      gte: new Date(filters.updated_after),
    };
  }

  if (filters.updated_before) {
    where.updatedAt = {
      ...where.updatedAt,
      lte: new Date(filters.updated_beofore),
    };
  }

  // Expect String "true" or "false"
  if (filters.active) {
    where.isActive = filters.active === "true";
  }

  // Every number expect to be delivered as String in query params
  // and then converted for a Number
  if (filters.view_count) {
    where.viewCount = Number(filters.view_count);
  }

  if (filters.view_count_max) {
    where.viewCount = {
      ...where.viewCount,
      lte: Number(filters.view_count_max),
    };
  }

  if (filters.view_count_min) {
    where.viewCount = {
      ...where.viewCount,
      gte: Number(filters.view_count_min),
    };
  }

  // Expect dot as a seperator
  // Eg. /ideas?avg_rating=4.34
  if (filters.avg_rating) {
    where.averageRating = Number(filters.avg_rating);
  }

  if (filters.avg_rating_max) {
    where.averageRating = {
      ...where.averageRating,
      lte: Number(filters.avg_rating_max),
    };
  }

  if (filters.avg_rating_min) {
    where.averageRating = {
      ...where.averageRating,
      gte: Number(filters.avg_rating_min),
    };
  }

  if (filters.completion) {
    where.completionCount = Number(filters.completion);
  }

  if (filters.completion_max) {
    where.completionCount = {
      ...where.completionCount,
      lte: Number(filters.completion_max),
    };
  }

  if (filters.completion_min) {
    where.completionCount = {
      ...where.completionCount,
      gte: Number(filters.completion_min),
    };
  }

  if (filters.challenge) {
    where.isChallenge = filters.challenge === "true";
  }

  // Expect duration.id to point to the associated label
  // 1	"0-15"
  // 2	"15-30"
  // 3	"30-60"
  // 4	"60-120"
  // 5	"120-480"
  // 6	"Day"
  // 7	"Weekend"
  // Based on table: duration
  if (filters.duration) {
    where.durationId = Number(filters.duration);
  }

  if (!where.OR) where.OR = [];
  // Expect string with comma seperator (e.g /ideas?categoryIds=1,2,3)
  // Expect category.id to refer to the associated label
  // 1 - "Sport" ; 2 - "Music" ; etc.
  // Based on table: category
  if (filters.categoryIds) {
    const idsArray =
      typeof filters.categoryIds === "string"
        ? filters.categoryIds.split(",").map(Number)
        : Array.isArray(filters.categoryIds)
          ? filters.categoryIds.map(Number)
          : [Number(filters.categoryIds)];

    where.OR.push(
      idsArray.map((id) => ({
        categoryLinks: {
          some: {
            categoryId: id,
          },
        },
      })),
    );
  }

  // Based on table: group_size
  // Expect string with comma seperator (e.g /ideas?categoryIds=1,2,3)
  if (filters.groupIds) {
    const idsArray =
      typeof filters.groupIds === "string"
        ? filters.groupIds.split(",").map(Number)
        : Array.isArray(filters.groupIds)
          ? filters.groupIds.map(Number)
          : [Number(filters.groupIds)];

    where.OR.push(
      idsArray.map((id) => ({
        groupSizeLinks: {
          some: {
            groupSizeId: Number(id),
          },
        },
      })),
    );
  }

  // Based on table: price_range
  if (filters.price) {
    where.priceRangeId = Number(filters.price);
  }

  //Expect:
  // INDOOR
  // OUTDOOR
  // HYBRID
  // FLEXIBLE
  if (filters.location_type) {
    where.locationType = String(filters.location_type);
  }

  //   Expect ideas?comments=true
  if (filters.comments === "true") {
    where.comments = {
      some: {
        authorId: requestingUserId,
      },
    };
  }

  if (filters.reviews === "true") {
    where.reviews = {
      some: {
        authorId: requestingUserId,
      },
    };
  }
  // Expect:
  // TODO
  // IN_PROGRESS
  // COMPLETED
  // FAVORITED
  if (filters.status) {
    where.status = {
      some: {
        userId: requestingUserId,
        ideaStatus: filters.status,
      },
    };
  }

  // Use /ideas?limit=0 to fetch all records at once
  if (filters.limit === "0") {
    const [ideas, totalCount] = await db.getAllIdeas(where, orderBy);
    return {
      ideas,
      totalCount,
    };
  }

  const [ideas, totalCount] = await db.getAllIdeas(where, orderBy, skip, limit);

  const totalPages = Math.ceil(totalCount / limit);
  return {
    ideas,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

// Get idea and then increment viewCount
const getIdea = async (ideaId, requestingUserId) => {
  const idea = await db.getIdea(ideaId, requestingUserId);
  if (!idea) {
    throw new NotFoundError("Couldn't find requested idea");
  }

  const userKey = `${requestingUserId}:${ideaId}`;

  if (viewsCache.shouldTrackView(userKey)) {
    await db.incrementIdeaViewCount(ideaId);
  }

  return idea;
};

const getRandomIdea = async () => {
  const ideas = await prisma.idea.findMany({ select: { id: true } });
  if (ideas.length === 0) {
    throw new Error("No ideas available.");
  }

  const randomId = ideas[Math.floor(Math.random() * ideas.length)].id;

  const randomIdea = await db.getIdea(randomId);
  if (!randomIdea) {
    throw new NotFoundError(`Idea with ID ${randomId} not found`);
  }

  return randomIdea;
};

const createIdea = async (
  title,
  description,
  detailedDescription,
  isActive,
  isChallenge,
  durationId,
  categories,
  groups,
  priceRangeId,
  locationType,
  authorId,
) => {
  const ideaId = await db.createIdea(
    title,
    description,
    detailedDescription,
    isActive,
    isChallenge,
    durationId,
    categories,
    groups,
    priceRangeId,
    locationType,
    authorId,
  );

  return ideaId;
};

const isAuthor = async (ideaId, userId) => {
  const idea = await db.getIdea(ideaId);

  return idea.author.id === userId;
};

const changeStatus = async (ideaId, requestingUserId, ideaStatus) => {
  const updatedStatus = await db.changeStatus(
    ideaId,
    requestingUserId,
    ideaStatus,
  );
  return updatedStatus;
};

const createReview = async (requestingUserId, rating, ideaId) => {
  const idea = await db.getIdea(ideaId);
  if (!idea) {
    throw new BadRequestError("Idea not found");
  }

  const rate = await db.createReview(requestingUserId, rating, ideaId);

  return rate;
};

module.exports = {
  getAllIdeas,
  buildOrderByClause,
  getIdea,
  getRandomIdea,
  createIdea,
  isAuthor,
  changeStatus,
  createReview,
};

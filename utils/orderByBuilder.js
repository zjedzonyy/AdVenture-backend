// Returns prisma orderBy based on query param sort=newest / oldest / popular...
// Returns { createdAt: "desc" } if couldn't find any match
const buildOrderByClause = (sortBy) => {
  const validSorts = {
    newest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    popular: { viewCount: "desc" },
    least_popular: { viewCount: "asc" },
    rating: { averageRating: "desc" },
    least_rating: { averageRating: "asc" },
    completed: { completionCount: "desc" },
    least_completed: { completionCount: "asc" },
  };

  return validSorts[sortBy] || validSorts.newest;
};

module.exports = {
  buildOrderByClause,
};

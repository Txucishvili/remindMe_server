export const authenticated = next => (root, args, context, info) => {
  if (!context.user) {
    throw new Error(`Unauthenticated!`);
  }

  return next(root, args, context, info);
};

export const validateRole = role => next => (root, args, context, info) => {
  if (context.user.role !== role) {
    throw new Error(`Unauthorized!`);
  }

  return next(root, args, context, info);
};

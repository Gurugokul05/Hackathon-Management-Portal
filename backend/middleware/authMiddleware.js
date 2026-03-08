const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const buildError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

exports.protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }
      return next();
    } catch (error) {
      return next(buildError("Not authorized, token failed", 401));
    }
  }

  if (!token) {
    return next(buildError("Not authorized, no token", 401));
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return next(buildError("Admin access only", 403));
};

// Allow if full admin OR admin/staff with specific permission
exports.adminOrPermission = (perm) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(buildError("Unauthorized", 401));
      }

      // Load admin user to check role and permissions
      const admin = await Admin.findById(req.user.id).lean();
      if (!admin) {
        return next(buildError("Forbidden", 403));
      }

      // Full admin has all permissions
      if (admin.role === "admin") {
        req.authz = { isAdmin: true, permissions: ["*"] };
        return next();
      }

      // Staff must have specific permission
      const has =
        Array.isArray(admin.permissions) && admin.permissions.includes(perm);
      if (!has) {
        return next(buildError("Insufficient permissions", 403));
      }

      req.authz = { isAdmin: false, permissions: admin.permissions };
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

// Allow if full admin OR admin/staff with ANY of the specified permissions
exports.adminOrAnyPermission = (...perms) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(buildError("Unauthorized", 401));
      }

      // Load admin user to check role and permissions
      const admin = await Admin.findById(req.user.id).lean();
      if (!admin) {
        return next(buildError("Forbidden", 403));
      }

      // Full admin has all permissions
      if (admin.role === "admin") {
        req.authz = { isAdmin: true, permissions: ["*"] };
        return next();
      }

      // Staff must have at least one of the specified permissions
      const hasAny =
        Array.isArray(admin.permissions) &&
        perms.some((perm) => admin.permissions.includes(perm));
      if (!hasAny) {
        return next(buildError("Insufficient permissions", 403));
      }

      req.authz = { isAdmin: false, permissions: admin.permissions };
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

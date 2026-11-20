export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error?.issues || result.error?.errors || [];
      const formattedErrors = issues.map((err) => ({
        field: Array.isArray(err.path) ? err.path.join(".") : String(err.path),
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors
      });
    }
    // Replace req.body with parsed & transformed data
    req.body = result.data;
    next();
  };
}

const responseMiddleware = (req, res, next) => {
  if (res.err) {
    const { message } = res.err;
    console.log("message", message);
    return res.status(res.statusCode || 400).json({
      error: true,
      message,
    });
  }

  if (res.data) {
    console.log("responseMiddleware res.data", res.data);
    return res.status(res.statusCode || 200).json(res.data);
  }

  next();
};

export { responseMiddleware };

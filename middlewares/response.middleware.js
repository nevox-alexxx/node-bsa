const responseMiddleware = (req, res, next) => {
  if (res.err) {
    const { message } = res.err;
    console.log("message", message);
    return res.status(400).json({
      error: true,
      message,
    });
  }
  
  console.log("responseMiddleware res.data", res.data);
  return res.status(200).json(res.data);
};

export { responseMiddleware };

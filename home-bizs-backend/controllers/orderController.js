exports.createOrder = (req, res) => {
  const { userId, items, total } = req.body;
  // For now, just echo the data
  res.status(201).json({
    message: "Order received!",
    data: { userId, items, total },
  });
};

const notFound = (req, res) => {
  res.status(400).send("Route does'nt exist!");
};

export default notFound;

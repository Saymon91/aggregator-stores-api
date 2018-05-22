module.exports = (req, res, next) => {
  req.get('Authorization') ? next() : res.sendStatus(403);
};
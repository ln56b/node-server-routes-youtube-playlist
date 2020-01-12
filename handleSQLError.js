const handleSQLError = (err, res) => res.status(500).json({
  error: err.message,
  errorDetails: err.sql
});

const handleNotFound = (message, res) => res.status(404).json({
  error: messsage
});

module.exports = {
  handleSQLError,
  handleNotFound
};
// Helper function to parse dates in different formats
const parseDate = (dateString) => {
  let date = moment(dateString, "YYYY-MM-DD", true);
  if (!date.isValid()) {
    date = moment(dateString, "DD-MM-YYYY", true);
  }
  return date.isValid() ? date : null;
};

module.exports = {
  parseDate,
};

const transformFieldToNumber = field => {
  return typeof field === "number" ? field : parseInt(field);
}

module.exports = transformFieldToNumber;


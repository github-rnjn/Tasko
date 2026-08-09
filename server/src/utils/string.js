const toTitleCase = (value) => {
    return value
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

module.exports = {
    toTitleCase,
};
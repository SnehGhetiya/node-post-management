const getPagination = (page, size) => {
	const limit = size ? size : 0;
	const offset = page ? (page - 1) * limit : 0;

	return { limit, offset };
};

const escapeRegex = (text) => {
	return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

module.exports = { getPagination, escapeRegex };

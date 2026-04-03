module.exports = (object, query, count) => {
    if (query.page) {
        object.currentPage = parseInt(query.page);
    }
    object.skip = (object.currentPage - 1) * object.limitItems;
    object.limitPage = Math.ceil(count / object.limitItems);
    return object;
};

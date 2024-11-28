const setQuizId = (context, ee, next) => {
    context.vars['quizId'] = Math.random().toString(36).substring(2, 8);
    return next();
};

module.exports = {
    setQuizId,
};


const Ctrl = async (args, message, next) => {






    return next(message);

};

module.exports = {
    name: 'auth',
    priority: 10,
    controller: Ctrl,
};
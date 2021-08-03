
const Ctrl = async (args, message, next) => {






    return next(message);

};

module.exports = {
    name: 'auth',
    controller: Ctrl,
};
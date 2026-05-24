const bcrypt = require("bcryptjs");

exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};
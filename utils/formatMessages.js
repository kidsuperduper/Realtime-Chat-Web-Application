const moment = require("moment");

function formatMessages(username, text) {
    return {
        username,
        text,
        time: moment().format("hh:mm"),
    };
}

module.exports = formatMessages;

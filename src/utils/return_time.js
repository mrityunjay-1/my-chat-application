const getCurrentTimeWithMessage = (message) => {
    return {
        message,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (message) => {
    return {
        url: message,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    getCurrentTimeWithMessage,
    generateLocationMessage
}
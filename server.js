const app = require("./config/app");

// ℹ️ Set the PORT and start the server
const PORT = process.env.PORT || 5005;

setTimeout(() => {
    app.listen(PORT, () => {
        console.log(
            `LinkedIn_Notifyer Server Listening On: \x1b[1m\x1b[36mhttp://localhost:${PORT}/api\x1b[0m\n`
        );
    });
}, 500);


//check erorr in next and middleware

const { Schema, model } = require("mongoose");

const childSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required.']
        },

        picture: {
            type: String,
            default: "https://res.cloudinary.com/dfnezrziy/image/upload/v1693817681/KiddFlix/bzvqduc9bfro36l0uzb8.jpg"
        },
        userType: {
            type: String,
            default: "child"
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Parent"
        }
    }
);

const Child = model("Child", childSchema);
module.exports = Child;

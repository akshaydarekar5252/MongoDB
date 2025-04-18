const mongoose = require('mongoose');
const Chat = require('./models/chat.js');

main() .then(()=> {
    console.log("MongoDB connected successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsApp');
}

let allChats = [
    {
        from: "John",
        to: "Doe",
        msg: "Hello",
        created_at: new Date(),
    },
    {
        from: "Alice",
        to: "Bob",
        msg: "Hey, how are you?",
        created_at: new Date(),
    },
    {
        from: "Eve",
        to: "Charlie",
        msg: "Can we meet at 5?",
        created_at: new Date(),
    },
    {
        from: "Mike",
        to: "Nina",
        msg: "Got the documents?",
        created_at: new Date(),
    },
    {
        from: "Sara",
        to: "Leo",
        msg: "Thanks for your help!",
        created_at: new Date(),
    },
    {
        from: "Tom",
        to: "Jerry",
        msg: "I'll call you later.",
        created_at: new Date(),
    },
    {
        from: "Anna",
        to: "Mark",
        msg: "Good luck with your test!",
        created_at: new Date(),
    },
    {
        from: "Ken",
        to: "Rina",
        msg: "Happy Birthday!",
        created_at: new Date(),
    },
];

Chat.insertMany(allChats);

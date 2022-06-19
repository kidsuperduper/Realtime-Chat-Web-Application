const chatForm = document.getElementById("chat-form");
const chat_messages = document.querySelector(".chat-messages");

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
    outputRoom(room);
    outputUsers(users);
});

socket.on("message", (message) => {
    outputMessage(message);
    chat_messages.scrollTop = chat_messages.scrollHeight;
});

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let msg = event.target.elements.msg.value;

    socket.emit("chatMessage", msg);

    event.target.elements.msg.value = "";
    event.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
              ${message.text}
            </p>`;

    chat_messages.appendChild(div);
}

function outputRoom(room) {
    const roomName = document.getElementById("room-name");

    roomName.innerHTML = room;
}

function outputUsers(users) {
    const userList = document.getElementById("users");

    userList.innerHTML = users
        .map((user) => {
            const { id, username, room } = user;
            return `<li>${username}</li>`;
        })
        .join("");
}

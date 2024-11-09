let socket;

async function connect() {
    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            email: document.getElementById('loginId').value,
            password: document.getElementById('passwordId').value
        })
    });

    document.getElementById('loginResp').innerHTML = JSON.stringify(await response.text());

    socket = io.connect('http://localhost:3000');
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function subscribeToChat() {
    const chatId = document.getElementById('chatId').value;

    socket.emit('subscribeToChat', { chatId }, (answer) => {
        document.getElementById('status').innerHTML = answer;
    });

    socket.on('exception', (error) => {
        document.getElementById('error').innerHTML = JSON.stringify(error);
    });

    socket.on('message', (body) => {
        document.getElementById('messages').innerHTML +=
            '<td>' + body.id + '</td>' +
            '<td>' + body.createdAt + '</td>' +
            '<td>' + body.text + '</td>' +
            '<td>' + body.author.name + '</td>';
    });
}


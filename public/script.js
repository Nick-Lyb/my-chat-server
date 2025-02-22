let socket;

function joinChat() {
	const nameInput = document.getElementById("nameInput");
	const chatLogDiv = document.getElementById("chatLog");

	socket = io();

	socket.emit("join", nameInput.value);

	nameInput.style.display = "none";
	document.querySelector("#chatLog").style.display = "block";
	document.querySelector("#messageInput").style.display = "block";

	// Обробка нових повідомлень від інших учасників 
	socket.on("newMessage", ({ message, senderUsername }) => {

		const newMessageElement =
			`<p><b>${senderUsername}</b>: ${message}</p>`;
		
		chatLogDiv.innerHTML += newMessageElement;
	});

	socket.on("newUser", (notificationText) => {

		const notificationElement =
			`<p style='color:green'>${notificationText}</p>`;
		
		chatLogDiv.innerHTML += notificationElement;
		
     });

     socket.on("userLeft", (notificationText) => {

         const notificationElement =
             `<p style='color:red'>${notificationText}</p>`;
         
         chatLogDiv.innerHTML += notificationElement;
         
      });
}

function sendMessage() {

	if (!socket)
	return alert("Спочатку потрібно приєднатися до розмови!");

	const messageInputElement =
	document.getElementById("messageInput");

	if (!messageInputElement.value.trim())
	return alert(
	  "Повідомлення не може бути порожнім!"
	  );

	socket.emit(
	  "message",
	  messageInputElement.value,
	  
	   );
	messageInputElement.value="";
}

function toggleChat() {
  const chat = document.getElementById("chatWidget");
  chat.style.display = chat.style.display === "flex" ? "none" : "flex";
}

async function ask() {
  const input = document.getElementById("question");
  const chatBody = document.getElementById("chatBody");
  const question = input.value.trim();
  if (!question) return;

  // Show user message
  chatBody.innerHTML += `<div class="chat-message user"><span>${question}</span></div>`;
  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // Show typing indicator
  const typingEl = document.createElement("div");
  typingEl.className = "chat-message bot typing";
  typingEl.id = "typingIndicator";
  typingEl.innerHTML = `<span>.</span><span>.</span><span>.</span>`;
  chatBody.appendChild(typingEl);
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
    const res = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();

    // Remove typing
    typingEl.remove();

    // Show bot answer
    chatBody.innerHTML += `<div class="chat-message bot"><span>${data.answer}</span></div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
  } catch (error) {
    typingEl.remove();
    chatBody.innerHTML += `<div class="chat-message bot"><span>⚠️ Error fetching response</span></div>`;
  }
}

// Press Enter to send
document.getElementById("question").addEventListener("keydown", function (e) {
  if (e.key === "Enter") ask();
});
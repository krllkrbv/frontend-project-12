import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Chat = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const wsRef = useRef(null);

  useEffect(() => {
    // Подключение к WebSocket
    const ws = new WebSocket('ws://localhost:3000');
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    ws.onclose = () => {
      console.log('WebSocket закрыт');
    };

    // При отключении - возможна переподключение по необходимости
    // например, через setTimeout (опционально)

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    // Отправка через POST-запрос
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input, username }),
      });
      setInput('');
    } catch (error) {
      console.error('Ошибка отправки сообщения', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', height: '80vh' }}>
      <div style={{ flex: 1, borderRight: '1px solid black', padding: '10px', overflowY: 'auto' }}>
        <h2>Канал General</h2>
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.username}</strong>: {msg.content} <em>({new Date(msg.timestamp).toLocaleTimeString()})</em>
          </div>
        ))}
      </div>
      <div style={{ flex: 0.3, padding: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ваше сообщение..."
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
};

const ChatPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Перенаправление при отсутствии токена
      navigate('/login');
    }
  }, [navigate]);

  // Можно получить имя пользователя из токена или другой логики
  const username = 'Гость'; // или извлечь из токена

  return (
    <div>
      <h1>Добро пожаловать в чат!</h1>
      {/* Встроенный компонент чата */}
      <Chat username={username} />
    </div>
  );
};

export default ChatPage;
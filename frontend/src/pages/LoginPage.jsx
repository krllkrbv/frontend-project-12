import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(''); // состояние для ошибки авторизации

  const handleSubmit = async (values) => {
    setAuthError(''); // очищаем сообщение ошибки перед отправкой
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (!response.ok) {
        // Если статус не успех, показываем ошибку
        setAuthError('Имя пользователя или пароль неверны');
        return;
      }

      const data = await response.json();

      // Сохраняем токен в localStorage
      localStorage.setItem('token', data.token);

      // Перенаправление на главную страницу
      navigate('/');
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      setAuthError('Произошла ошибка. Попробуйте еще раз.');
    }
  };

  return (
    <div>
      <h2>Форма авторизации</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div>
              <label htmlFor="username">Имя пользователя:</label>
              <Field
                id="username"
                name="username"
                placeholder="Введите имя пользователя"
              />
            </div>
            <div>
              <label htmlFor="password">Пароль:</label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Введите пароль"
              />
            </div>
            {authError && <div style={{ color: 'red', marginTop: '10px' }}>{authError}</div>}
            <button type="submit">Войти</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
## Итоговая работа Backend-разработчик на Node.JS

### Запуск 

Для запуска необходимо создать файл .env на основе файла .env.example

```
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Запуск на основе docker compose
```bach
$ docker compose up
```

### Описание
#### 1. API модуля управление пользователями
При первом запуске проекта при отсутствии в БД пользователей будет создан пользователь c ролью admin со следующими параметрами
```
name: 'admin',
email: 'aaa@mail.ru',
password: '123',
```
1.1 Создание пользователя
```
POST /api/admin/users
```
Пример тела запроса:
```
{
    "email": "bbb@mail.ru",
    "password": "123",
    "name": "Ivanov",
    "contactPhone": "12345",
	"role": "manager"
}
```
Доступно пользователям с ролью admin

1.2 Получение списка пользователей
```
GET /api/admin/users
GET /api/manager/users
```
Пример запроса:
```
/api/admin/users?limit=10&offset=0&name=Ivanov
```

query параметры:
```
limit - количество записей в ответе;
offset - сдвиг от начала списка;
name - фильтр по полю;
email - фильтр по полю;
contactPhone - фильтр по полю.
```
Доступно пользователям с ролью admin, manager

#### 2. API модуля авторизации
2.1 Вход
```
POST /api/auth/login
```
Пример тела запроса:
```
{
    "email": "bbb@mail.ru",
	"password": "123"
}
```

2.2 Выход
```
POST /api/auth/logout
```

2.3 Регистрация нового пользователя с ролью client
```
POST /api/auth/register
```
Пример тела запроса:
```
{
	"email": "ccc@mail.ru",
	"password": "123",
	"name": "Petrov",
	"contactPhone": "333"
}
```

### 3. API модуля гостиницы
3.1 Поиск номеров
```
GET /api/common/hotel-rooms
```
query параметры
```
limit — количество записей в ответе;
offset — сдвиг от начала списка;
hotel — ID гостиницы для фильтра;
```
Пример запроса:
```
api/common/hotel-rooms?limit=100&offset=0&hotel=6727896b63571da80423393a
```

3.2 Информация о конкретном номере
```
GET /api/common/hotel-rooms/:id
```
Пример запроса:
```
/api/common/hotel-rooms/67279c9209c607f815756820
```

3.3 Добавление гостиницы
```
POST /api/admin/hotels/
```
Пример тела запроса:
```
{
	"title": "Искра",
	"description": "Лучший отель"
}
```
Доступно только пользователю с ролью admin

3.4 Получение списка гостиниц
```
GET /api/admin/hotels
```
query параметры
```
limit - количество записей в ответе.
offset - сдвиг от начала списка.
title - фильтр по полю.
```
Пример запроса
```
/api/admin/hotels?limit=100&offset=0&title=Искр
```
Доступно только пользователю с ролью admin

3.5 Изменение описания гостиницы
```
PUT /api/admin/hotels/:id
```
Пример запроса
```
PUT /api/admin/hotels/672f585ab648aa229fd0395a
{
	"title": "Искра",
	"description": "Хороший отель"
}
```
Доступно только пользователю с ролью admin

3.6 Добавление номера
```
POST /api/common/hotel-rooms
```
Пример тела запроса
```
multipart/form-data
images=файлы
description=Большой просторный номер
hotelId=6727896b63571da80423393a
```
Доступно только пользователю с ролью admin

3.7 Изменение описания номера
```
PUT api/admin/hotel-rooms/672f5c671f8fc7dee395f295
```
Пример тела запроса
```
multipart/form-data
images=файлы
description=Просторный номер
hotelId=6727896b63571da80423393a
isEnabled=true
images=["/static/672f5c671f8fc7dee395f295/1881752_E_20241030.pdf"]
```
Доступно только пользователю с ролью admin

### 4. API модуля бронирования
4.1 Бронирование номера клиентом
```
POST api/client/reservations
```
Пример тела запроса
```
{
    "hotelRoom": "672786b8ca073695c9708fe4",
    "startDate": "2021-01-04",
    "endDate": "2021-01-04"
}
```
Доступно только пользователю с ролью client

4.2 Список броней текущего пользователя
```
GET /api/client/reservations
```
Доступно только пользователю с ролью client

4.3 Отмена бронирования клиентом
```
DELETE /api/client/reservations/:id
```
Пример запроса
```
/api/client/reservations/672f5f3a1f8fc7dee395f2b9
```
Доступно только пользователю с ролью client

4.4 Список броней конкретного пользователя
```
GET /api/manager/reservations/:id
```
Пример запроса
```
/api/manager/reservations/672f510dbbd2deb8e9eaa467
```
Доступно только пользователю с ролью manager

4.5 Отмена бронирования менеджером
```
DELETE /api/manager/reservations/:id
```
Пример запроса
```
/api/manager/reservations/672f510dbbd2deb8e9eaa467
```
Доступно только пользователю с ролью manager

### 5. API модуля чат
5.1 Создание обращения в поддержку
```
POST /api/client/support-requests
```
Пример тела запроса
```
{
  "text": "Текст сообщения"
}
```
Доступно только пользователю с ролью  client

5.2 Получение списка обращений в поддержку для клиента
```
GET /api/client/support-requests
```
query параметры
```
limit - количество записей в ответе;
offset - сдвиг от начала списка;
isActive - фильтр по полю.
```
Пример запроса
```
/api/client/support-requests?isActive=true&limit=10&offset=0
```
Доступно только пользователю с ролью client

5.3 Получение списка обращений в поддержку для менеджера
```
GET api/manager/support-requests
```
query параметры
```
limit - количество записей в ответе;
offset - сдвиг от начала списка;
isActive - фильтр по полю.
```
Пример запроса
```
/api/manager/support-requests?isActive=true&limit=10&offset=0
```
Доступно только пользователю с ролью manager

5.4. Получение истории сообщений из обращения в техподдержку
```
GET /api/common/support-requests/:id/messages
```
Пример запроса
```
/api/common/support-requests/672f644e1f8fc7dee395f2f5/messages
```
Доступно только пользователю с ролью client или manager

5.5. Отправка сообщения
```
POST /api/common/support-requests/:id/messages
```
Пример запроса
```
/api/common/support-requests/672f644e1f8fc7dee395f2f5/messages
{
  "text": "Текст сообщения1"
}
```
Доступно только пользователю с ролью client или manager

5.6. Отправка события, что сообщения прочитаны
```
POST /api/common/support-requests/:id/messages/read
```
Пример запроса
```
/api/common/support-requests/672f644e1f8fc7dee395f2f5/messages/read
{
	"createdBefore": "2024-11-09T13:59:58.674+00:00"
}
```
Доступно только пользователю с ролью client или manager

5.7. Подписка на сообщения из чата техподдержки

Подписка на сообщения реализована в ChatGateway<br>
Для проверки работоспособности подписки создана html форма /websocket/index.html<br>
Необходимо выполнить логин от имени client или manager<br>
Подписаться на чат<br>
После этого при добавлении сообщений в чат они будут появляться в таблице<br>
Доступно только пользователю с ролью client или manager
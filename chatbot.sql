CREATE DATABASE IF NOT EXISTS chatbot;

USE chatbot;

CREATE TABLE IF NOT EXISTS failed_conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  createdAt DATETIME NOT NULL,
  message TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  createdAt datetime NOT NULL,
  sentAt datetime,
  deliveredAt datetime,
  orderState ENUM("processing", "inDelivery", "delivered"),
  isReturned BOOLEAN
);

-- insert example data

INSERT INTO orders(createdAt, sentAt, deliveredAt, orderState, isReturned) VALUES (
  "2023-03-02 11:01:02",
  "2023-03-04 12:12:55",
  "2023-03-05 18:56:05",
  "delivered",
  true
);

INSERT INTO orders(createdAt, sentAt, deliveredAt, orderState, isReturned) VALUES (
  "2023-03-15 07:12:02",
  "2023-03-15 11:45:25",
  "2023-03-05 18:56:05",
  "delivered",
  true
);

INSERT INTO orders(createdAt, sentAt, deliveredAt, orderState, isReturned) VALUES (
  "2023-04-02 09:01:22",
  "2023-04-03 17:12:55",
  "2023-04-04 14:01:22",
  "delivered",
  false
);

INSERT INTO orders(createdAt, sentAt, deliveredAt, orderState, isReturned) VALUES (
  "2023-04-03 13:01:22",
  "2023-04-04 12:12:55",
  "2023-04-05 09:01:22",
  "delivered",
  false
);

INSERT INTO orders(createdAt, sentAt, deliveredAt, orderState, isReturned) VALUES (
  "2023-06-05 13:01:22",
  "2023-06-06 12:12:55",
  NULL,
  "processing",
  false
);

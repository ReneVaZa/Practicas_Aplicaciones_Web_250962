-- Comandos para crear la base de datos
-- para mecagest y su interaccion con PHP

-- 1. Crear la base de datos
CREATE DATABASE db_mecagest;

-- 2. Usar/Activar la base de datos
USE db_mecagest;

-- 3. Crear la tabla de usuarios
CREATE TABLE usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre Varchar(100) NOT NULL, 
email VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   ON UPDATE CURRENT_TIMESTAMP,
   status TINYINT DEFAULT 1
);

-- 4. Visualizar la estructura de la tabla
DESCRIBE usuarios;

-- 5. Seleccionar los registros de la tabla
SELECT * FROM usuarios;

-- 6. Ejemplo de insercion de un nuevo usuario
INSERT INTO usuarios VALUES(DEFAULT,"Rene Vargas Zarate", "250962@utxicotepec.edu.mx",
md5("N1i6g4a"), now(), null, 1);

-- 7. Insercion miltiple de otros dos usuarios
INSERT INTO usuarios (nombre,email,password) values
("Juan Perez", "j.perez@gmail.com", md5("12345")),
("Patricia Reyes", "patty,reyes48@outlook.com", md5("67890"));




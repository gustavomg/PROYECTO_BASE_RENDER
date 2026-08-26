CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL
);

INSERT INTO usuarios (nombre, email) VALUES 
('Alumno Demo', 'alumno@ejemplo.com'),
('Profesor', 'profe@ejemplo.com');
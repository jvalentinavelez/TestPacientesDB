CREATE TABLE `pacientesDB` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL DEFAULT '',
  `tipoDocumento` varchar(11) NOT NULL DEFAULT '',
  `documento` int(11) NOT NULL,
  `fechaNacimiento` varchar(11) NOT NULL DEFAULT '',
  `edad` int(11) NOT NULL,
  `peso` int(11) NOT NULL,
  `altura` int(11) NOT NULL,
  `ibm` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


INSERT INTO Users (nombre, tipoDocumento,documento, fechaNacimiento, edad, peso, altura, ibm) VALUES
('Paciente Prueba 1', 'TC', 12341242, '1998/10/14', 22, 55, 163, 20.70),
('Paciente Prueba 2', 'CC', 11243244, '2009/10/03', 11, 46, 145, 15.92);

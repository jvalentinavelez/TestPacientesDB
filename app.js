const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const myconnection = require("express-myconnection");
const methodOverride = require('method-override')

const app = express();
const dbOptions = {
  host: '127.0.0.1',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'pacientesDB'
};

// const dbOptions = {
//   host: 'us-cdbr-east-04.cleardb.com',
//   user: 'b75469b416ea38',
//   password: 'b158282e',
//   database: 'heroku_42867f3f0195b68'
// };

app.set('view engine', 'ejs');
app.use(express.json());
app.use(myconnection(mysql, dbOptions, 'single'));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//Para usar los verbos HTTP PUT y DELETE en HTML forms
app.use(methodOverride(function(req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // Mira en los urlencoded POST bodies y los elimina/actualiza
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

// Calcula la edad del paciente
function PacientAge(date) {
  this.birthday = new Date(date); //transforma el string en un objeto
  this.calculateAge = function() {
    //ms: milisegundos
    // diferencia = fecha actual (en ms) - fecha de nacimiento (en ms)
    // diferencia = edad en ms
    const diff = Date.now() - this.birthday.getTime();

    // new Date(value); -> value = milisegundos desde 1970
    const ageDate = new Date(diff);
    //age = año si la persona hubiera nacido en 1970 (si edad: 19 = 1970+19) - 1970
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
};

////////////////// Solicitudes dirigidas a todos los pacientes ///////////////

//Trae todos las filas de la base de dato y los despliega mediante index.js
app.route("/pacientes")
  .get((req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        return res.send(err);
      } else {
        conn.query('SELECT * FROM users', (err, rows) => {
          if (err) {
            return res.send(err);
          } else {
            res.render("index", {
              pacientes: rows
            });
          }
        });
      }
    })
  })
  .post((req, res) => {

    let edad = new PacientAge(req.body.fecha).calculateAge();
    let peso = req.body.peso;
    let altura = req.body.altura;
    let ibm = (peso / ((altura * 0.01) ** 2)).toFixed(2);

    const pacienteObj = {
      nombre: req.body.nombre,
      tipoDocumento: req.body.tipoDocumento,
      documento: req.body.identificacion,
      fechaNacimiento: req.body.fecha,
      edad: edad,
      peso: peso,
      altura: altura,
      ibm: ibm
    };

    req.getConnection((err, conn) => {
      if (err) {
        return res.send(err);
      } else {
        const sql = 'INSERT INTO users SET ?';
        conn.query(sql, pacienteObj, (err, rows) => {
          if (err) {
            return res.send(err);
          } else {
            console.log('Paciente añadido');
            res.redirect("/pacientes");
          }
        });
      }
    })
  });

////////////////// Solicitudes dirigidas a pacientes específicos ///////////////

//Mediante el documento, que se obtiene mediante index.ejs, se obtienen los datos respectivos de un paciente
//Se usa get para la función de búsqueda, put para la actualización de los datos y delete para eliminarlos
app.route("/pacientes/:id")
  .get((req, res) => {
    let id = req.params.id;
    console.log(identificacion);
    req.getConnection((err, conn) => {
      if (err) {
        return res.send(err);
      } else {
        conn.query('SELECT * FROM users WHERE id = ?', id, (err, rows) => {
          if (err) {
            return res.send(err);
          } else {
            console.log('found patient');
            console.log(rows);
            res.render("index", {
              pacientes: rows
            });
          }
        });
      }
    })
  })
  .put((req, res) => {
    let id = req.params.id;

    let edad = new PacientAge(req.body.fecha).calculateAge();
    let peso = req.body.peso;
    let altura = req.body.altura;
    let ibm = (peso / ((altura * 0.01) ** 2)).toFixed(2);

    const pacienteObj = {
      nombre: req.body.nombre,
      tipoDocumento: req.body.tipoDocumento,
      documento: req.body.identificacion,
      fechaNacimiento: req.body.fecha,
      edad: edad,
      peso: peso,
      altura: altura,
      ibm: ibm
    };
    req.getConnection((err, conn) => {
      if (err) {
        return res.send(err);
      } else {
        conn.query('UPDATE users set ? WHERE id = ?', [pacienteObj, id], (err, rows) => {
          if (err) {
            return res.send(err);
          } else {
            console.log('user updated');
            res.redirect("/pacientes");
          }
        });
      }
    })
  })
  .delete((req, res) => {
    let id = req.params.id;
    req.getConnection((err, conn) => {
      if (err) {
        return res.send(err);
      } else {
        conn.query('DELETE FROM users WHERE id = ?', id, (err, rows) => {
          if (err) {
            return res.send(err);
          } else {
            console.log('user deleted');
            res.redirect("/pacientes");
          }
        });
      }
    })
  });

//Server Port
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

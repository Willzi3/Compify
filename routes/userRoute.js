const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const middleware = require("../middleware/auth");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Gets all users
router.get("/", (req, res) => {
    try {
        con.query("SELECT * FROM users", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
  });
  
  // Gets one user by id
  router.get("/:id", (req, res) => {
    try {
      con.query(`SELECT * FROM users WHERE user_id ='${req.params.id}'`, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
  
  // Add new users
  router.post("/", (req, res) => {
    // the below allows you to only need one const, but every input required is inside of the brackets
    const {
      email,
      password,
      full_name,
      phone,
      user_type,
      joined_date,
      gender,
      address,
      description,
      image,
      cart
    } = req.body;
    // OR
    // the below requires you to add everything one by one
    //   const email = req.body.email;
    try {
      con.query(
        //When using the ${}, the content of con.query MUST be in the back tick
        `INSERT INTO users (email,
            password,
            full_name,
            phone,
            user_type,
            joined_date,
            gender,
            address,
            description,
            image,
            cart) VALUES ("${email}", "${password}", "${full_name}", "${phone}", "${user_type}", "${joined_date}", "${gender}", "${address}", "${description}", "${image}", "${cart}")`,
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
  
  // Delete one users
  router.delete("/:id", (req, res) => {
    try {
      con.query(
        `DELETE FROM users WHERE user_id ="${req.params.id}"`,
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
  
  //Update users
    router.put("/:id", middleware, (req, res) => {
      // the below allows you to only need one const, but every input required is inside of the brackets
      const {
        email,
            password,
            full_name,
            phone,
            user_type,
            joined_date,
            gender,
            address,
            description,
            image,
            cart
      } = req.body;
  
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      // OR
      // the below requires you to add everything one by one
      //   const email = req.body.email;
      try {
        con.query(
          //When using the ${}, the content of con.query MUST be in the back tick
          `UPDATE users set email="${email}", password="${hash}", full_name="${full_name}", phone="${phone}", user_type="${user_type}", joined_date="${joined_date}", gender="${gender}", address="${address}", description="${description}", image="${image}", cart="${cart}" WHERE user_id ="${req.params.id}"`,
          (err, result) => {
            if (err) throw err;
            res.send(result);
          }
        );
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
    });
  
    //edit users
    // router.put("edit/:id", middleware, (req, res) => {
    //   // the below allows you to only need one const, but every input required is inside of the brackets
    //   const {
    //         birth_date,
    //         gender,
    //         address,
    //         description,
    //         image
    //   } = req.body;
  
    //   // const salt = bcrypt.genSaltSync(10);
    //   // const hash = bcrypt.hashSync(password, salt);
    //   // OR
    //   // the below requires you to add everything one by one
    //   //   const email = req.body.email;
    //   try {
    //     con.query(
    //       //When using the ${}, the content of con.query MUST be in the back tick
    //       `UPDATE users set  birth_date="${birth_date}", gender="${gender}", address="${address}", description="${description}", image="${image}" WHERE user_id ="${req.params.id}"`,
    //       (err, result) => {
    //         if (err) throw err;
    //         res.send(result);
    //       }
    //     );
    //   } catch (error) {
    //     console.log(error);
    //     res.status(400).send(error);
    //   }
    // });
    router.post("/register", (req, res) => {
      try {
        let sql = "INSERT INTO users SET ?";
        const {
          email,
          password,
          full_name,
          phone,
          user_type,
          joined_date,
          gender,
          address,
          description,
          image,
          cart
        } = req.body;
     
        // The start of hashing / encryption
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
    
        let user = {
          email,
          password:hash,
          full_name,
          phone,
          user_type,
          joined_date,
          gender,
          address,
          description,
          image,
          cart
        };
        con.query(sql, user, (err, result) => {
          if (err) throw err;
          console.log(result);
          res.send(`User ${(user.full_name, user.email)} created successfully`);
        });
      } catch (error) {
        console.log(error);
      }
    });
    
    //update user
    router.put("/:id", middleware, (req, res) => {
      // the below allows you to only need one const, but every input required is inside of the brackets
      const {
            full_name,
            phone,
            user_type,
            joined_date,
            gender,
            address,
            description,
            image,
            cart
      } = req.body;
  
      // const salt = bcrypt.genSaltSync(10);
      // const hash = bcrypt.hashSync(password, salt);
      // OR
      // the below requires you to add everything one by one
      //   const email = req.body.email;
      try {
        con.query(
          //When using the ${}, the content of con.query MUST be in the back tick
          `UPDATE users set full_name="${full_name}", phone="${phone}", user_type="${user_type}", joined_date="${joined_date}", gender="${gender}", address="${address}", description="${description}", image="${image}", cart="${cart}" WHERE user_id ="${req.params.id}"`,
          (err, result) => {
            if (err) throw err;
            res.send(result);
          }
        );
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
    });
    // Login
  router.post("/login", (req, res) => {
    console.log(req.body)
    try {
      let sql = "SELECT * FROM users WHERE ?";
      let user = {
        email: req.body.email,
      };
      con.query(sql, user, async (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
          res.send("Email not found please register");
        } else {
          const isMatch = await bcrypt.compare(
            req.body.password,
            result[0].password
          );
          if (!isMatch) {
            res.send("Password incorrect");
                } else {
                  // The information the should be stored inside token
                  const payload = {
                    user: {
                      id: result[0].user_id,
                      full_name: result[0].full_name,
                      email: result[0].email,
                      user_type: result[0].user_type,
                      image: result[0].image,
                      phone: result[0].phone,
                      gender: result[0].gender,
                      address: result[0].address,
                      description: result[0].description
                    },
                  };
                  // Creating a token and setting expiry date
                  jwt.sign(
                    payload,
                    process.env.jwtSecret,
                    {
                      expiresIn: "365d",
                    },
                    (err, token) => {
                      if (err) throw err;
                      res.json({ token });
                      console.log(req.body);
                    }
                  );
                }
              }
            });
          } catch (error) {
            console.log(error);
          }
        });
  //update user
  router.patch("/:id", middleware, (req, res) => {
    try {
      let sql = "SELECT * FROM users WHERE ?";
      let user = {
        user_id: req.params.id,
      };
      con.query(sql, user, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
          let updateSql = `UPDATE users SET ? WHERE user_id ="${req.params.id}"`;
          let updateUser = {
            full_name: req.body.full_name,
            joined_date: req.body.joined_date,
            phone: req.body.phone,
            gender: req.body.gender,
            address: req.body.address,
            description: req.body.description,
            image: req.body.image,
            user_type: req.body.user_type,
          };
          con.query(updateSql, updateUser, (err, updated) => {
            if (err) throw err;
            console.log(updated);
            res.send(JSON.stringify("Successfully Updated"));
          });
        } else {
          res.send(JSON.stringify("User not found"));
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
  
        // Verify
  router.get("/users/verify", (req, res) => {
      const token = req.header("x-auth-token");
      jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
        if (error) {
          res.status(401).json({
            msg: "Unauthorized Access!",
          });
        } else {
          res.status(200);
          res.send(decodedToken);
        }
      });
    });
  
  
    router.get("/", middleware, (req, res) => {
      try {
        let sql = "SELECT * FROM users";
        con.query(sql, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      } catch (error) {
        console.log(error);
      }
    });
  
  
  module.exports = router;
module.exports = {
    apps : [{
      name   : "CoopeF",
      script : "HOMO=true nodemon index.js",
      env: {
        PORT: "5001"
      }
    }]
  }
  
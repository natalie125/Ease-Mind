module.exports = {
    generateUniqueEmail: (context, events, done) => {
      const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`; // Creates a unique suffix for the email
      context.vars.email = `user${uniqueSuffix}@test.com`; // Sets the email in the context to be used in the test
      done();
    }
  };
  
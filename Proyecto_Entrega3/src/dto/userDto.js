const createUserDTO = (user) => {
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age
      // Puedes incluir otros campos aquí si son necesarios y no son sensibles
    };
  };
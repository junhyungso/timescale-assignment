const isValidEmail = (email: string) => {
    const name = email.split("@")[0];
    const domain = email.split("@")[1];
    return (
      email.includes("@") &&
      domain.includes(".") &&
      email.length >= 3 &&
      name.length > 0
    );
  };
  export default isValidEmail
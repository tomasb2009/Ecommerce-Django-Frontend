function CartID() {
  const generateRandomString = () => {
    const length = 30;
    const characters = "ABCDEFGHIJKL1234567";
    let randomString = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    localStorage.setItem("randomString", randomString);
  };

  let existingRandomString = localStorage.getItem("randomString");

  if (!existingRandomString) {
    generateRandomString();
    existingRandomString = localStorage.getItem("randomString");
  }

  return existingRandomString;
}

export default CartID;

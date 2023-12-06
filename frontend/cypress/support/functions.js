export default function getRandomEmail() {
  let result = 'User';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let counter = 0;
  while (counter < 5) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }

  result += '@gmail.com';
  return result;
}

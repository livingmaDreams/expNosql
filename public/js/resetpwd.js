document.getElementById('form-forgotpassword-page').addEventListener('submit', forgotPassword);

function forgotPassword(event){
  event.preventDefault();
  const mail = event.target.mail.value;
  const obj = {mail};
  axios.post('http://54.206.216.5:3000/forgotpassword/called',obj)
  .then(() => window.location.href='http://54.206.216.5:3000/login')
  .catch(err => console.log(err));
}
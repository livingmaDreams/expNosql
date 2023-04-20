document.getElementById('form-signuppage').addEventListener('submit', signup);

function signup(event){
   event.preventDefault()
   const name = event.target.name.value;
   const mail = event.target.mail.value;
   const password = event.target.password.value;
   const error = document.getElementById('error')
   
   const obj = { name,mail,password};
   axios.post('http://54.206.216.5:3000/signup',obj)
   .then(res => {
       if(res.status == 200)
        {
           error.value="*User already exists*"
           error.style.display = 'block';
         
        }else if(res.status == 201){
           error.value="*NewUser created successfully*"
           error.style.display = 'block';      
   }
  })
   .catch(err => {
     if(err.response.status == 500){
        error.value="*Something went wrong*"
        error.style.display = 'block';
       }
   });
   document.getElementById('name').value ='';
   document.getElementById('mail').value='';
   document.getElementById('password').value='';
setTimeout(()=>{
   error.style.display = 'none';
  },2000);
}

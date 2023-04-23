
document.getElementById('download').addEventListener('click', downloadLink);

function downloadLink(event){
  event.preventDefault();
  document.getElementById('download-tab').style.display='flex';
  const token = localStorage.getItem('expenseTracker');
  const div = document.getElementById('download-tab');
  div.innerHTML=`
  <table id="download-table">
               <tr>
                 <th>Date</th>
                 <th>URL Link</th>
               </tr>
             </table>
     <button id="create-download">DOWNLOAD</button>
     <button id='download-close'>X</button>`;
  const form = document.querySelector('form');
  form.appendChild(div);
  axios.get('http://54.206.216.5:3000/premium/download',{ headers:{"Authorization":token}})
  .then(res =>{
    console.log(res)
     for(let data of res.data.links)
     {
        const date = new Date(data.date).toLocaleDateString("en-GB");
        const link = data.link;
        const tr = document.createElement('tr');
        tr.innerHTML=`
        <td>${date}</td>
        <td><a href=${link}>download</a></td>`;
        document.getElementById('download-table').appendChild(tr);
     }
  })
  .catch(err => console.log(err));
}

document.getElementById('download-tab').addEventListener('click', downloadTab);

function downloadTab(event){

if(event.target.id == 'create-download'){
  event.preventDefault();
  console.log('hi')
  const token = localStorage.getItem('expenseTracker');
  axios.get('http://54.206.216.5:3000/premium/createlink',{ headers:{"Authorization":token}})
  .then(res =>{
     console.log(res)
      window.open(res.data.url);
  })
  .catch(err => console.log(err));
}

if(event.target.id == 'download-close'){
  event.preventDefault();
   document.getElementById('download-tab').style.display='none';
}
}



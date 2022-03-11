import axios from 'axios';

export async function sendRequest(url,data){
    
const headers = {'Content-Type': 'application/json'}

try {
    let responce = await axios.post(url, data , {
    headers: headers
    });
    
    if(responce.status === 200) return responce    
    
} catch (error) {
    console.log(error)
}
    
}
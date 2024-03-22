<script setup>
import { onMounted, ref } from 'vue'

let id = 0
const newEnvelope = ref('')
const envelopes = ref([])


// // //PROBLEMA NO RETORNO (não acha a página, mas acha o id certinho e até cria a  página com o id)
// async function consultar_status_envelope(idEnvelope) {
//   const response = await fetch(`http://localhost:3000/api/consultar-status-envelope/${idEnvelope}`)
//   const data = await response.json();
//   // envelope.value = envelope.value
// }

// async function consultar_envelope(idEnvelope) {
//   const response = await consultar_status_envelope(idEnvelope)
//   return response

// };


async function consultar_status(id) {
  const response = await fetch(`http://localhost:3000/api/consultar-status-envelope/${id}`)
  const data = await response.json();
}

// async function consultar_envelope(idEnvelope) {
//   const response = await consultar_status_envelope(idEnvelope)
//   return response

// };

onMounted(async () => {
  await fetchEnvelopes();
})

async function fetchEnvelopes() {
  try {
    const response = await fetch('http://localhost:3000/api/consultar-envelopes');
    envelopes.value = await response.json();
  } catch (error) {
    console.error(error);
  }
}


</script>


<template>
  <div id="containerr" style="text-align: center; display: inline-block; width: 49%;"> 
    <ul>
      <li v-for="envelope in envelopes" :key="envelope.idEnvelope">  
        {{ envelope.descricao }}
        {{ "-" }}
        {{ envelope.status }}
        <router-link :to="{ path: '/consultar-status-envelope/' + envelope.idEnvelope}">
          <button style="height: 39px; width: 79px; border-radius: 23px;">Detalhes</button>
        </router-link>
      </li>
    </ul>
    <router-link to="/">
        <button style="width: 157px;">Menu inicial</button>
    </router-link>
  </div>
</template>



<style scoped> 
 
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }


  form {
    display: flex;
    padding-left: 12px;
    padding-right: 12px;
    margin-bottom: 23px;
    flex-direction: column;
    align-items: center;
    border: 2px solid #ccc;
    border-radius: 34px;
    padding-top: 34px;
    padding-bottom: 34px;
    background-color: transparent;
  }

  input {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    color: black; 
  }




  #inptBtn {
    border-radius: 23px;
    height: 59px;
    margin-bottom: 5%;
    width: 89%;
    background: transparent;
    color: white; 
  }


  #addBtn {
    width: 50%;
    border: 1px solid white !important;
  }


  button {
    padding: 10px;
    background-color: transparent;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
  }

  button:hover {
    background-color: #aaaaaa23;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ffffff4a;
    border-radius: 23px;
    background-color: #fff;
    color: rgb(255, 255, 255);
    background-color: transparent;
  }
</style>

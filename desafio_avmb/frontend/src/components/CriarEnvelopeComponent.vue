
<template>
  <div>
    <h2 style="text-align: center;">Criar Envelope</h2>
    <form @submit.prevent="criarEnvelope" style="text-align: center;">
      <div style="margin-bottom: 20px; color: rgb(255, 255, 255);  font-family:'Segoe UI'">
        <label for="descricao">Descrição:</label>
        <input type="text" id="descricao" v-model="descricao" style="margin-left: 10px;">
      </div>
      <div style="margin-bottom: 20px; color: rgb(255, 255, 255); font-family:'Segoe UI' ;">
        <label for="documento">Documento (PDF):</label>
        <input type="file" id="documento" @change="handleFileUpload" style="margin-left: 10px;">
      </div>
      <div style="margin-bottom: 20px; color: rgb(255, 255, 255); font-family:'Segoe UI' ">
        <label for="emailSignatario">Email do Signatário:</label>
        <input type="email" id="emailSignatario" v-model="emailSignatario" style="margin-left: 10px;">
      </div>
      <button type="submit">Criar Envelope</button>
    </form>
    <ul>
      <router-link to="/">
        <button style="width: 157px;">Menu inicial</button>
    </router-link>
    </ul>
  </div>
</template>


<script>
export default {
  data() {
    return {
      descricao: '',
      documento: null,
      emailSignatario: ''
    };
  },
  methods: {
    handleFileUpload(event) {
      this.documento = event.target.files[0];
    },
    async criarEnvelope() {
      try {
        const response = await fetch('http://localhost:3000/api/criar-envelope', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            descricao: this.descricao,
            documento: await this.convertToBase64(this.documento),
            emailSignatario: this.emailSignatario
          })
        });
        if (response.ok) {
          console.log('Envelope criado com sucesso!');
          // Redirecionar para o menu inicial após o envio bem-sucedido
          this.$router.push('/');
      }} catch (error) {
        console.error('Erro ao criar envelope:', error);
      }
    },
    convertToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
      });
    }
  }
};
</script>


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
    color: black; /* Metin rengini siyah olarak ayarla */
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

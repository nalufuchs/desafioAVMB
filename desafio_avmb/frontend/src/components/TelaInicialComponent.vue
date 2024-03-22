<template>
  <div id='theContainer'>
    <h1> Bem vindo </h1>
    <h2>  Programa da Ana    </h2>
    <router-link to="/criar-envelope">
      <button style="margin: 23px; width: 24%;">Criar Envelope</button>
    </router-link>
    <router-link to="/consultar-envelopes">
      <button style="margin: 23px; width: 24%;">Consultar Envelope</button>
    </router-link>
  </div>
</template>
  
  <style>
  body {
    background: linear-gradient(135deg, #153575, #4e085f);
  }
  #theContainer {
    text-align: center;
    margin: 23px;
    padding: 23px;
  }
  h1 {
      text-align: center;
      margin-top: 45px;
      margin-bottom: 45px;
      color: white;
      width: 100%;
  }
  h2 {
    text-align: center;
    margin-bottom: 24px;
    font-weight: lighter;
    font-family: system-ui;
    color: white;
  }
  button {
      width: 50%;
      border: 1px solid white !important;
      padding: 10px;
      background-color: transparent;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 12px;
      cursor: pointer;
    }
  </style>
(function () {
  'use strict';
  class DOM {
    constructor(elements) {
      this.element = document.querySelectorAll(elements);

      this.on = function (event, func) {
        this.element.forEach(function (element) {
          element.addEventListener(event, func, false);
        });
      };

      this.off = function () {
        this.element.forEach(function (element) {
          element.removeEventListener(event, func, false);
        });
      };

      this.get = function () {
        return this.element;
      };
    }
  }

  class HttpClient {
    constructor() {
      this.get = function (aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
          $status.get()[0].value = 'Carregando';
          if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
            aCallback(anHttpRequest.responseText);
        };
        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
      };
    }
  }

  var $cep = new DOM('[data-js="cep"]');
  var $submit = new DOM('[data-js="submit"]');
  var $status = new DOM('[data-js="status"]');
  var $uf = new DOM('[data-js="uf"]');
  var $cidade = new DOM('[data-js="cidade"]');
  var $bairro = new DOM('[data-js="bairro"]');
  var $logradouro = new DOM('[data-js="logradouro"]');

  var request = new HttpClient();
  var url = "https://viacep.com.br/ws/[CEP]/json/";

  $submit.on('click', function () {
    if ($cep.get()[0].value.length === 0) {
      $status.get()[0].value = 'Erro';
    } else {
      var cepFormatado = $cep.element[0].value.match(/\d/g).join('');
      if (cepFormatado.length === 8) {
        request.get(url.replace('[CEP]', cepFormatado), function (response) {
          var data = JSON.parse(response);
          if (data.erro) {
            $status.get()[0].value = 'Erro';
          } else {
            $uf.get()[0].value = data.uf;
            $bairro.get()[0].value = data.bairro;
            $cidade.get()[0].value = data.localidade;
            $logradouro.get()[0].value = data.logradouro;
            $status.get()[0].value = 'Sucesso';
          }
        });
      } else {
        alert("Digite um CEP válido.");
      }
    }
  });

})();
var WooCommerce = require('woocommerce');
var urlpesquisa = "http://api.sigecloud.com.br/request/pessoas/Pesquisar?cpfcnpj=''&cidade=''&uf=''&cliente=true&fornecedor=false&pageSize=1&skip=0&nomefantasia=";
var urlNovaPessoa = "http://api.sigecloud.com.br/request/pessoas/SalvarEcommerce";

function Sincronizar() {

  var WoocomerceOk = WoocomerceIsOk();
  var SIGEOk = WoocomerceIsOk();

  if (IsOnline() && WoocomerceOk && SIGEOk) {
    ShowMensagemSincronizando();
    var wooCommerce = new WooCommerce({
      url: _Woocommerce.URL,
      port: _Woocommerce.SSL ? 443 : 80,
      ssl: _Woocommerce.SSL,
      consumerKey: _Woocommerce.CK,
      secret: _Woocommerce.CS
        //port: 80,
        //ssl: true,
        //consumerKey: 'ck_76ac7c3f5e3960c4d135bac448468c3f',
        //secret: 'cs_3d0bed39fe090a8bed33909faf9de111'
    });

    var headerSige = {
      App: _SIGE.APIApp,
      User: _SIGE.APIUser,
      'Authorization-Token': _SIGE.APIKey
    }

    try {
      wooCommerce.get('/orders', function(err, data, res) {
        if (err)
          ShowMensagemWoocommerce(err);
        else
          data.orders.forEach(function(element, index, array) {
            var pattern = "SIGE_ID##:";
            if (element.note.indexOf(pattern) == -1) {

              var nomeCliente = element.customer.first_name + ' ' + element.customer.last_name;
              if (nomeCliente == '' || nomeCliente == ' ')
                nomeCliente = element.customer.billing_address.first_name + ' ' + element.customer.billing_address.last_name;
              if (nomeCliente == '' || nomeCliente == ' ')
                nomeCliente = 'CONSUMIDOR NAO IDENTIFICADO';


              nomeCliente = 'Triplo XXX';

              console.log(element);
              console.log(nomeCliente);


              try {
                jQuery.ajax({
                  type: "GET",
                  async: false,
                  url: urlpesquisa + "'" + nomeCliente + "'",
                  headers: headerSige
                }).done(function(msg, status) {
                  console.log(msg);
                  if (status == "success") {
                    if (msg.length == 0) {
                      var pessoa = {
                        PessoaFisica: true,
                        NomeFantasia: nomeCliente,
                        RazaoSocial: '',
                        CNPJ_CPF: '',
                        Logradouro: element.customer.billing_address.address_1,
                        LogradouroNumero: '',
                        Complemento: '',
                        Bairro: '',
                        Cidade: element.customer.billing_address.city,
                        Pais: 'Brasil',
                        CEP: element.customer.billing_address.postcode,
                        UF: element.customer.billing_address.state,
                        Telefone: element.customer.billing_address.phone,
                        Celular: '',
                        Email: element.customer.email,
                        Cliente: true,
                        Fornecedor: false
                      }

                      jQuery.ajax({
                        type: "POST",
                        async: false,
                        url: urlNovaPessoa,
                        headers: headerSige,
                        data: pessoa
                      }).done(function(msg, status) {
                        if (status == "success") {
                          console.log(msg);
                        } else {
                          ShowMensagemSIGE(msg);
                        }
                      });
                    }
                  } else {
                    ShowMensagemSIGE(msg);
                  }
                });
              } catch (Erro) {
                ShowMensagemSIGE(Erro);
              }

              var update = {
                order: {
                  note: element.note + ' #SIGE_ID:qdhnskdusabkfb33#'
                }
              };
              wooCommerce.put('/orders/' + element.id, update, function(err, data, res) {
                console.log(element);
                ShowMensagemVendaSincronizada(element.id, "hadalaaa", element.total);
              });
            }
          });
      });
    } catch (error) {
      ShowMensagemWoocommerce(error);
    }
  } else {
    if (!WoocomerceOk)
      ShowMensagemWoocommerce();
    else if (!SIGEOk)
      ShowMensagemSIGE();
    else
      ShowMensagemOffline();
  }

  // seta a proxima sincronização
  setTimeout(function() {
    Sincronizar();
  }, 5000)

}

function WoocomerceIsOk() {

  var IsOk = true;
  if (_Woocommerce.CK == undefined || _Woocommerce.CK == '')
    IsOk = false;
  else if (_Woocommerce.CS == undefined || _Woocommerce.CS == '')
    IsOk = false;
  else if (_Woocommerce.URL == undefined || _Woocommerce.URL == '')
    IsOk = false;

  return IsOk;
}

function IsOnline() {
  return navigator.onLine;
}

function ShowMensagemWoocommerce(msg) {
  if (!msg)
    jQuery('#info').html('<div class="alert alert-danger"><strong>Woocommerce :</strong> Configure os dados de conexão ao Woocommerce</div>');
  else {
    jQuery('#info').html('<div class="alert alert-danger"><strong>Woocommerce :</strong>' + msg + '</div>');
  }
}

function ShowMensagemSincronizando() {
  jQuery('#info').html('<div class="alert alert-success"><strong>Sincronizando...</strong></div>');
}

function ShowMensagemVendaSincronizada(idWoo, idSIGE, valor) {
  var html = jQuery('#consolestatus').html();
  jQuery('#consolestatus').html('<div class="alert alert-info"><strong>Venda Sincronizada :</strong> Id Woocommerce : ' + idWoo + ' | Id SIGE : ' + idSIGE + ' | Valor : R$ ' + valor + ' </div>' + html);
}

function ShowMensagemSincronizando() {
  jQuery('#info').html('<div class="alert alert-success"><strong>Sincronizando...</strong></div>');
}

function ShowMensagemSIGE() {
  if (!msg)
    jQuery('#info').html('<div class="alert alert-danger"><strong>SIGE Cloud :</strong> Configure os dados de conexão ao SIGE Cloud</div>');
  else {
    jQuery('#info').html('<div class="alert alert-danger"><strong>SIGE Cloud :</strong>' + msg + '</div>');
  }
}

function ShowMensagemOffline() {
  jQuery('#info').html('<div class="alert alert-danger"><strong>Você esta offline, não é possivel sincronizar</strong></div>');
}

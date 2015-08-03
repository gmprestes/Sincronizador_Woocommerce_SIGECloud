var WooCommerce = require('woocommerce');
var urlpesquisa = "http://api.sigecloud.com.br/request/pessoas/pesquisar?cpfcnpj=&cidade=&uf=&cliente=false&fornecedor=false&pageSize=10&skip=0&nomefantasia=";
var urlNovaPessoa = "http://api.sigecloud.com.br/request/pessoas/SalvarEcommerce";
var urlNovaVenda = "http://api.sigecloud.com.br/request/pedidos/salvar";

function Sincronizar() {

  var WoocomerceOk = WoocomerceIsOk();
  var SIGEOk = SIGEIsOk();

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
            //console.log(element);
            var pattern = "#SIGE_PEDIDO_OK#";
            if (element.note.indexOf(pattern) == -1) {

              var nomeCliente = element.customer.first_name + ' ' + element.customer.last_name;
              if (nomeCliente == '' || nomeCliente == ' ')
                nomeCliente = element.customer.billing_address.first_name + ' ' + element.customer.billing_address.last_name;
              if (nomeCliente == '' || nomeCliente == ' ')
                nomeCliente = 'CONSUMIDOR NAO IDENTIFICADO';

              try {
                jQuery.ajax({
                  type: "GET",
                  async: false,
                  url: urlpesquisa + nomeCliente,
                  headers: headerSige
                }).done(function(msg, status) {
                  if (status == "success") {
                    if (msg.length == 0) {
                      var pessoa = {
                        "PessoaFisica": true,
                        "NomeFantasia": nomeCliente,
                        "RazaoSocial": "",
                        "CNPJ_CPF": "",
                        "RG": "",
                        "IE": "",
                        "Logradouro": element.customer.billing_address.address_1,
                        "LogradouroNumero": "",
                        "Complemento": "",
                        "Bairro": "",
                        "Cidade": element.customer.billing_address.city,
                        "CodigoMunicipio": "",
                        "Pais": "BR",
                        "CodigoPais": "1058",
                        "CEP": element.customer.billing_address.postcode,
                        "UF": element.customer.billing_address.state,
                        "CodigoUF": " ",
                        "Telefone": element.customer.billing_address.phone,
                        "Celular": "",
                        "Email": element.customer.email,
                        "Site": " ",
                        "Cliente": true,
                        "Tecnico": false,
                        "Vendedor": false,
                        "Transportadora": false,
                        "Fonecedor": false,
                        "Representada": false,
                        "Ramo": "Nenhum",
                        "VendedorPadrao": " ",
                        "NomePai": " ",
                        "NomeMae": " ",
                        "Naturalidade": " ",
                        "ValorMinimoCompra": 0.0,
                        "DataNascimento": "0001-01-01T00:00:00-02:00"
                      }

                      jQuery.ajax({
                        type: "POST",
                        async: false,
                        url: urlNovaPessoa,
                        headers: headerSige,
                        data: pessoa
                      }).done(function(msg2, status) {
                        if (status == "success") {
                          // Deu tudo certo, não faz nada
                        } else {
                          ShowMensagemSIGE(msg2);
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


              var venda = {
                "OrigemVenda": "Ecommerce",
                "Deposito": _SIGE.Deposito,
                "StatusSistema": "Pedido Faturado",
                "Status": "",
                "Categoria": "",
                "Validade": "0001-01-01T00:00:00-02:00",
                "Empresa": _SIGE.Empresa,
                "Cliente": nomeCliente,
                "Vendedor": "",
                "PlanoDeConta": _SIGE.PlanoContas,
                "FormaPagamento": "",
                "NumeroParcelas": 1,
                "Transportadora": "",
                "DataEnvio": "0001-01-01T00:00:00-02:00",
                "Enviado": false,
                "ValorFrete": element.total_shipping,
                "FreteContaEmitente": false,
                "ValorSeguro": 0.0,
                "Descricao": "Visualize em " + element.view_order_url,
                "OutrasDespesas": 0.0,
                "ValorFinal": element.total,
                "Finalizado": true,
                "Lancado": true,
                "Municipio": element.customer.billing_address.city,
                "CodigoMunicipio": "",
                "Pais": "Brasil",
                "CEP": element.customer.billing_address.postcode,
                "UF": element.customer.billing_address.state,
                "UFCodigo": "",
                "Bairro": "",
                "Logradouro": element.customer.billing_address.address_1,
                "LogradouroNumero": "",
                "LogradouroComplemento": "",
                "Items": []
              };

              element.line_items.forEach(function(item, index, array) {
                venda.Items.push({
                  "Codigo": item.sku,
                  "Unidade": "un",
                  "Descricao": item.name,
                  "Quantidade": item.quantity * 1,
                  "ValorUnitario": item.price * 1,
                  "DescontoUnitario": 0.0,
                  "ValorTotal": item.total * 1
                });
              });

              jQuery.ajax({
                type: "POST",
                async: false,
                url: urlNovaVenda + (_SIGE.Lancar ? 'efaturar' : ''),
                headers: headerSige,
                data: venda
              }).done(function(resposta, status) {
                console.log(resposta);
                if (status == "success") {
                  if (resposta.indexOf('COM SUCESSO') == -1)
                    ShowMensagemSIGE(resposta);
                  else {
                    //Atualiza o Id no woocommerce
                    var update = {
                      order: {
                        note: element.note + ' #SIGE_PEDIDO_OK#'
                      }
                    };
                    wooCommerce.put('/orders/' + element.id, update, function(err, data, res) {
                      ShowMensagemVendaSincronizada(element.id, element.total);
                    });
                  }

                } else {
                  ShowMensagemSIGE("Erro ao enviar venda ao SIGE.");
                }
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
    else if (!SIGEOk) {
      if (_SIGE.Empresa == undefined || _SIGE.Empresa == '')
        ShowMensagemSIGE("É preciso informar uma empresa para que seja possivel sincronizar");
      else if (_SIGE.Deposito == undefined || _SIGE.Deposito == '')
        ShowMensagemSIGE("É preciso informar um deposito para que seja possivel sincronizar");
      else if (_SIGE.Lancar && (_SIGE.PlanoContas == undefined || _SIGE.PlanoContas == ''))
        ShowMensagemSIGE("Se a opção LANCAR estiver marcada, é preciso informar um plano de contas para que seja possivel sincronizar");
      else {
        ShowMensagemSIGE();
      }
    } else
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

function SIGEIsOk() {

  var IsOk = true;
  if (_SIGE.Empresa == undefined || _SIGE.Empresa == '')
    IsOk = false;
  else if (_SIGE.Deposito == undefined || _SIGE.Deposito == '')
    IsOk = false;
  else if (_SIGE.Lancar && (_SIGE.PlanoContas == undefined || _SIGE.PlanoContas == ''))
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

function ShowMensagemVendaSincronizada(idWoo, valor) {
  var html = jQuery('#consolestatus').html();
  jQuery('#consolestatus').html('<div class="alert alert-info"><strong>Venda Sincronizada :</strong> Id Woocommerce : ' + idWoo + ' | Valor : R$ ' + valor + ' </div>' + html);
}

function ShowMensagemSincronizando() {
  jQuery('#info').html('<div class="alert alert-success"><strong>Sincronizando...</strong></div>');
}

function ShowMensagemSIGE(msg) {
  if (!msg)
    jQuery('#info').html('<div class="alert alert-danger"><strong>SIGE Cloud :</strong> Configure os dados de conexão ao SIGE Cloud</div>');
  else {
    jQuery('#info').html('<div class="alert alert-danger"><strong>SIGE Cloud :</strong>' + msg + '</div>');
  }
}

function ShowMensagemOffline() {
  jQuery('#info').html('<div class="alert alert-danger"><strong>Você esta offline, não é possivel sincronizar</strong></div>');
}

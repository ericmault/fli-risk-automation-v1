

 function getFLIData() {

  // Call the Tokensets API
  var response = UrlFetchApp.fetch("https://api.tokensets.com/v2/funds/ethfli");

  // var BTC_response = UrlFetchApp.fetch("https://api.tokensets.com/v2/funds/btcfli");
  
  // Logger.log(response.getContentText());
  // getGraphData()
  return populateCells()
  
}


function populateCells() {
  // Make request to API and get response before this point.

  jsonETH = setAPIETH()
  var data = JSON.parse(jsonETH);

  ETHFLI_Price = data.fund.price_usd

  ETHFLI_CurrentLeverageRatio = data.fund.current_leverage_ratio
  ETHFLI_CurrentLeverageRatio_Float = parseFloat(ETHFLI_CurrentLeverageRatio.substring(0,ETHFLI_CurrentLeverageRatio.length-1))

  ETHFLI_MarketCap = data.fund.market_cap
  ETHFLI_MarketCap_Float = parseFloat(Number(ETHFLI_MarketCap.replace(/[^0-9.-]+/g,"")));

  jsonBTC = setAPIBTC()
  var dataBTC = JSON.parse(jsonBTC);

  BTCFLI_Price = dataBTC.fund.price_usd

  BTCFLI_CurrentLeverageRatio = dataBTC.fund.current_leverage_ratio
  BTCFLI_CurrentLeverageRatio_Float = parseFloat(BTCFLI_CurrentLeverageRatio.substring(0,BTCFLI_CurrentLeverageRatio.length-1))

  BTCFLI_MarketCap = data.fund.market_cap
  BTCFLI_MarketCap_Float = parseFloat(Number(BTCFLI_MarketCap.replace(/[^0-9.-]+/g,"")));



  ETHtotalSupply = getTotalSupply(eth_call(ETH_TOTAL_SUPPLY_PAYLOAD))

  ETHmaxSupply = getTotalSupply(eth_call(ETH_MAX_SUPPLY_PAYLOAD))



  
  BTCtotalSupply = getTotalSupply(eth_call(BTC_TOTAL_SUPPLY_PAYLOAD))

  BTCmaxSupply = getTotalSupply(eth_call(BTC_MAX_SUPPLY_PAYLOAD))



  ETHFLI_TokenSupply = ETHFLI_MarketCap_Float/ETHFLI_Price
  BTCFLI_TokenSupply = BTCFLI_MarketCap_Float/BTCFLI_Price

  // var ethPrice = getETHPrice()
  // var btcPrice = getBTCPrice()

  ETHuniv3MaxTradeSize = getETHMaxTradeSize(eth_call(ETH_GET_UniswapV3ExchangeAdapter_SETTINGS_PAYLOAD))
  ETHAMMSplitterMaxTradeSize = getETHMaxTradeSize(eth_call(ETH_GET_AMMSplitterExchangeAdapter_SETTINGS_PAYLOAD))

  BTCuniv3MaxTradeSize = getBTCMaxTradeSize(eth_call(BTC_GET_UniswapV3ExchangeAdapter_SETTINGS_PAYLOAD))
  BTCAMMSplitterMaxTradeSize = getBTCMaxTradeSize(eth_call(BTC_GET_AMMSplitterExchangeAdapter_SETTINGS_PAYLOAD))




  Logger.log(ETHuniv3MaxTradeSize);
  Logger.log(ETHFLI_TokenSupply);
  Logger.log(ETHFLI_MarketCap);
  Logger.log(ETHFLI_Price);
  Logger.log(ETHFLI_CurrentLeverageRatio_Float);
  Logger.log(ETHtotalSupply);
  Logger.log(ETHmaxSupply);
  Logger.log(sushiImpact.onePercentOfPoolsCombined)



  // j = JSON.parse(data)
  // Logger.log(j.fund);
  var sheet = SpreadsheetApp.getActiveSheet();

  // sheet.getRange(5,3).setValue([ethPrice]);
  // sheet.getRange(6,3).setValue([btcPrice]);

  sheet.getRange(5,4).setValue([ETHFLI_Price]);
  sheet.getRange(6,4).setValue([BTCFLI_Price]);

  sheet.getRange(5,5).setValue([ETHFLI_CurrentLeverageRatio_Float]);
  sheet.getRange(6,5).setValue([BTCFLI_CurrentLeverageRatio_Float]);

  sheet.getRange(5,6).setValue([ETHFLI_TokenSupply]);
  sheet.getRange(6,6).setValue([BTCFLI_TokenSupply]);

  sheet.getRange(5,15).setValue([ETHmaxSupply]);
  sheet.getRange(6,15).setValue([BTCmaxSupply]);

  sheet.getRange(5,14).setValue([ETHuniv3MaxTradeSize]);
  sheet.getRange(6,14).setValue([BTCuniv3MaxTradeSize]);


  sheet.getRange(5,16).setValue([ETHAMMSplitterMaxTradeSize]);
  sheet.getRange(6,16).setValue([BTCAMMSplitterMaxTradeSize]);

  sheet.getRange(5,9).setValue([sushiImpact.onePercentOfPoolsCombined]);
  sheet.getRange(5,10).setValue([univ2Impact.onePercentOfPoolsCombined]);

  sheet.getRange(6,9).setValue([bTCsushiImpact.onePercentOfPoolsCombined]);
  sheet.getRange(6,10).setValue([bTCuniv2Impact.onePercentOfPoolsCombined]);

  sheet.getRange(5,11).setValue([v3PI]);
  sheet.getRange(6,11).setValue([btcv3PI]);

}

function eth_call(payload){

infura_url = "https://mainnet.infura.io/v3/key"

var options = {
'method' : 'post',
'contentType': 'application/json',
// Convert the JavaScript object to a JSON string.
'payload' : JSON.stringify(payload)
};

var response = UrlFetchApp.fetch(infura_url,options) 
json = JSON.parse(response)
// Logger.log(json)

result = json.result
// Logger.log(result)

return(result)


}

function getTotalSupply(payload){

hex_result = payload.substring(result.length-20,result.length)
// Logger.log(hex_result)

decimal_result = parseInt(hex_result, 16);
// Logger.log(decimal_result)

totalSupply = decimal_result * 1e-18
// Logger.log(totalSupply)

return(totalSupply)


}


function getETHMaxTradeSize(payload){

  removeChars = payload.substring(2)

  items = (removeChars.match(/.{1,64}/g))

  maxTradeSize = items[1]

  decimal_result = parseInt(maxTradeSize, 16);
// Logger.log(decimal_result)

lastThing = decimal_result * 1e-18
// Logger.log(lastThing)

return lastThing

}

function getBTCMaxTradeSize(payload){

  removeChars = payload.substring(2)

  items = (removeChars.match(/.{1,64}/g))

  maxTradeSize = items[1]

  decimal_result = parseInt(maxTradeSize, 16);
// Logger.log(decimal_result)

lastThing = decimal_result * 1e-8
// Logger.log(lastThing)

return lastThing

}


function getETHPrice(){

var url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
var response = UrlFetchApp.fetch(url);
var json = JSON.parse(response)
// Logger.log(json)
// Logger.log(json.ethereum.usd)
return json.ethereum.usd

}

function getBTCPrice(){

var url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
var response = UrlFetchApp.fetch(url);
var json = JSON.parse(response)
// Logger.log(json)
// Logger.log(json.bitcoin.usd)
return json.bitcoin.usd

}

function teststuff(){

stuff = eth_call(ETH_TOTAL_SUPPLY_PAYLOAD)

stuff2 = eth_call(ETH_MAX_SUPPLY_PAYLOAD)

//   Logger.log(stuff)
// Logger.log(stuff2)

  totalSupply = getTotalSupply(stuff)

  maxSupply = getTotalSupply(stuff2)

//   Logger.log(totalSupply)
// Logger.log(maxSupply)

}

const ETH_MAX_SUPPLY_PAYLOAD = {"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0x8f770ad00000000000000000000000000000000000000000000000000000000000000000","to":"0x0F1171C24B06ADed18d2d23178019A3B256401D3"},"latest"]}

//below payload has the eth fli contract with the totalSupply() ABI Hex
const ETH_TOTAL_SUPPLY_PAYLOAD = {"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0x18160ddd0000000000000000000000000000000000000000000000000000000000000000","to":"0xaa6e8127831c9de45ae56bb1b0d4d4da6e5665bd"},"latest"]}

const ETH_GET_EXCHANGES_PAYLOAD = {"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0xda3904800000000000000000000000000000000000000000000000000000000000000000","to":"0xF6ba6441D4DAc647898F4083483AA44Da8B1446f"},"latest"]}

const ETH_GET_AMMSplitterExchangeAdapter_SETTINGS_PAYLOAD = {"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0x1997789a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001a414d4d53706c697474657245786368616e676541646170746572000000000000","to":"0xF6ba6441D4DAc647898F4083483AA44Da8B1446f"},"latest"]}

const ETH_GET_SushiswapExchangeAdapter_SETTINGS_PAYLOAD = {"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0x1997789a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001853757368697377617045786368616e6765416461707465720000000000000000","to":"0xF6ba6441D4DAc647898F4083483AA44Da8B1446f"},"latest"]}

const ETH_GET_UniswapV3ExchangeAdapter_SETTINGS_PAYLOAD = {"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0x1997789a00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000018556e6973776170563345786368616e6765416461707465720000000000000000","to":"0xF6ba6441D4DAc647898F4083483AA44Da8B1446f"},"latest"]}

const BTC_MAX_SUPPLY_PAYLOAD = {"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0x8f770ad00000000000000000000000000000000000000000000000000000000000000000","to":"0x6C8137F2F552F569CC43BC4642afbe052a12441C"},"latest"]}

//below payload has the eth fli contract with the totalSupply() ABI Hex
const BTC_TOTAL_SUPPLY_PAYLOAD = {"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0x18160ddd0000000000000000000000000000000000000000000000000000000000000000","to":"0x0B498ff89709d3838a063f1dFA463091F9801c2b"},"latest"]}

const BTC_GET_EXCHANGES_PAYLOAD = {"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0xda3904800000000000000000000000000000000000000000000000000000000000000000","to":"0xF6ba6441D4DAc647898F4083483AA44Da8B1446f"},"latest"]}

const BTC_GET_AMMSplitterExchangeAdapter_SETTINGS_PAYLOAD = {"jsonrpc":"2.0","id":2,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0x1997789a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001a414d4d53706c697474657245786368616e676541646170746572000000000000","to":"0x2612fa1e336cb248ee00efd02f1c941a7a015e76"},"latest"]}

const BTC_GET_SushiswapExchangeAdapter_SETTINGS_PAYLOAD = {"jsonrpc":"2.0","id":5,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0x1997789a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001853757368697377617045786368616e6765416461707465720000000000000000","to":"0x2612fa1e336cb248ee00efd02f1c941a7a015e76"},"latest"]}

const BTC_GET_UniswapV3ExchangeAdapter_SETTINGS_PAYLOAD = {"jsonrpc":"2.0","id":4,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0x1997789a00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000018556e6973776170563345786368616e6765416461707465720000000000000000","to":"0x2612fa1e336cb248ee00efd02f1c941a7a015e76"},"latest"]}


function setAPIETH(){
  
  // Call the Tokensets API
  var response = UrlFetchApp.fetch("https://api.tokensets.com/v2/funds/ethfli");
  
  // Logger.log(response.getContentText());
  return response.getContentText()

}

function setAPIBTC(){
  
  // Call the Tokensets API

  var response = UrlFetchApp.fetch("https://api.tokensets.com/v2/funds/btcfli");
  
  // Logger.log(response.getContentText());
  return response.getContentText()

}

// resources 

// https://blog.infura.io/ethereum-rpcs-methods/
// https://infura.io/docs/ethereum/json-rpc/eth-call
// https://docs.soliditylang.org/en/develop/abi-spec.html
// https://emn178.github.io/online-tools/keccak_256.html
// https://www.rapidtables.com/convert/number/decimal-to-hex.html
// https://www.rapidtables.com/convert/number/hex-to-decimal.html
// http://string-functions.com/hex-string.aspx
// https://onlinestringtools.com/convert-string-to-bytes
// https://wordcounter.net/character-count


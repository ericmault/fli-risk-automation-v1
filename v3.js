
const uniV3Payload = { 
url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', 
query: `{
  swaps(first: 20, where: {pool: "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8", amount1_gt: "800"}, orderDirection: desc, orderBy: timestamp) {
    id
    amount0
    amount1
    amountUSD
    token0 {
      name
    }
    token1 {
      name
    }
    sqrtPriceX96
    timestamp
  }
}`
};

const btcuniV3Payload = { 
url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', 
query: `{
  swaps(first: 20, where: {pool: "0x99ac8ca7087fa4a2a1fb6357269965a2014abc35", amount0_gt: "20"}, orderDirection: desc, orderBy: timestamp) {
    id
    amount0
    amount1
    amountUSD
    token0 {
      name
    }
    token1 {
      name
    }
    sqrtPriceX96
    timestamp
  }
}`
};



function fetchData(exchangeData) {
  let parsed = exchangeData
  // Logger.log(`${parsed.query} ${parsed.url}`)
  
  const res = UrlFetchApp.fetch(parsed.url, {'method': 'POST',
  payload: JSON.stringify({query: `query ${parsed.query}`})})
  const parsedResponse = JSON.parse(res)
  // Logger.log(parsedResponse)
  return parsedResponse.data
  };

// Logger.log(uniV3Payload)
// Logger.log(fetchData(uniV3Payload))


function ethv3PriceImpact(graphResponse){
  var pricePaid = [];
  var sqrtPricesConverted = [];
  var averagePi = 0;
  var testObj = [];
  var swapsObj = graphResponse;
  // Logger.log(swaps)
  // ob.data.pairDayDatas.forEach(element => Logger.log(element))
  // Logger.log("----")
  // swapsObj.forEach(element => pricePaid.push(Math.abs(element.amount0) / Math.abs(element.amount1)));
  // swapsObj.forEach(element => sqrtPricesConverted.push(1/ (Math.pow(element.sqrtPriceX96,2) * Math.pow(10,-12) / Math.pow(2,192)) ));
  // pricePaid.forEach(element => Logger.log(element))
  // sqrtPricesConverted.forEach(element => Logger.log(element))

  swapsObj.forEach(element => 
    testObj.push(
      {"amount1":element.amount1,"pricePaid": Math.abs(element.amount0) / Math.abs(element.amount1),"timestamp": element.timestamp, "sqrtPricesReadable":(1/ (Math.pow(element.sqrtPriceX96,2) * Math.pow(10,-12) / Math.pow(2,192))),"priceImpact": (Math.abs(element.amount0) / Math.abs(element.amount1)) / ((1/ (Math.pow(element.sqrtPriceX96,2) * Math.pow(10,-12) / Math.pow(2,192)))) }
    
    ));

  // Logger.log(testObj);


    var total = 0;
  for(var i = 0; i < testObj.length; i++) {
      total += testObj[i].priceImpact;
      averagePi = testObj[i].amount1/testObj[i].priceImpact
  }
  var avg = total / testObj.length;

  // Logger.log(total);
  // Logger.log(avg);
  // Logger.log(averagePi);

  return(averagePi);
}

function btcv3PriceImpact(graphResponse){
  var pricePaid = [];
  var sqrtPricesConverted = [];
  var averagePi = 0;
  var testObj = [];
  var swapsObj = graphResponse;
  // Logger.log(swaps)
  // ob.data.pairDayDatas.forEach(element => Logger.log(element))
  // Logger.log("----")
  // swapsObj.forEach(element => pricePaid.push(Math.abs(element.amount0) / Math.abs(element.amount1)));
  // swapsObj.forEach(element => sqrtPricesConverted.push(1/ (Math.pow(element.sqrtPriceX96,2) * Math.pow(10,-12) / Math.pow(2,192)) ));
  // pricePaid.forEach(element => Logger.log(element))
  // sqrtPricesConverted.forEach(element => Logger.log(element))

  swapsObj.forEach(element => 
    testObj.push(
      {"amount0":element.amount0,"pricePaid": Math.abs(element.amount1) / Math.abs(element.amount0),"timestamp": element.timestamp, "sqrtPricesReadable":((Math.pow(element.sqrtPriceX96,2) * Math.pow(10,2) / Math.pow(2,192))),"priceImpact": (Math.abs(element.amount1) / Math.abs(element.amount0)) / (((Math.pow(element.sqrtPriceX96,2) * Math.pow(10,2) / Math.pow(2,192)))) }
    
    ));

  // Logger.log(testObj);


    var total = 0;
  for(var i = 0; i < testObj.length; i++) {
      total += testObj[i].priceImpact;
      averagePi = testObj[i].amount0/testObj[i].priceImpact
  }
  var avg = total / testObj.length;

  // Logger.log(total);
  // Logger.log(avg);
  // Logger.log(averagePi);

  return(averagePi);
}


  var univ3Dataeric = fetchData(uniV3Payload);
  var btcuniv3Dataeric = fetchData(btcuniV3Payload);

  // Logger.log(univ3Data.swaps)
  // // Logger.log(univ3Data.swaps[0])
  // ethv3PriceImpact(univ3Dataeric.swaps);
  // btcv3PriceImpact(btcuniv3Dataeric.swaps);

function m(){
  var univ3Dataeric = fetchData(uniV3Payload);
  var btcuniv3Dataeric = fetchData(btcuniV3Payload);
  
  // Logger.log(btcv3PriceImpact(btcuniv3Dataeric.swaps))
  // Logger.log(univ3Data.swaps[0])
  return(ethv3PriceImpact(univ3Dataeric.swaps));

}

const v3PI = ethv3PriceImpact(univ3Dataeric.swaps)
const btcv3PI = btcv3PriceImpact(btcuniv3Dataeric.swaps)



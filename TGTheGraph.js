const dogApiUrl = 'https://dog.ceo/api/breeds/image/random';
const v2Url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
const url = 'muteHttpExceptions'
const GRAPH_KEY ="0db920fba7c27f6be99321ab95fd5e05";
const v3SubgraphId = `0x9bde7bf4d5b13ef94373ced7c8ee0be59735a298-2`;
const baseUrl = `https://gateway.thegraph.com/api/${GRAPH_KEY}/subgraphs/id/`;
const exchangeInformation = {
  v3: {
    url: `${baseUrl}${v3SubgraphId}`,

  }
}
const API_KEY = "0db920fba7c27f6be99321ab95fd5e05";
const api = `https://gateway.thegraph.com/api/${API_KEY}/subgraphs/id/0x9bde7bf4d5b13ef94373ced7c8ee0be59735a298-2`


const createDate = timestamp => new Date(timestamp * 1000).toString();
const dexApiObject = {
  v2: {
url: v2Url, 
query: `{
  pairDayDatas(
    first:90
    where:{
      date_gte: 1620552800
      pairAddress:
    "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"
  }) {
      date
      reserve1
 	    token0 {
      symbol
       totalSupply
       totalLiquidity
    }
    token1 {
      symbol
      totalSupply
     totalLiquidity
    }
    dailyVolumeToken0
    dailyVolumeToken1
    totalSupply
	}
}`},
v3:{ 
url: api, 
query: `{
  poolDayDatas(
   where: 
    {
      liquidity_gt:0
   		pool_in: ["0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"]} 
      first:90
      orderDirection:desc
      orderBy:date
  ) {
   date
   tick
   token1Price
   volumeToken1
   }
 }`
},
sushi: {
 url: `https://api.thegraph.com/subgraphs/name/sushiswap/exchange`,
  query: `{
  pairDayDatas(
    first:90
    orderBy:date
    orderDirection: desc
    where:{
      pair:
    "0x397ff1542f962076d0bfe58ea045ffa2d347aca0"
  }) {
      date
      reserve0
      reserve1
	}
}`
},bTCv2: {
url: v2Url, 
query: `{
  pairDayDatas(
    first:90
    where:{
      date_gte: 1620552800
      pairAddress:
    "0x004375dff511095cc5a197a54140a24efef3a416"
  }) {
      date
      reserve1
 	    token0 {
      symbol
       totalSupply
       totalLiquidity
    }
    token1 {
      symbol
      totalSupply
     totalLiquidity
    }
    dailyVolumeToken0
    dailyVolumeToken1
    totalSupply
	}
}`},bTCsushi: {
 url: `https://api.thegraph.com/subgraphs/name/sushiswap/exchange`,
  query: `{
  pairDayDatas(
    first:90
    orderBy:date
    orderDirection: desc
    where:{
      pair:
    "0x784178d58b641a4febf8d477a6abd28504273132"
  }) {
      date
      reserve0
      reserve1
	}
}`
}}

function fetchData(exchangeData) {
  let parsed = JSON.parse(exchangeData)
  // Logger.log(`${parsed.query} ${parsed.url}`)
  

  
  const res = UrlFetchApp.fetch(parsed.url, {'method': 'POST',
   payload: JSON.stringify({query: `query ${parsed.query}`})})
  const parsedResponse = JSON.parse(res)
  // Logger.log(parsedResponse)
  return parsedResponse.data
  }

fetchData(JSON.stringify(dexApiObject.v3));

function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}



// const d = fetchData(JSON.stringify(dexApiObject.v2))
const sushiData = fetchData(JSON.stringify(dexApiObject.sushi))
const univ2Data = fetchData(JSON.stringify(dexApiObject.v2))
const bTCsushiData = fetchData(JSON.stringify(dexApiObject.bTCsushi))
const bTCuniv2Data = fetchData(JSON.stringify(dexApiObject.bTCv2))
const univ3Data = fetchData(JSON.stringify(dexApiObject.v3))


const add =x => y => x +y;


const trace = label => val => {
  //Logger.log(`${label}::`, val)
  return val
}

const getReserveData = (arr)=> {
  return arr.map(x => 
    ({
    date: x.date,
    token0: x.token0,
    length: arr.length,
    reserveOfEth: toFixed(x.reserve1)
 })) //?
 .map(x => ({
    ...x,
    onePercentOfReserve: x.reserveOfEth / 100    
 })).map(x => {
  //  Logger.log( x); 
   return x})
 }


const calculatePriceImpactAvg = (array) => array.reduce((acc,val, index) => {
    const accumulatedObject = {
        length: val.length,
        onePercentOfPoolsCombined: !acc.onePercentOfReserve ? val.onePercentOfReserve : acc.priceImpactAvg + val.onePercentOfReserve,
        avgPriceImpact: acc.onePercentOfPoolsCombined && acc.onePercentOfPoolsCombined / acc.length
    }
    return accumulatedObject
})

// // TODO: Get the data from below into the google sheet
const sushiImpact = calculatePriceImpactAvg(getReserveData(sushiData.pairDayDatas))
const univ2Impact = calculatePriceImpactAvg(getReserveData(univ2Data.pairDayDatas))
const bTCsushiImpact = calculatePriceImpactAvg(getReserveData(bTCsushiData.pairDayDatas))
const bTCuniv2Impact = calculatePriceImpactAvg(getReserveData(bTCuniv2Data.pairDayDatas))

// // TG: Commenting this out as I need to finish this price impact calculation.
// // const univ3Impact = calculatePriceImpactAvg(getReserveData(univ3Data))

// Logger.log("###sushi impact####")
// Logger.log(sushiImpact)
// Logger.log("###sushi impact####")
// Logger.log("###univ2 impact####")
// Logger.log(univ2Impact)
// Logger.log("###univ2 impact####")

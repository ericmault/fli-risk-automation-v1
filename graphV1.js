


// const v2Url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
// const url = 'muteHttpExceptions'
// const TEST_API_KEY ="a8806c9667912df4bfd4bc99ec7847ff";
// const v3Url = `https://gateway.thegraph.com/api/${TEST_API_KEY}/subgraphs/id/0x9bde7bf4d5b13ef94373ced7c8ee0be59735a298-2`;
// const sushiURL = 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange'

// // Because payload is a JavaScript object, it is interpreted as
// // as form data. (No need to specify contentType; it automatically
// // defaults to either 'application/x-www-form-urlencoded'
// // or 'multipart/form-data')

// /**
//  *  "first:20" for testing/inspection purposes
//  * 
//  */
// const queryStrings = {v2Short: {
// url: v2Url, 
// query: `{
//   pairDayDatas(
//     first:5,
//     orderBy:date,
//     orderDirection: desc
//     where:{
//       pairAddress:
//     "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"
//   }) {
//       date
//       reserve0
//       reserve1
//  	    token0 {
//       symbol

//     }
//     token1 {
//       symbol

//     }
// 	}
// }`},
// bTCv2: {
// url: v2Url, 
// query: `{
//   pairDayDatas(
//     first:5,
//     orderBy:date,
//     orderDirection: desc
//     where:{
//       pairAddress:
//     "0x004375dff511095cc5a197a54140a24efef3a416"
//   }) {
//       date
//       reserve0
//       reserve1
//  	    token0 {
//       symbol
//        totalSupply
//        totalLiquidity
//     }
//     token1 {
//       symbol
//       totalSupply
//      totalLiquidity
//     }
//     dailyVolumeToken0
//     dailyVolumeToken1
//     totalSupply
// 	}
// }`},
// v2: {
// url: v2Url, 
// query: `{
//   pairDayDatas(
//     first:5
//     where:{
//       date_gte: 1620552800
//       pairAddress:
//     "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"
//   }) {
//       date
//       reserve0
//       reserve1
//  	    token0 {
//       symbol
//        totalSupply
//        totalLiquidity
//     }
//     token1 {
//       symbol
//       totalSupply
//      totalLiquidity
//     }
//     dailyVolumeToken0
//     dailyVolumeToken1
//     totalSupply
// 	}
// }`},
// v3:{ 
// url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', 
// query:`{
//   poolDayDatas(
//    where: {
//    liquidity_gt:0
//    pool_in:
//    ["0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"]})
//  {
//    date
//    liquidity
//    token0Price
//    token1Price
//    pool {
//     token0 {
//      name
//      symbol
//      totalSupply
//      volumeUSD
//    }
//        token1 {
//      name
//      symbol
//      totalSupply
//      volumeUSD
//    }
//    }
//    }
//  }`,
// },sushiShort: {
//   url: `https://api.thegraph.com/subgraphs/name/sushiswap/exchange`,
//   query: `{
//   pairDayDatas(
//     first:5,
//     orderBy:date,
//     orderDirection: desc
//     where:{
//       pair:
//     "0x397ff1542f962076d0bfe58ea045ffa2d347aca0"
//   }) {
//       date
//       reserve0
//       reserve1
//  	    token0 {
//       symbol

//     }
//     token1 {
//       symbol

//     }
// 	}
// }`
// },
// sushi: {
//   url: `https://gateway.thegraph.com/api/${TEST_API_KEY}/subgraphs/id/0x4bb4c1b0745ef7b4642feeccd0740dec417ca0a0-0`,
//   query: `pairDayDatas(where:
//   {
//   pair:"0x397ff1542f962076d0bfe58ea045ffa2d347aca0"},
//   orderDirection: asc
//   first: 20
// ){
//   id
//   pair{
//     token0Price
//     token1Price
//   }
//   date 
//   token0{
//     id
//     symbol
//     totalSupply
//   }
//     token1{
//     id
//       symbol
//   }
// }`
// }
// }

// function fetchData(exchangeData) {
//   let parsed = JSON.parse(exchangeData)
// const res = UrlFetchApp.fetch(parsed.url, {'method': 'POST', payload: JSON.stringify({query: `query ${parsed.query}`})})
// Logger.log(`Logging data from url::${parsed.url}`)
// Logger.log(res)
//   return res
// }
// // fetchData(JSON.stringify(queryStrings.v3)) 
// // fetchData(JSON.stringify(queryStrings.v2Short))
// takeAverage(fetchData(JSON.stringify(queryStrings.v2)))
// fetchData(JSON.stringify(queryStrings.sushiShort))
// takeAverage(fetchData(JSON.stringify(queryStrings.sushiShort)))
// btctakeAverage(fetchData(JSON.stringify(queryStrings.bTCv2)))

// function takeAverage(graphResponse){
//   var reserves = []
//   var sum = 0
//   var average = 0
//   var jsonObj = JSON.parse(graphResponse)
//   // Logger.log(jsonObj)
//   // Logger.log("break")
//   // Logger.log(jsonObj.data)
//   // Logger.log(jsonObj.data.pairDayDatas)
//   // Logger.log(jsonObj.data.pairDayDatas.length)
//   // Logger.log(jsonObj.data.pairDayDatas[0])
//   // Logger.log(jsonObj.data.pairDayDatas[1])
//   // Logger.log(jsonObj.data.pairDayDatas[2])
//   // Logger.log(jsonObj.data.pairDayDatas[2].reserve0)
//   // array1.forEach(element => console.log(element));
//   // ob.data.pairDayDatas.forEach(element => Logger.log(element))
//   jsonObj.data.pairDayDatas.forEach(element => reserves.push(element.reserve1/100))
//   reserves.forEach(element => Logger.log(element))
//   reserves.forEach(element => ((sum += element))/reserves.length)
//   Logger.log(sum)
//   average = sum/jsonObj.data.pairDayDatas.length
//   Logger.log(average)
//   return(average)
// }

// function btctakeAverage(graphResponse){
//   var reserves = []
//   var sum = 0
//   var average = 0
//   var jsonObj = JSON.parse(graphResponse)
//   // Logger.log(jsonObj)
//   // Logger.log("break")
//   // Logger.log(jsonObj.data)
//   // Logger.log(jsonObj.data.pairDayDatas)
//   // Logger.log(jsonObj.data.pairDayDatas.length)
//   // Logger.log(jsonObj.data.pairDayDatas[0])
//   // Logger.log(jsonObj.data.pairDayDatas[1])
//   // Logger.log(jsonObj.data.pairDayDatas[2])
//   // Logger.log(jsonObj.data.pairDayDatas[2].reserve0)
//   // array1.forEach(element => console.log(element));
//   // ob.data.pairDayDatas.forEach(element => Logger.log(element))
//   jsonObj.data.pairDayDatas.forEach(element => reserves.push(element.reserve0/100))
//   reserves.forEach(element => Logger.log(element))
//   reserves.forEach(element => ((sum += element))/reserves.length)
//   Logger.log(sum)
//   average = sum/jsonObj.data.pairDayDatas.length
//   Logger.log(average)
//   return(average)
// }



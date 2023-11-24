require('dotenv').config();
let encryptedSummonerId = '';
let puuid = '';

//encryptedSummonerId, puuid 가져오기: SUMMONER-V4
//https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summonerName}
function getEncryptedSummonerId(lol_nickname) {
  lol_nickname = encodeURIComponent(lol_nickname);
  const api =
    'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' +
    lol_nickname +
    '?api_key=' +
    process.env.RIOT_API;

  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      encryptedSummonerId = data.id;
      puuid = data.puuid;
      //getRankInformation(encryptedSummonerId);
      getRecentTenMatch(puuid);
    })
    .catch((error) => {
      console.log(error);
    });
  //console.log(rankInformation);
}

//반환받은 encryptedSummonerId 이용해서 랭크 정보 가져오기: LEAGUE-V4
//https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/{encryptedSummonerId}
function getRankInformation(encryptedSummonerId) {
  let rankInformation = [];
  const api =
    'https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/' +
    encryptedSummonerId +
    '?api_key=' +
    process.env.RIOT_API;

  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].queueType === 'RANKED_FLEX_SR') data[i].queueType = '자랭';
        else if (data[i].queueType === 'RANKED_SOLO_5x5')
          data[i].queueType = '솔랭';
        if (
          data[i].tier === 'MASTER' ||
          data[i].tier === 'GRANDMASTER' ||
          data[i].tier === 'CHALLENGER'
        )
          data[i].rank = '';
        let oneRankInfo =
          data[i].summonerName +
          ': ' +
          data[i].queueType +
          ' ' +
          data[i].tier +
          ' ' +
          data[i].rank +
          ' ' +
          String(data[i].wins) +
          '승 ' +
          String(data[i].losses) +
          '패, 승률 ' +
          ((data[i].wins * 100) / (data[i].wins + data[i].losses)).toFixed(1) +
          '%';
        rankInformation.push(oneRankInfo);
      }
      console.log(rankInformation);
    })
    .catch((error) => {
      console.log(error);
    });
}

//반환받은 puuid 이용해서 최근 5게임의 game id 가져오기: MATCH-V5-1
//https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=10&api_key=
function getRecentTenMatch(puuid) {
  const api =
    'https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/' +
    puuid +
    '/ids?start=0&count=5&api_key=' +
    process.env.RIOT_API;

  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        getMatchDetailInfo(data[i]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

getEncryptedSummonerId('아오 플쌤');

//각 게임 id 이용해서 해당 게임 정보 가져오기: MATCH-V5-2
//https://asia.api.riotgames.com/lol/match/v5/matches/{matchId}&api_key=
function getMatchDetailInfo(matchId) {
  const api =
    'https://asia.api.riotgames.com/lol/match/v5/matches/' +
    puuid +
    '&api_key=' +
    process.env.RIOT_API;

  fetch(api)
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {
      console.log(error);
    });
}

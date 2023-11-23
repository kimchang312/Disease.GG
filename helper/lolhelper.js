const env = require('dotenv');
let encryptedSummonerId = '';
let puuid = '';

//encryptedSummonerId 가져오기: SUMMONER-V4
//https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summonerName}
function getEncryptedSummonerId(lol_nickname) {
  const api =
    'kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' +
    lol_nickname +
    '?api_key=' +
    process.env.RIOT_API;

  try {
  } catch (error) {
    console.error(error);
    return;
  }
}

//반환받은 encryptedSummonerId 이용해서 랭크 정보 가져오기: LEAGUE-V4
//https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/{encryptedSummonerId}

//반환받은 puuId 이용해서 최근 20게임의 game id 가져오기: MATCH-V5-1
//https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}

//각 게임 id 이용해서 해당 게임 정보 가져오기: MATCH-V5-2
//https://asia.api.riotgames.com/lol/match/v5/matches/{matchId}

require('dotenv').config();
let encryptedSummonerId = '';
let puuid = '';
let rankInformation = [];
let gameInformation = [];

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
      getRecentMatch(puuid);
    })
    .catch((error) => {
      console.log(error);
    });
}

//반환받은 encryptedSummonerId 이용해서 랭크 정보 가져오기: LEAGUE-V4
//https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/{encryptedSummonerId}
function getRankInformation(encryptedSummonerId) {
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
        let oneRankInfo = {
          summonerName: data[i].summonerName,
          queueType: data[i].queueType,
          tier: data[i].tier,
          rank: data[i].rank,
          point: data[i].leaguePoints,
          wins: data[i].wins,
          losses: data[i].losses,
          ratio: (
            (data[i].wins * 100) /
            (data[i].wins + data[i].losses)
          ).toFixed(1),
        };
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
function getRecentMatch(puuid) {
  const api =
    'https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/' +
    puuid +
    '/ids?start=0&count=2&api_key=' +
    process.env.RIOT_API;

  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        getMatchDetailInfo(data[i], puuid);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//각 게임 id 이용해서 해당 게임 정보 가져오기: MATCH-V5-2
//https://asia.api.riotgames.com/lol/match/v5/matches/{matchId}&api_key=
function getMatchDetailInfo(matchId, puuid) {
  const api =
    'https://asia.api.riotgames.com/lol/match/v5/matches/' +
    matchId +
    '?api_key=' +
    process.env.RIOT_API;

  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      const date = new Date(data.info.gameCreation);
      const formattedDate = date.toLocaleDateString('ko-KR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }); //timestamp 가공
      console.log(formattedDate);
      const durationMin = Math.floor(data.info.gameDuration / 60);
      const durationSec = data.info.gameDuration % 60; // 게임 시간 가공
      let playerList = [];
      let myWin = 'true';
      let myChampion = '';
      let myKill = 0;
      let myDeath = 0;
      let myAssist = 0;
      for (let i = 0; i < data.info.participants.length; i++) {
        if (puuid === data.info.participants[i].puuid) {
          myWin = data.info.participants[i].win;
          myChampion = data.info.participants[i].championName;
          myKill = data.info.participants[i].kills;
          myDeath = data.info.participants[i].deaths;
          myAssist = data.info.participants[i].assists;
        }
        playerList.push(
          data.info.participants[i].riotIdGameName +
            ' #' +
            data.info.participants[i].riotIdTagline,
        );
      }
      let oneGameInfo = {
        gameMode: data.info.gameMode,
        gameType: data.info.gameType,
        gameCreation: formattedDate,
        gameDuration: String(durationMin) + '분 ' + String(durationSec) + '초',
        //winTeams: winTeam,
        playerList: playerList,
        myWin: myWin,
        myChampion: myChampion,
        myKill: myKill,
        myDeath: myDeath,
        myAssist: myAssist,
      };
      gameInformation.push(oneGameInfo);
      console.log(gameInformation);
    })
    .catch((error) => {
      console.log(error);
    });
}

getEncryptedSummonerId('아오 플쌤');

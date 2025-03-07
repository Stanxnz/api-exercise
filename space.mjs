import fetch from 'node-fetch';

const SOLAR_API = "https://api.le-systeme-solaire.net/rest/";
const playerId = "stanv@uia.no";
const GAME_API = "https://spacescavanger.onrender.com/";

(async function() {
    try {
      const startResponse = await fetch(`${GAME_API}start?player=${encodeURIComponent(playerId)}`);
      const startData = await startResponse.json();
      console.log("Challenge started:", startData);
  
      const earthResponse = await fetch(`${SOLAR_API}bodies/earth`);
      const earthData = await earthResponse.json();
      console.log("Earth data:", earthData);
  
      const answerResponse = await fetch(`${GAME_API}answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, player: playerId })
      });
      const answerResult = await answerResponse.json();
      console.log("Submission result:", answerResult);
      
    } catch (error) {
      console.error("Error:", error);
    }
  })();
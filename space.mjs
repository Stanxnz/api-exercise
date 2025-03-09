import fetch from 'node-fetch';

const SOLAR_API = "https://api.le-systeme-solaire.net/rest/";
const playerId = "stanv@uia.no";
const GAME_API = "https://spacescavanger.onrender.com/";

(async function() {
    try {
      const startUrl = `${GAME_API}start?player=${encodeURIComponent(playerId)}`;
      const startResponse = await fetch(startUrl);
      const startData = await startResponse.json();
      console.log("Challenge started:", startData);
  
      const earthResponse = await fetch(`${SOLAR_API}bodies/terre`);
      const earthData = await earthResponse.json();
      console.log("Earth data:", earthData);

      const sunResponse = await fetch(`${SOLAR_API}bodies/soleil`);
      const sunData = await sunResponse.json();
      console.log("Sun data:", sunData);

      const diffBetweenEquatorialAndMeanRadius = sunData.equaRadius - sunData.meanRadius;
      console.log("Difference between the equatorial and mean radius:", diffBetweenEquatorialAndMeanRadius);

      const answer = diffBetweenEquatorialAndMeanRadius;
  
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
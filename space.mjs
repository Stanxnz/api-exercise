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

      const earthAxialTilt = earthData.axialTilt;
      console.log("Earth axial tilt:", earthAxialTilt);

      async function findClosestPlanetByAxialTilt(targetTilt) {
  
        const bodiesResponse = await fetch(`${SOLAR_API}bodies`);
        const bodiesData = await bodiesResponse.json();

        const planets = bodiesData.bodies.filter(body => body.isPlanet);

        let closestAxialTilt = null;
        let smallestDiff = Infinity;
        for (const planet of planets) {
          if (planet.id === "terre") continue;
      
          const diff = Math.abs(planet.axialTilt - targetTilt);
          if (diff < smallestDiff) {
            smallestDiff = diff;
            closestAxialTilt = planet;
          }
        }
        
        return closestAxialTilt;
      }

      const closestAxialTilt = await findClosestPlanetByAxialTilt(earthAxialTilt);
      if (closestAxialTilt) {
        console.log(`Planet with axial tilt closest to Earth: ${closestAxialTilt.name} (axial tilt: ${closestAxialTilt.axialTilt})`);
      } else {
        console.log("No planet with valid axial tilt data was found.");
      }
  
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
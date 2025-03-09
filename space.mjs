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

      const bodiesResponse = await fetch(`${SOLAR_API}bodies`);
      const bodiesData = await bodiesResponse.json();
      const planets = bodiesData.bodies.filter(body => body.isPlanet);

      async function findClosestPlanetByAxialTilt(targetTilt) {

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

      let shortestDayPlanet = null;
      let minRotation = Infinity;
  
      for (const planet of planets) {

        const rotation = Math.abs(planet.sideralRotation);
  
        if (rotation < minRotation) {
          minRotation = rotation;
          shortestDayPlanet = planet;
        }
      }
  
      console.log( `Planet with the shortest day: ` + `${shortestDayPlanet.name} (day length = ${shortestDayPlanet.sideralRotation} hours)`);

      const jupiterResponse = await fetch(`${SOLAR_API}bodies/jupiter`);
      const jupiterData = await jupiterResponse.json();

      const jupiterMoons = jupiterData.moons || [];
      console.log("Number of Jupiter's known moons:", jupiterMoons.length);

      const moonDetails = await Promise.all(
        jupiterMoons.map(async (moonObj) => {
          try {
            const res = await fetch(moonObj.rel);
            if (!res.ok) {
              console.warn(`Skipping ${moonObj.moon}, fetch returned ${res.status}`);
              return null;
            }
            return await res.json();
          } catch (err) {
            return null;
          }
        })
      );
      
      let largestMoon = null;
      let maxRadius = -Infinity;
      for (const moon of moonDetails) {
        
        if (moon.meanRadius && moon.meanRadius > maxRadius) {
          maxRadius = moon.meanRadius;
          largestMoon = moon;
        }
      }
      console.log(`Largest moon of Jupiter: ${largestMoon.englishName} (meanRadius: ${largestMoon.meanRadius} km)`);

      const plutoResponse = await fetch(`${SOLAR_API}bodies/pluton`);
      const plutoData = await plutoResponse.json();

      const plutoClassification = plutoData.bodyType;
      console.log("Pluto's classification:", plutoClassification);

      const answer2 = closestAxialTilt.name;
      const answer3 = shortestDayPlanet.name;
      const answer4 = jupiterMoons.length;
      const answer5 = largestMoon.englishName;
      const answer6 = plutoClassification

      const answerResponse = await fetch(`${GAME_API}answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, player: playerId })
      });
      const answerResult = await answerResponse.json();
      console.log("Submission result:", answerResult);

      const answer2Response = await fetch(`${GAME_API}answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answer2, player: playerId })
      });
      const answer2Result = await answer2Response.json();
      console.log("Submission result:", answer2Result);

      const answer3Response = await fetch(`${GAME_API}answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answer3, player: playerId })
      });
      const answer3Result = await answer3Response.json();
      console.log("Submission result:", answer3Result);
      
      const answer4Response = await fetch(`${GAME_API}answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answer4, player: playerId })
      });
      const answer4Result = await answer4Response.json();
      console.log("Submission result:", answer4Result);

      const answer5Response = await fetch(`${GAME_API}answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answer5, player: playerId })
      });
      const answer5Result = await answer5Response.json();
      console.log("Submission result:", answer5Result);

      const answer6Response = await fetch(`${GAME_API}answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answer6, player: playerId })
      });
      const answer6Result = await answer6Response.json();
      console.log("Submission result:", answer6Result);
      
    } catch (error) {
      console.error("Error:", error);
    }
  })();
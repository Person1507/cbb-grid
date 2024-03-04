//import puppeteer from "puppeteer";

// const getQuotes = async () => {
//   // Start a Puppeteer session with:
//   // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
//   // - no default viewport (`defaultViewport: null` - website page will in full width and height)
//   const browser = await puppeteer.launch({
//     headless: true,
//     defaultViewport: null,
//   });

//   // Open a new page
//   const page = await browser.newPage();

//   // On this new page:
//   // - open the "http://quotes.toscrape.com/" website
//   // - wait until the dom content is loaded (HTML is ready)
//   await page.goto("https://www.sports-reference.com/cbb/players/dorka-juhasz-1.html", {
//     waitUntil: "domcontentloaded",
//   });

//   // Get page data
//   const stuff = await page.evaluate(() => {
//     // Fetch the first element with class "quote"
//     const totals = document.querySelector("#switcher_players_totals")

//     const stats = totals.querySelectorAll("tr[data-row='5'] .right");

//     return Array.from(stats).map((stat) => {
//         const text = stat.innerText;
//         return text;
//     })
//   });

//   // Display the quotes
//   console.log(stuff);

//   // Close the browser
//   await browser.close();
// };

// // Start the scraping
// getQuotes();

const axios = require('axios');
const cheerio = require('cheerio');

let name = "";
let gender = "";
const schools = [];
const awards = [];
const perGameStats = [];
const careerStats = [];
async function scrapeSite() {
	const url = `https://www.sports-reference.com/cbb/players/andre-jackson-8.html`;
	const { data } = await axios.get(url);
	
	const $ = cheerio.load(data);

    // name
    name = $('div#meta h1').text().trim();

    // schools
    $('div#meta p a').each((i, elem) => {
        const school = $(elem).text();
        if (school.includes('(')) {
            // get gender
            let index = school.indexOf('(');
            gender = school.charAt(index + 1)

            schools.push(school);
        }
    });

    // awards
    $('ul#bling li a').each((i, elem) => {
        const award = $(elem).text();
        awards.push(award);
    });

    // per game stats
    $('table#players_per_game tfoot td.right').each((i, elem) => {
        const stat = $(elem).text();
        perGameStats.push(stat);
	});

    // career stats
	$('table#players_totals tfoot td.right').each((i, elem) => {
        const stat = $(elem).text();
        careerStats.push(stat);
	});
}

scrapeSite().then(result => {
    console.log(name);
    console.log(gender);
    console.log(schools);
    console.log(awards);
    console.log(perGameStats.slice(0, 24));
    console.log(careerStats.slice(0, 24));
}).catch(err => console.log(err));
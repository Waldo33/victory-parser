require("dotenv").config();
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

const URL = process.env.URL;

const fetchData = async (link) => {
  const res = await axios.get(link);
  return res.data;
};

let films = [];
let id = 0;
const chapters = [];

async function parseFilmsInfo(url) {
  try {
    const data = await fetchData(url);
    const $ = cheerio.load(data);

    const next_page = await $(".pager-next").find("a").attr("href");
    const current_page = await $(".pager-current").text();
    console.log(`Current page ${current_page}, ${films.length}`);

    const cards = [];

    $(".views-row").each(function (index, elem) {
      cards[index] = {};

      const $ = cheerio.load(elem);
      const title = $(".views-field-title")
        .find(".field-content")
        .text()
        .trim();
      const href =
        URL +
        $(".views-field-title").find(".field-content").find("a").attr("href");
      const director = $(".views-field-field-director")
        .find(".field-content")
        .text()
        .trim();
      const production = $(".views-field-field-production")
        .find(".field-content")
        .text()
        .trim();
      const operators = $(".views-label-field-operator")
        .find(".field-content")
        .text()
        .trim();
      const archive = $(".views-field-field-archive").text().trim();
      const pressmark = $(".views-field-field-arch-pressmark").text().trim();
      const duration = $(".views-field-field-track-time")
        .find(".field-content")
        .text()
        .trim();
      const img = $("img").attr("src");
      const date = $(".views-field-field-photo-date-1").text().trim();
      id++;

      cards[index] = {
        id,
        title,
        href,
        director,
        production,
        operators,
        archive,
        pressmark,
        duration,
        img,
        date,
      };
    });

    let description, chapter, src, trackTitle;
    for (let index in cards) {
      const videoData = await fetchData(cards[index].href);
      const $$ = cheerio.load(videoData);
      description = $$(".field-name-field-track-description").text().trim();
      chapter = $$(".field-name-field-razdel")
        .find(".field-item")
        .text()
        .trim();
      src = $$("video").attr("src");
      trackTitle = $$(".field-name-field-track-title").text().trim();

      chapters.push(chapter);

      cards[index] = {
        ...cards[index],
        description,
        chapter,
        src,
        trackTitle,
      };
    }

    films = [...films, ...cards];

    if (next_page) {
      await parseFilmsInfo(URL + next_page);
    } else {
      const setChapters = new Array(
        ...new Set(chapters.filter((item) => item))
      );
      console.log(films);
      fs.writeFile(
        "films.json",
        JSON.stringify({ chapters: setChapters, films }),
        (err) => {
          if (err) throw err; // ошибка чтения файла, если есть
          console.log("Данные успешно записаны записать файл");
        }
      );
      console.log(setChapters);
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = parseFilmsInfo;

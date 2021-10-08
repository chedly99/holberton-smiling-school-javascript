$(document).ready(function () {
  /* Quotes carousel configuration */
  const quotesCarouselConfig = {
    url: "https://smileschool-api.hbtn.info/quotes",
    sectionID: "smileschoolcarousel",
    fn(data) {
      displayCarousels(data);
    },
  };

  /* Most Popular Tutorials configuration */
  const mptConfig = {
    url: "https://smileschool-api.hbtn.info/popular-tutorials",
    sectionID: "popular_tutorials-lg",
    fn(data, config) {
      displayCarouselVideos(data, config);
    },
  };

  /* Latest Video Carsouel configuration*/
  const lvConfig = {
    url: "https://smileschool-api.hbtn.info/latest-videos",
    sectionID: "latest-videos-lg",
    fn(data, config) {
      displayCarouselVideos(data, config);
    },
  };

  /* Tutorial Search configuration */
  const tutorialSearch = {
    sectionID: ".courses__results .row",
  };

  /* utilities to join cards*/
  function joinCards(id) {
    $(`#${id} .carousel-item`).each(function () {
      let minPerSlide = 4;
      let next = $(this).next();
      if (!next.length) {
        next = $(this).siblings(":first");
      }
      next.children(":first-child").clone().appendTo($(this));
      for (let i = 0; i < minPerSlide; i++) {
        next = next.next();
        if (!next.length) {
          next = $(this).siblings(":first");
        }
        next.children(":first-child").clone().appendTo($(this));
      }
    });
  }

  /* InnerCarousel component*/
  function innerCarouselComponent(name, title, text, url, active) {
    return $.parseHTML(`<div class="carousel-item ${active}">
      <div class="row w-75 mx-auto d-flex flex-sm-row flex-column justify-content-center align-items-center">
        <div class="col-6 col-lg-3 d-flex justify-content-sm-end justify-content-lg-end justify-content-center">
          <img class="rounded-circle carousel__img" src=${url}>
        </div>
        <div class="col-lg-8 ml-sm-0 carousel-item__text px-lg-5 mr-5 pt-3">
          <p class="mr-lg-5">&laquo; ${text}</p>
          <p class="font-weight-bold">${name}</p>
          <p class="font-italic">${title}</p>
        </div>
      </div>
    </div>`);
  }

  /* Carousel video component*/
  function carouselVideoItem(
    title,
    subtitle,
    author,
    stars,
    active,
    author_pic_url,
    thumb_url,
    duration
  ) {
    let starImage = '<img src="./images/star_on.png" alt=""/>';

    let CxSuper = $(`<div class='carousel-item ${active}'></div>`);
    let CardtoAppend = $.parseHTML(`
    <div class="col-md-3">
        <div class="card">
          <div class=" d-flex align-items-center justify-content-center">
            <img src=${thumb_url} alt="Video thumbnail" class="card-img-top" />
            <img src="./images/play.png" alt="Play icon" class="position-absolute play__icon" />
          </div>
          <div class="card-body">
            <h4 class="card-title font-weight-bold text-left">${title}</h4>
            <p class="card-text text-muted text-left">${subtitle}</p>
            <div class="d-flex align-items-center">
              <div class="mr-3">
                <img src=${author_pic_url} alt="Profile thumbnail" width="30px" class="rounded-circle">
              </div>
              <span class="user__name">${author}</span>
            </div>
            <div class="d-flex mt-2 justify-content-between">
              <div class="rating__stars">
                ${starImage.repeat(stars)}
              </div>
              <span class="duration__video">${duration}</span>
            </div>
          </div>
        </div>
  </div>`);

    let item = $(CxSuper).append(CardtoAppend);
    return item;
  }

  /*Loop through the Array-data and display each slide */
  function displayCarousels(data) {
    const firstCarousel = $(".carousel-inner")[0];
    for (let i = 0; i < data.length; i++) {
      const { pic_url, name, title, text } = data[i];
      $(firstCarousel).append(function () {
        const active = i === 0 ? "active" : "";
        return innerCarouselComponent(name, title, text, pic_url, active);
      });
    }
  }
  /* fetch data and invoke displayCarousel*/
  function fetchPosts(config) {
    const { url, sectionID } = config;
    $.get(url, $(`#${sectionID}`).hide()).done((data) => {
      $(".loader.testim").hide();
      $(`#${sectionID}`).show();
      config.fn(data);
    });
  }

  function fecthCarouselVideos(config) {
    const { url, sectionID } = config;
    $.get(url).done((data) => {
      $(".loader.mpt").hide();
      $(`#${sectionID} .carousel-inner`).show();
      config.fn(data, config);
    });
  }

  fecthCarouselVideos(mptConfig);

  /* INVOKE */

  fetchPosts(quotesCarouselConfig);
  fecthCarouselVideos(lvConfig);

  /* MOST POPULAR TUTORIALS Carousel */

  function displayCarouselVideos(data, config) {
    const { sectionID } = config;
    let x = data.length;
    for (let i = 0; i < x; i++) {
      const { title, author, star, author_pic_url, thumb_url, duration } = data[i];
      $(`#${sectionID} .carousel-inner`).prepend(function () {
        let active = i === 0 ? "active" : "";
        return carouselVideoItem(
          title,
          data[i]["sub-title"],
          author,
          star,
          active,
          author_pic_url,
          thumb_url,
          duration
        );
      });
    }
    joinCards(sectionID);
  }


  /*************************************************** */
  /*************************************************** */
  /**************************************************** */


  const fecthParameters = {
    q: "",
    topic: "all",
    sort: "",
  };


  function fetch(fecthParameters = {}) {
    fecthParameters.topic = $("#topic .btn").text();
    fecthParameters.sort = $("#sort .btn").text().replace(/\s/g, "_");
    $.get("https://smileschool-api.hbtn.info/courses", fecthParameters).done(
      (data) => {
        if ($("#xappend").children().length > 0) {
          $("#xappend").empty();
        }
        displayTuorialsList(data);
      }
    );
  }


  /* Listen to the Input */
  $(".courses__section .x").on("input", function () {
    fecthParameters.q = this.value;
    fetch(fecthParameters);
  });

  /* Set Click event on Options */
  function showSelectedOption(id) {
    fetch();
    $(`#${id} .dropdown-item`).click((e) => {
      $(`#${id} .btn`).html($(e.target).text());
      fetch(fecthParameters);
    });
  }
  showSelectedOption("sort");
  showSelectedOption("topic");

  function listItem(
    title,
    author,
    stars,
    author_pic_url,
    thumb_url,
    duration,
    sub
  ) {
    let starImage = '<img src="./images/star_on.png" alt=""/>';
    return `<div class="card col col-lg-3 col-md-4 col-sm-6 col-12">
  <div class=" d-flex align-items-center justify-content-center">
    <img src=${thumb_url} alt="Video thumbnail" class="card-img-top" />
    <img src="./images/play.png" alt="Play icon" class="position-absolute play__icon" />
  </div>
  <div class="card-body">
    <h4 class="card-title font-weight-bold text-left text-dark">${title}</h4>
    <p class="card-text text-muted text-left">${sub}</p>
    <div class="d-flex align-items-center">
      <div class="mr-3">
        <img src=${author_pic_url} alt="Profile thumbnail" width="30px" class="rounded-circle">
      </div>
      <span class="user__name">Phillip Massey</span>
    </div>
    <div class="d-flex mt-2 justify-content-between">
      <div class="rating__stars">
      ${starImage.repeat(stars)}
      </div>
      <span class="duration__video">${duration}</span>
    </div>
  </div>
</div>`;
  }

  function displayTuorialsList(data) {
    let courses = data.courses;
    courses.forEach((item) => {
      const { title, author, star, author_pic_url, thumb_url, duration } = item;
      $("#xappend").prepend(
        listItem(
          title,
          author,
          star,
          author_pic_url,
          thumb_url,
          duration,
          item["sub-title"]
        )
      );
    });
  }
});

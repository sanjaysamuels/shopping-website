const selectedStar = document.querySelector(".stars");
const stars = document.querySelectorAll(".stars a");

stars.forEach((star, clickedIdx) => {
  star.addEventListener("click", () => {
    selectedStar.classList.add("disabled");
    localStorage.setItem('rating', clickedIdx+1)
    stars.forEach((otherStar, otherIdx) => {
        if (otherIdx <= clickedIdx) {
            otherStar.classList.add("active");
        }
    })
  });
});
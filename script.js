// ========== FOR AUTO UPDATE REPO ==========

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded Successfully");

  const username = "arshkmr";

  const projectsGrid = document.getElementById("projectsGrid");
  const fallbackProject = document.getElementById("fallbackProject");

  console.log("Projects Grid:", projectsGrid);
  console.log("Fallback Card:", fallbackProject);

  loadGithubProjects();

  async function loadGithubProjects() {
    try {
      console.log("Fetching GitHub repos...");

      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
        {
          cache: "no-store",
        },
      );

      console.log("API Status:", response.status);

      const repos = await response.json();

      console.log("All Repos:", repos);

      // old cards remove
      document.querySelectorAll(".project-card").forEach((card) => {
        card.remove();
      });

      // filter repos
      const filteredRepos = repos.filter(
        (repo) =>
          !repo.fork &&
          !repo.name.includes(".github.io") &&
          repo.name !== "arshkmr", // repo to hide
      );

      console.log("Filtered Repos:", filteredRepos);

      if (filteredRepos.length === 0) {
        console.log("No public repos found");
        fallbackProject.style.display = "block";
        return;
      }

      fallbackProject.style.display = "none";

      // render repos
      filteredRepos.forEach((repo) => {
        console.log("Rendering Repo:", repo.name);

        const card = document.createElement("div");

        card.className = "project-card";

        card.innerHTML = `
          <div class="project-top">
            <img
              src="https://raw.githubusercontent.com/${username}/${repo.name}/main/preview.jpg"
              alt="${repo.name}"
              loading="lazy"
              onerror="
                if(!this.dataset.jpg){
                  this.dataset.jpg=1;
                  this.src='https://raw.githubusercontent.com/${username}/${repo.name}/main/preview.png';
                } else if(!this.dataset.png){
                  this.dataset.png=1;
                  this.src='https://raw.githubusercontent.com/${username}/${repo.name}/main/preview.webp';
                } else if(!this.dataset.webp){
                  this.dataset.webp=1;
                  this.src='https://raw.githubusercontent.com/${username}/${repo.name}/main/preview.jpeg';
                } else if(!this.dataset.jpeg){
                  this.dataset.jpeg=1;
                  this.src='https://raw.githubusercontent.com/${username}/${repo.name}/main/preview.svg';
                } else if(!this.dataset.svg){
                  this.dataset.svg=1;
                  this.src='https://raw.githubusercontent.com/${username}/${repo.name}/main/preview.avif';
                } else {
                  this.src='https://placehold.co/600x400?text=No+Preview';
                }
              "
            >
          </div>

          <div class="project-info">
            <h3>${repo.name}</h3>

            <p>
              ${repo.description || "New project uploaded on GitHub."}
            </p>

            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
              View Project
            </a>
          </div>
        `;

        projectsGrid.appendChild(card);
      });

      console.log("Projects Rendered Successfully");
    } catch (err) {
      console.log("GitHub API Error:", err);

      if (fallbackProject) {
        fallbackProject.style.display = "block";
      }
    }
  }

  // ========== AUTO FOOTER YEAR ==========

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  console.log("Footer Year Updated");
});

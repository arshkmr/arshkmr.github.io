// ========== FOR AUTO UPDATE REPO ==========

window.addEventListener("DOMContentLoaded", () => {
  const username = "arshkmr";

  const projectsGrid = document.getElementById("projectsGrid");
  const fallbackProject = document.getElementById("fallbackProject");

  loadGithubProjects();

  async function loadGithubProjects() {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
        {
          cache: "no-store",
        },
      );

      const repos = await response.json();

      // remove old cards
      document.querySelectorAll(".project-card").forEach((card) => {
        card.remove();
      });

      // filter repos
      const filteredRepos = repos.filter(
        (repo) => !repo.fork && !repo.name.includes(".github.io"),
      );

      console.log(filteredRepos);

      // no repo
      if (!filteredRepos.length) {
        fallbackProject.style.display = "block";
        return;
      }

      // hide fallback
      fallbackProject.style.display = "none";

      // render cards
      filteredRepos.forEach((repo) => {
        // IMPORTANT
        const previewImage = `https://raw.githubusercontent.com/${username}/${repo.name}/main/preview.png?v=${Date.now()}`;

        const card = document.createElement("div");

        card.className = "project-card";

        card.innerHTML = `
        
          <div class="project-top">

            <img
              src="${previewImage}"
              alt="${repo.name}"
              loading="lazy"
              onerror="
                this.onerror=null;
                this.src='https://placehold.co/600x400/111/FFF?text=No+Preview';
              "
            >

          </div>

          <div class="project-info">

            <h3>${repo.name}</h3>

            <p>
              ${repo.description || "New project uploaded on GitHub."}
            </p>

            <a href="${repo.html_url}" target="_blank">
              View Project
            </a>

          </div>

        `;

        projectsGrid.appendChild(card);
      });
    } catch (error) {
      console.log(error);

      fallbackProject.style.display = "block";
    }
  }

  // FOOTER YEAR

  document.getElementById("year").textContent = new Date().getFullYear();
});

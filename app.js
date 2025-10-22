// Homework 8 — Advanced JS Interactivity
console.log("HW8 loaded");

// ===== Utilities =====
const $ = (sel, scope=document) => scope.querySelector(sel);
const $$ = (sel, scope=document) => Array.from(scope.querySelectorAll(sel));

// ===== Greeting (time-based) =====
const NAME = "Logan Copelan";
function timeGreeting(userName) {
  const h = new Date().getHours();
  const bucket = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return `${bucket}, my name is ${userName}! Welcome to my portfolio.`;
}
$("#greeting").textContent = timeGreeting(NAME);

// Footer year
$("#year").textContent = new Date().getFullYear();

// ===== Step 1: Accept skills from the user and add to list =====
const defaultSkills = [
  "Java", "Python", "Attention to detail", "Outgoing and friendly", "Hard worker", "Competitive", "Energetic"
];

const skillList = $("#skillList");
const skillInput = $("#skillInput");
const addSkillBtn = $("#addSkillBtn");

function renderSkills(skills) {
  skillList.innerHTML = "";
  skills.forEach((s, i) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `<span>${s}</span>
      <button class="btn btn-sm btn-outline-danger" data-index="${i}" title="Remove">&times;</button>`;
    skillList.appendChild(li);
  });
}
let skills = JSON.parse(localStorage.getItem("skills") || "null") || defaultSkills.slice();
renderSkills(skills);

skillList.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-index]");
  if (!btn) return;
  const idx = Number(btn.dataset.index);
  skills.splice(idx, 1);
  localStorage.setItem("skills", JSON.stringify(skills));
  renderSkills(skills);
});

addSkillBtn.addEventListener("click", () => {
  const val = skillInput.value.trim();
  if (!val) return;
  // prevent duplicates ignoring case
  const exists = skills.some(s => s.toLowerCase() === val.toLowerCase());
  if (exists) {
    alert("That skill is already listed.");
    return;
  }
  skills.push(val);
  localStorage.setItem("skills", JSON.stringify(skills));
  renderSkills(skills);
  skillInput.value = "";
  skillInput.focus();
});

// ===== Step 2 & 3: Projects with arrays, loop & comparator status =====
// Three parallel arrays as required
const projectTitles = [
  "Classroom Tech Helper",
  "Personal Portfolio Revamp",
  "Unity Creature Sandbox"
];
const projectDescriptions = [
  "Scripts to help professors set up/diagnose classroom technology quickly (checklists, QR guides).",
  "Rebuilt portfolio with Bootstrap, accessibility fixes, and automated deploy pipeline.",
  "3D Unity prototype: grow plants to attract/tame animals; save/load basic progression."
];
// Use ISO 8601 strings; some past, some future. Replace dummy dates as needed.
const projectDeadlines = [
  "2025-05-01", // past => Completed
  "2025-12-01", // future => Ongoing
  "2025-10-10"  // past => Completed
];

function projectStatus(isoDate) {
  const today = new Date();
  const d = new Date(isoDate);
  // clear time for an exact date comparison
  today.setHours(0,0,0,0);
  d.setHours(0,0,0,0);
  return d >= today ? "Ongoing" : "Completed";
}

function renderProjects() {
  const wrap = $("#projectCards");
  wrap.innerHTML = "";
  for (let i = 0; i < projectTitles.length; i++) {
    const status = projectStatus(projectDeadlines[i]);
    const card = document.createElement("div");
    card.className = "col-md-4";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title d-flex justify-content-between align-items-start">
            <span>${projectTitles[i]}</span>
            <span class="badge ${status === "Ongoing" ? "bg-warning text-dark" : "bg-success"}">${status}</span>
          </h5>
          <p class="card-text">${projectDescriptions[i]}</p>
          <p class="small text-muted mb-0"><strong>Deadline:</strong> ${projectDeadlines[i]}</p>
        </div>
      </div>
    `;
    wrap.appendChild(card);
  }
}
renderProjects();

// ===== Step 4: Resume download tracker with dynamic count =====
const resumeLink = $("#resumeLink");
const downloadCountEl = $("#downloadCount");
let downloadCount = Number(localStorage.getItem("resumeDownloads") || "0");
downloadCountEl.textContent = downloadCount.toString();

resumeLink.addEventListener("click", () => {
  // increment immediately on click; server download can't be tracked reliably client-side
  downloadCount += 1;
  localStorage.setItem("resumeDownloads", String(downloadCount));
  downloadCountEl.textContent = String(downloadCount);
  // optional user feedback
  setTimeout(() => alert("Your resume is downloaded successfully!"), 300);
});

// ===== Step 5: Dynamically create tables for Experience & Education =====
const experienceData = [
  { role: "Applebee’s Host", org: "Applebee’s", start: "2023-01", end: "2023-06" },
  { role: "Classroom Support", org: "NAU ITS", start: "2024-08", end: "2025-06" },
  { role: "Packout Technician", org: "Velocity", start: "2025-06", end: "Current" }
];

const educationData = [
  { school: "Red Mountain High School", program: "High School Diploma", start: "2020", end: "2024" },
  { school: "Northern Arizona University", program: "B.S. Computer Science (in progress)", start: "2024", end: "Present" }
];

function buildTable(headers, rows) {
  const table = document.createElement("table");
  table.className = "table table-striped align-middle";
  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    trh.appendChild(th);
  });
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rows.forEach(r => {
    const tr = document.createElement("tr");
    r.forEach(c => {
      const td = document.createElement("td");
      td.textContent = c;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

const expWrap = $("#experienceTableWrap");
expWrap.replaceChildren(
  buildTable(
    ["Role", "Company", "Start", "End"],
    experienceData.map(x => [x.role, x.org, x.start, x.end])
  )
);

const eduWrap = $("#educationTableWrap");
eduWrap.replaceChildren(
  buildTable(
    ["School / University", "Program", "Start", "End"],
    educationData.map(x => [x.school, x.program, x.start, x.end])
  )
);

// ===== Bonus: Theme toggle & user style controls =====
const themeToggleBtn = $("#themeToggle");
const fontSizeInput = $("#fontSizeInput");
const bgColorInput = $("#bgColorInput");
const accentColorInput = $("#accentColorInput");
const applyStyleBtn = $("#applyStyleBtn");
const resetStyleBtn = $("#resetStyleBtn");

function applyCustomStyles() {
  const size = Math.max(12, Math.min(24, Number(fontSizeInput.value) || 16));
  document.documentElement.style.setProperty("--base-font-size", size + "px");
  document.documentElement.style.setProperty("--bg-color", bgColorInput.value);
  document.documentElement.style.setProperty("--accent", accentColorInput.value);
  localStorage.setItem("customStyles", JSON.stringify({
    fontSize: size,
    bg: bgColorInput.value,
    accent: accentColorInput.value
  }));
}

applyStyleBtn.addEventListener("click", applyCustomStyles);

resetStyleBtn.addEventListener("click", () => {
  localStorage.removeItem("customStyles");
  document.documentElement.style.removeProperty("--base-font-size");
  document.documentElement.style.removeProperty("--bg-color");
  document.documentElement.style.removeProperty("--accent");
  fontSizeInput.value = 16;
  bgColorInput.value = "#0f2027";
  accentColorInput.value = "#1a73e8";
});

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("theme-dark");
  document.body.classList.toggle("theme-light");
  const active = document.body.classList.contains("theme-dark") ? "dark" : "light";
  localStorage.setItem("theme", active);
});

// Restore saved prefs
(function restorePrefs(){
  const saved = localStorage.getItem("customStyles");
  if (saved) {
    try {
      const { fontSize, bg, accent } = JSON.parse(saved);
      fontSizeInput.value = fontSize;
      bgColorInput.value = bg;
      accentColorInput.value = accent;
      applyCustomStyles();
    } catch {}
  }
  const t = localStorage.getItem("theme");
  if (t) {
    document.body.classList.remove("theme-dark","theme-light");
    document.body.classList.add(t === "dark" ? "theme-dark" : "theme-light");
  }
})();

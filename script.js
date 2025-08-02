// script.js

let currentIndex = null;

function loadProjects() {
	const list = document.getElementById('projectList');
	list.innerHTML = '';
	const projects = JSON.parse(localStorage.getItem('projects') || '[]');

	projects.forEach((proj, index) => {
		const li = document.createElement('li');
		li.innerHTML = `
			<strong>${proj.title}</strong>
			<span style="float: right; font-style: italic;">${proj.lang || "Unknown"}</span><br>
			<em>Category: ${proj.category || 'Uncategorised'}</em><br>
			<br>${proj.desc}<br>
			<div class="progress-container">
				<div class="progress-bar" style="width: ${proj.progress}%"></div>
			</div>
			<small>${proj.progress}% complete</small><br>
			<div class="project-next"><strong>Next task: </strong> ${proj.next || "N/A"}</div>
			<button onclick="deleteProject(${index})">Delete</button>
			<button onclick="showUpdate(${index})">Add Update</button>
			<button onclick="editProject(${index})">Edit Project</button>
			<ul>${(proj.updates || []).map(u => `<li><small>${u.date} - 
				${u.text}</small></li>`).join('')}</ul>
			`;
		list.appendChild(li);
	});
}

function addProject() {
	const title = document.getElementById('title').value;
	const desc = document.getElementById('desc').value;
	const lang = document.getElementById('lang').value;
	const progress = document.getElementById('progress').value;
	const next = document.getElementById('next').value;
	const category = document.getElementById('category').value;
	if (!title) return;

	const projects = JSON.parse(localStorage.getItem('projects') || '[]');
	projects.push({title, desc, lang, progress, next, category, updates: []});
	localStorage.setItem('projects', JSON.stringify(projects));
	loadProjects();


	// Clear fields
	document.getElementById('title').value = '';
	document.getElementById('desc').value = '';
	document.getElementById('lang').value = '';
	document.getElementById('progress').value = 0;
	document.getElementById('progressLabel').innerText = '0%';
	document.getElementById('next').value = '';
}

function deleteProject(index) {
	const projects = JSON.parse(localStorage.getItem('projects') || '[]');
	projects.splice(index, 1);
	localStorage.setItem('projects', JSON.stringify(projects));
	loadProjects();
}

function updateProgressLabel(val) {
	document.getElementById('progressLabel').innerText = val + "%";
}

function showUpdate(index) {
	currentIndex = index;
	document.getElementById('updateNote').value = '';
	document.getElementById('updateModal').style.display = 'flex';
}

function closeUpdateModal() {
	document.getElementById('updateModal').style.display = 'none';
}

function addUpdate() {
	const note = document.getElementById('updateNote').value;
	if (!note || currentIndex === null) return;

	const projects = JSON.parse(localStorage.getItem('projects') || '[]');
	if (!projects[currentIndex]) return;

	if (!projects[currentIndex].updates) {
		projects[currentIndex].updates = [];
	}

	const now = new Date().toISOString().split('T')[0];
	projects[currentIndex].updates.push({date: now, text: note});
	localStorage.setItem('projects', JSON.stringify(projects));
	closeUpdateModal();
	loadProjects();
}

function editProject(index) {
	const projects = JSON.parse(localStorage.getItem('projects') || '[]');
	const proj = projects[index];
	
	currentIndex = index;

	// Populate modal fields
	document.getElementById('editTitle').value = proj.title;
	document.getElementById('editDesc').value = proj.desc;
	document.getElementById('editLang').value = proj.lang;
	document.getElementById('editProgress').value = proj.progress;
	document.getElementById('editProgressLabel').innerText = proj.progress + "%";
	document.getElementById('next').value = proj.next;
	document.getElementById('editCategory').value = proj.category || '';

	// show modal
	document.getElementById('editModal').style.display = 'flex';
}

function saveEdit() {
	const projects = JSON.parse(localStorage.getItem('projects') || '[]');
	if (currentIndex === null) return;

	const updated = {
		title: document.getElementById('editTitle').value,
		desc: document.getElementById('editDesc').value,
		lang: document.getElementById('editLang').value,
		progress: parseInt(document.getElementById('editProgress').value),
		updates: projects[currentIndex].updates || [],
		next: document.getElementById('editNext').value,
		category: document.getElementById('editCategory').value
	};

	projects[currentIndex] = updated;
	localStorage.setItem('projects', JSON.stringify(projects));
	closeEdit();
	loadProjects();
}

function closeEdit() {
	document.getElementById('editModal').style.display = 'none';
	currentIndex = null;
}

const toggle = document.getElementById('darkModeToggle');

toggle.addEventListener('change', () => {
		document.body.classList.toggle('dark', toggle.checked);
		localStorage.setItem('darkMode', toggle.checked ? 'true' : 'false');
});

window.addEventListener('DOMContentLoaded', () => {
	const darkMode = localStorage.getItem('darkMode') === 'true';
	document.body.classList.toggle('dark', darkMode);
	toggle.checked = darkMode;
});

document.getElementById('editProgress').oninput = function() {
	document.getElementById('editProgressLabel').innerText = this.value + "%";
}
window.onload = loadProjects;

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('projectList');

  container.addEventListener('mouseenter', (event) => {
    const card = event.target.closest('li');
    if (!card || !container.contains(card)) return;

    console.log('Hovering card:', card);

    const cardRect = card.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const currentScroll = container.scrollLeft;

    const cardCentre = cardRect.left + cardRect.width / 2;
    const containerCentre = containerRect.left + containerRect.width / 2;

    const scrollTo = currentScroll + (cardCentre - containerCentre);

    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth',  // correct spelling
    });
  }, true); // use capture to ensure mouseenter is detected on children
});

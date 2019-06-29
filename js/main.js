const projView = document.querySelector('.projects') //conteudo dinamico principal
const search = document.querySelector('input#search') // barra de busca
const sorted = document.querySelector('select') // seleção

// variavel para capturar filtros
const filters = {
  topics: [],
  subject: [],
  session: [],
  course: [],
  campus: [],
}

// capturando tags
for (let i = 0; i < projects.length; i++) {
  for (tag of projects[i].topics) {
    if (!filters.topics.includes(tag)) {
      filters.topics.push(tag)
    }
  }
}

// capturando disciplina
for (let i = 0; i < projects.length; i++) {
  if (!filters.subject.includes(projects[i].subject)) {
    filters.subject.push(projects[i].subject)
  }
}

// capturando periodos
for (let i = 0; i < projects.length; i++) {
  if (!filters.session.includes(projects[i].session)) {
    filters.session.push(projects[i].session)
  }
}

// capturando curso
for (let i = 0; i < projects.length; i++) {
  if (!filters.course.includes(projects[i].course)) {
    filters.course.push(projects[i].course)
  }
}

// capturando campi
for (let i = 0; i < projects.length; i++) {
  if (!filters.campus.includes(projects[i].campus)) {
    filters.campus.push(projects[i].campus)
  }
}

// sorting filters
function sortFilters() {
  filters.topics = filters.topics.sort()
  filters.subject = filters.subject.sort()
  filters.session = filters.session.sort()
  filters.course = filters.course.sort()
  filters.campus = filters.campus.sort()
}

// exibindo
function showProjects(projects) {
    const order = document.querySelector('option:checked').value
    projects.sort((a, b) => a[order].localeCompare(b[order]))
    projView.innerHTML = ''
    projects.map(project => projView.insertAdjacentHTML('beforeend', showProject(project)))
  }

// preparando formato pra exibição
  function showProject(projects) {
    return `<div class="project">
    <a
      href="${projects.repository}"
      target="_blank"
      class="project-image"
    >
      <img src="img/projects/${projects.preview}" alt="${projects.title}" />
    </a>
    <a
      href="${projects.repository}"
      target="_blank"
      class="project-title"
    > ${name(projects.repository)}
    </a>
    <ul class="project-tags">
    ${viewTag(projects.topics)}
      <li>${projects.subject}-${projects.session}</li>
      <li>${projects.course}-${projects.campus}</li>
    </ul>
  </div>
 `
}

//auxiliar formatação
function name(name) {
    let arr = name.split('https://github.com/').join('')
    return arr
}

//auxiliar formatação
function viewTag(topics) {
    let res = ''
    for (let tag of topics) {
        res += `<li>${tag}</li>\n`
    }
    return res
}

// exibindo filters
function loadFiltersView() {
  const fields = ['topics', 'subject', 'session', 'course', 'campus']
  fields.forEach(f => {
    const filter = document.querySelector(`.${f}-filter .values`) // conteudo dinamico filters
    filters[f].forEach(value => {
      const view = `<div class="value">
            <input type="checkbox" name="${f}" id="${value}" value="${`${f}-${value}`}"><label for="${value}">${value}</label>
          </div>`
      filter.insertAdjacentHTML('beforeend', view)
    })
  })
}

function filterByTags() {
  const checkboxes = Array.from(document.querySelectorAll('.value input[type=checkbox]'))
  checkboxes.forEach(c => c.addEventListener('change', () => filterProjects()))
}

function filterProjects() {
  const regexp = new RegExp(search.value, 'i')
  const selected = Array.from(document.querySelectorAll('input:checked'))
  const filters = projects.filter(p => {
    return isFiltered(p, selected) && regexp.test(name(p.repository))
  })
  showProjects(filters.length ? filters : selected.length ? filters : projects)
}

function isFiltered(project, selected) {
  return selected.every(s => {
    const field = s.value.split('-')[0]
    const value = s.value.split('-')[1]
    return project[field].includes(value)
  })
}

showProjects(projects)
sortFilters()
loadFiltersView()
filterByTags()
search.addEventListener('keyup', () => filterProjects())
sorted.addEventListener('change', () => showProjects(projects))

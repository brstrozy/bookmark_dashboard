// 🌙 Dark/Light mode toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const sunIcon = `<svg id="themeIcon" class="w-5 h-5 text-gray-800 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
const moonIcon = `<svg id="themeIcon" class="w-5 h-5 text-gray-800 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;

const updateThemeIcon = () => {
  const isDark = document.documentElement.classList.contains('dark');
  themeToggle.innerHTML = isDark ? moonIcon : sunIcon;
};

const toggleTheme = () => {
  const html = document.documentElement;
  html.classList.toggle('dark');
  const isDark = html.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
};

themeToggle.addEventListener('click', toggleTheme);

// 📏 Size selection
const sizeToggle = document.getElementById('sizeToggle');

const magnifyingGlassPlusIcon = `<svg id="sizeIcon" class="w-5 h-5 text-gray-800 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"/></svg>`;
const magnifyingGlassMinusIcon = `<svg id="sizeIcon" class="w-5 h-5 text-gray-800 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"/></svg>`;

const sizingStyles = {
  compact: {
    column: 'gap-2',
    section: 'p-2 rounded-lg',
    title: 'text-base font-semibold mb-1',
    link: 'block p-0.5 rounded text-xs',
    listItem: ''
  },
  cozy: {
    column: 'gap-3',
    section: 'p-4 rounded-xl shadow',
    title: 'text-lg font-semibold mb-2',
    link: 'block p-1 rounded-md text-sm',
    listItem: 'mb-1'
  }
};

const updateSizeIcon = () => {
  const currentSize = localStorage.getItem('dashboardSize') || 'cozy';
  sizeToggle.innerHTML = currentSize === 'cozy' ? magnifyingGlassMinusIcon : magnifyingGlassPlusIcon;
};

const toggleSize = () => {
  const currentSize = localStorage.getItem('dashboardSize') || 'cozy';
  const newSize = currentSize === 'cozy' ? 'compact' : 'cozy';
  localStorage.setItem('dashboardSize', newSize);
  renderBookmarks(bookmarkData);
  updateSizeIcon();
};

sizeToggle.addEventListener('click', toggleSize);


// 🧠 Load preferences on page load
(function () {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
  updateThemeIcon();

  const savedSize = localStorage.getItem('dashboardSize') || 'cozy';
  localStorage.setItem('dashboardSize', savedSize); // Set the initial size
  renderBookmarks(bookmarkData); // Render with the initial size
  updateSizeIcon(); // Set the correct icon on initial load
})();

// 🖼️ Render bookmark cards
function renderBookmarks(data) {
  const container = document.getElementById('dashboard');
  container.innerHTML = '';
  const currentSize = localStorage.getItem('dashboardSize') || 'cozy';
  const styles = sizingStyles[currentSize];

  data.columns.forEach(columnData => {
    const columnDiv = document.createElement('div');
    columnDiv.className = `bookmark-column flex flex-col ${styles.column}`;

    columnData.sections.forEach(section => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = `bookmark-section bg-white dark:bg-gray-800 transition-colors duration-300 ${styles.section}`;

      const title = document.createElement('h2');
      title.className = `${styles.title}`;
      title.textContent = section.title;
      sectionDiv.appendChild(title);

      const list = document.createElement('ul');
      section.links.forEach(link => {
        const item = document.createElement('li');
        item.className = styles.listItem;

        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.name;
        anchor.className = `${styles.link} text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';

        item.appendChild(anchor);
        list.appendChild(item);
      });

      sectionDiv.appendChild(list);
      columnDiv.appendChild(sectionDiv);
    });

    container.appendChild(columnDiv);
  });
}

// 🔍 Search functionality
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('keyup', () => {
  const searchTerm = searchBar.value.toLowerCase();
  const sections = document.querySelectorAll('.bookmark-section');

  sections.forEach(section => {
    const title = section.querySelector('h2').textContent.toLowerCase();
    const links = section.querySelectorAll('li');
    let sectionHasMatch = false;

    if (title.includes(searchTerm)) {
      sectionHasMatch = true;
    }

    links.forEach(link => {
      const linkName = link.textContent.toLowerCase();
      if (linkName.includes(searchTerm)) {
        link.style.display = '';
        sectionHasMatch = true;
      } else {
        link.style.display = 'none';
      }
    });

    if (title.includes(searchTerm)) {
        links.forEach(link => {
            link.style.display = '';
        });
    }

    if (sectionHasMatch) {
      section.style.display = '';
    } else {
      section.style.display = 'none';
    }
  });

  const columns = document.querySelectorAll('.bookmark-column');
  columns.forEach(column => {
    const visibleSections = column.querySelectorAll('.bookmark-section:not([style*="display: none"])');
    if (visibleSections.length > 0) {
      column.style.display = '';
    } else {
      column.style.display = 'none';
    }
  });
});

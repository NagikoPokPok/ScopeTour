document.addEventListener('DOMContentLoaded', function () {
    const colors = ['#E08963', '#5E96AE', '#f15f0e', '#A2C139'];

    // Function to render subjects dynamically
    function renderSubjects(subjects, isSearch = false) {
      const subjectList = document.getElementById('SubjectList');
      subjectList.innerHTML = ''; // Clear existing list
  
      if (subjects && subjects.length > 0) {
        subjects.forEach((subject, index) => {
          const li = document.createElement('li');
          li.style.setProperty('--cardColor', colors[index % colors.length]); // Cycle through colors
  
          li.innerHTML = `
            <a href="#" class="content">
              <div class="icon">😁</div>
              <div class="subject-des">
                <div class="title">${subject.name}</div>
                <span class="body text-body-light">${subject.description || 'No description available'}</span>
              </div>
            </a>
           <div class="action container border-0 d-flex justify-content-end align-items-center">
            <div class="row gap-4">
              <div class="col fs-5 action-add-member">
                <i class="fa-solid fa-user-plus text-primary"></i>
              </div>
              <div class="col fs-5 action-edit">
                <i class="fa-solid fa-pen-to-square text-primary"></i>
              </div>
              <div class="col fs-5 action-delete">
                <i class="fa-solid fa-trash-can text-primary"></i>
              </div>
            </div>
          </div>
          `;
  
          subjectList.appendChild(li);
        });
      } else {
        subjectList.innerHTML = isSearch
          ? '<li>No subjects match your search</li>'
          : '<li>No subjects available</li>';
      }
    }

    // Fetch all Subjects (no search query)
    async function fetchAllSubjects() {
        const SubjectList = document.getElementById('SubjectList');
        SubjectList.innerHTML = '<li>Loading...</li>';
        try {
            const response = await fetch('http://172.25.1.249:3000/api/subject');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            renderSubjects(data.Subjects, false);
        } catch (error) {
            console.error('Error fetching all Subjects:', error);
            SubjectList.innerHTML = '<li>Error loading Subjects</li>';
        }
    }

    // Search Subjects based on query
    async function searchSubjects(searchQuery) {
        const SubjectList = document.getElementById('SubjectList');
        SubjectList.innerHTML = '<li>Searching...</li>';
        try {
            const url = `http://172.25.1.249:3000/api/Subject?search=${encodeURIComponent(searchQuery.trim())}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            renderSubjects(data.Subjects, true); // Pass isSearch=true for search-specific messaging
        } catch (error) {
            console.error('Error searching Subjects:', error);
            SubjectList.innerHTML = '<li>Error searching Subjects</li>';
        }
    }

    // Debounce helper to limit API calls
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    // Setup search functionality
    const searchInput = document.getElementById('searchSubject');
    if (searchInput) {
        const debouncedSearch = debounce(query => {
            const trimmedQuery = query.trim();
            if (trimmedQuery) {
                searchSubjects(trimmedQuery); // Search when there's a query
            } else {
                fetchAllSubjects(); // Fetch all Subjects only when search is cleared
            }
        }, 300);

        searchInput.addEventListener('input', () => {
            debouncedSearch(searchInput.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    searchSubjects(query); // Immediate search on Enter
                } else {
                    fetchAllSubjects(); // Immediate fetch all on Enter when empty
                }
            }
        });
    }

    // Handle Subject creation
    const createSubjectForm = document.getElementById('createSubjectForm');
    if (createSubjectForm) {
        createSubjectForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const SubjectName = document.getElementById('modal-subject-name').value.trim();
            if (!SubjectName) {
                alert('Subject name is required.');
                return;
            }
            try {
                const response = await fetch('http://172.25.1.249:3000/api/subject', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subjectName: SubjectName })

                });
                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    const currentQuery = searchInput.value.trim();
                    if (currentQuery) {
                        searchSubjects(currentQuery); // Refresh with current search query
                    } else {
                        fetchAllSubjects(); // Refresh full list if no search active
                    }
                    bootstrap.Modal.getInstance(document.getElementById('reg-modal')).hide();
                    createSubjectForm.reset();
                } else {
                    alert(result.message || 'Failed to create Subject.');
                }
            } catch (error) {
                console.error('Error creating Subject:', error);
                alert('An error occurred while creating the Subject.');
            }
        });
    }

    // Initial load of all Subjects (only on page load)
    fetchAllSubjects();
});
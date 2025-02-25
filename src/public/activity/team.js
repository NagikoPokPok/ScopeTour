document.addEventListener('DOMContentLoaded', function () {
    // Helper: Render teams in the team list
    function renderTeams(teams, isSearch = false) {
        const teamList = document.getElementById('teamList');
        teamList.innerHTML = ''; // Clear current list
        if (teams && teams.length > 0) {
            teams.forEach(team => {
                const li = document.createElement('li');
                li.style.setProperty('--cardColor', '#E08963');
                li.innerHTML = `
                    <div class="content">
                        <div class="icon">😁</div>
                        <div class="team-des">
                            <div class="title">${team.name}</div>
                        </div>
                        <div class="team-streak">
                            <img src="../public/img/list-team-goal/slider2.png" alt="streak" class="icon-streak">
                            <div class="number-streak"><span>30</span></div>
                        </div>
                    </div>`;
                teamList.appendChild(li);
            });
        } else {
            teamList.innerHTML = isSearch 
                ? '<li>No teams match your search</li>' 
                : '<li>No teams available</li>';
        }
    }

    console.log('Team script loaded');

    // Fetch all teams (no search query)
    async function fetchAllTeams() {
        const teamList = document.getElementById('teamList');
        teamList.innerHTML = '<li>Loading...</li>';
        try {
            const response = await fetch('http://172.25.1.249:3000/api/team');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            renderTeams(data.teams, false);
        } catch (error) {
            console.error('Error fetching all teams:', error);
            teamList.innerHTML = '<li>Error loading teams</li>';
        }
    }

    // Search teams based on query
    async function searchTeams(searchQuery) {
        const teamList = document.getElementById('teamList');
        teamList.innerHTML = '<li>Searching...</li>';
        try {
            const url = `http://172.25.1.249:3000/api/team?search=${encodeURIComponent(searchQuery.trim())}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            renderTeams(data.teams, true); // Pass isSearch=true for search-specific messaging
        } catch (error) {
            console.error('Error searching teams:', error);
            teamList.innerHTML = '<li>Error searching teams</li>';
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
    const searchInput = document.getElementById('searchTeam');
    if (searchInput) {
        const debouncedSearch = debounce(query => {
            const trimmedQuery = query.trim();
            if (trimmedQuery) {
                searchTeams(trimmedQuery); // Search when there's a query
            } else {
                fetchAllTeams(); // Fetch all teams only when search is cleared
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
                    searchTeams(query); // Immediate search on Enter
                } else {
                    fetchAllTeams(); // Immediate fetch all on Enter when empty
                }
            }
        });
    }

    // Handle team creation
    const createTeamForm = document.getElementById('createTeamForm');
    if (createTeamForm) {
        createTeamForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const teamName = document.getElementById('modal-team-name').value.trim();
            if (!teamName) {
                alert('Team name is required.');
                return;
            }
            try {
                const response = await fetch('http://172.25.1.249:3000/api/team', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ teamName })
                });
                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    const currentQuery = searchInput.value.trim();
                    if (currentQuery) {
                        searchTeams(currentQuery); // Refresh with current search query
                    } else {
                        fetchAllTeams(); // Refresh full list if no search active
                    }
                    bootstrap.Modal.getInstance(document.getElementById('reg-modal')).hide();
                    createTeamForm.reset();
                } else {
                    alert(result.message || 'Failed to create team.');
                }
            } catch (error) {
                console.error('Error creating team:', error);
                alert('An error occurred while creating the team.');
            }
        });
    }

    // Initial load of all teams (only on page load)
    fetchAllTeams();
});
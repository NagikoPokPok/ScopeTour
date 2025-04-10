document.addEventListener('DOMContentLoaded', function () {
    // Check login status at page load
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'login.html';
        return;
    }
    const colors = ['#E08963', '#5E96AE', '#f15f0e', '#A2C139']; // Màu luân phiên

    const userName = document.getElementById('name-of-user');
    userName.innerText = localStorage.getItem("userName");
  
    function renderTeams(teams, isSearch = false) {
        const teamList = document.getElementById('teamList');
        teamList.innerHTML = '';
  
        if (teams && teams.length > 0) {
            teams.forEach((team, index) => {
                const li = document.createElement('li');
                li.style.setProperty('--cardColor', colors[index % colors.length]);
  
                li.innerHTML = `
                    <a href="team-project.html?teamId=${team.team_id}" class="content">
                        <div class="icon">😁</div>
                        <div class="team-des">
                            <div class="title">${team.name}</div>
                        </div>
                    </a>
                    <div class="action container border-0 d-flex justify-content-end align-items-center">
                        <div class="row gap-4">
                            <div class="col fs-5 action-invite-member" data-team-id="${team.team_id}" data-team-name="${team.name}">
                                <i class="fa-solid fa-user-plus text-primary"></i>
                            </div>
                            <div class="col fs-5 action-edit" data-team-id="${team.team_id}" data-team-name="${team.name}">
                                <i class="fa-solid fa-pen-to-square text-primary"></i>
                            </div>
                            <div class="col fs-5 action-delete" data-team-id="${team.team_id}" data-team-name="${team.name}">
                                <i class="fa-solid fa-trash-can text-primary"></i>
                            </div>
                        </div>
                    </div>
                `;
                teamList.appendChild(li);
            });

            document.querySelectorAll('.action-invite-member').forEach(button => {
                button.addEventListener('click', (event) => {
                    const teamId = event.currentTarget.getAttribute('data-team-id');
                    const teamName = event.currentTarget.getAttribute('data-team-name');
                    openInviteMemberModal(teamId, teamName);
                });
            });
  
            document.querySelectorAll('.action-edit').forEach(button => {
                button.addEventListener('click', (event) => {
                    const teamId = event.currentTarget.getAttribute('data-team-id');
                    const teamName = event.currentTarget.getAttribute('data-team-name');
                    openUpdateModal(teamId, teamName);
                });
            });
  
            document.querySelectorAll('.action-delete').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const teamId = event.currentTarget.getAttribute('data-team-id');
                    const teamName = event.currentTarget.getAttribute('data-team-name');

                    console.log(teamName);

                    // Open modal confirmation delete before deleting
                    openModalConfirmationDelete(teamId, teamName);
                });
            });
        } else {
            teamList.innerHTML = `
                <div id="lottie-container"></div>
            `;

            setTimeout(() => {
                const topic = isSearch ? "not-found" : "not-available";
                loadLottieAnimation("lottie-container", topic);
            }, 0);
        }
    }

    // OPEN MODAL INVITE MEMBER
    function openInviteMemberModal(teamId, teamName) {
        // document.getElementById('invite-team-id').value = teamId;
        // document.getElementById('invite-team-name').innerText = teamName;
        const modalElement = document.getElementById('modal-invite-member');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
  
  
    // Fetch all team
    async function fetchAllTeams() {
        const teamList = document.getElementById('teamList');
        const userId = localStorage.getItem('userId');
        
        console.log('⚡️ Fetching teams with userId:', userId); // Debug log
        
        if (!userId) {
            console.error('No userId found in localStorage');
            window.location.href = 'login.html';
            return;
        }
    
        teamList.innerHTML = '<span>Loading...</span>';
        try {
            // Sửa URL để đảm bảo userId được gửi đúng
            const response = await fetch(`http://localhost:3000/api/team?userId=${encodeURIComponent(userId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Response status:', response.status); // Debug log
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }
            
            const data = await response.json();
            console.log('📦 Received team data:', data); // Debug log
            
            if (!data.teams) {
                throw new Error('No teams data received');
            }
            
            renderTeams(data.teams, false);
        } catch (error) {
            console.error('❌ Error fetching teams:', error);
            teamList.innerHTML = `<div id="lottie-container"></div>`;
            setTimeout(() => {
                loadLottieAnimation("lottie-container", "error-loading");
            }, 0);
        }
    }

    // ============== BEGIN: DELETE TEAM ACTION ==============
    // Hiển thị modal xác nhận xóa
    // Cách 1: Thêm id cho nút button, đồng thời xoá form bao trùm cả modal-body và modal-footer
    function openModalConfirmationDelete(teamId, teamName) {
        
        // Hiện tên nhóm
        // Dùng innerText hoặc textContent
        document.getElementById('team-name-delete').innerText = teamName;
        const modalElement = document.getElementById('modal-confirmation-delete');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Lấy nút xác nhận xóa
        const confirmButton = document.getElementById('btn-confirm-delete');

        // Gán sự kiện click, đảm bảo chỉ có một sự kiện duy nhất
        confirmButton.onclick = () => {
            deleteTeam(teamId);
            modal.hide();
        };
    }

    // Cách 2: Thêm type="submit" cho nút button, đồng thời thêm form bao trùm cả modal-body và modal-footer
    // function openModalConfirmationDelete(teamId) {
    //     const modalElement = document.getElementById('modal-confirmation-delete');
    //     const modal = new bootstrap.Modal(modalElement);
    //     modal.show();
    
    //     const form = document.getElementById('confirmationDeleteForm');
    
    //     // Xóa sự kiện submit cũ nếu đã đăng ký trước đó
    //     form.removeEventListener('submit', handleFormSubmit);
    
    //     function handleFormSubmit(event) {
    //         event.preventDefault();
    //         deleteTeam(teamId);
    //         modal.hide();
    //     }
    
    //     form.addEventListener('submit', handleFormSubmit);
    // }

    
  
    // Delete team
    
    async function deleteTeam(teamId) {
        try {
            const response = await fetch(`http://localhost:3000/api/team/${teamId}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (response.ok) {
                openModalSuccessAction("Delete team successfully!");
                fetchAllTeams(); // Làm mới danh sách team sau khi xóa
            } else {
                openModalFailAction("Failed to delete team.");
            }
        } catch (error) {
            console.error('Error deleting team:', error);
            openModalFailAction("An error occurred while deleting the team.");
        }
    }

    // ============== END: DELETE TEAM ACTION =================


    // ============== BEGIN: UPDATE TEAM ACTION ==============
    // Update team
    function openUpdateModal(teamId, teamName) {
        document.getElementById('update-team-id').value = teamId;
        document.getElementById('update-team-name').value = teamName;

        document.getElementById('char-count-team-update').innerText = `${teamName.length}/50 characters`;
    
        const modalElement = document.getElementById('update-modal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    
        const updateTeamForm = document.getElementById('updateTeamForm');
        
        updateTeamForm.onsubmit = function (event) {
            event.preventDefault();
            
            // Đợi modal cập nhật đóng hoàn toàn rồi mới mở modal xác nhận
            modalElement.addEventListener('hidden.bs.modal', function () {
                openModalConfirmationUpdate(teamName);
            }, { once: true });
    
            modal.hide(); // Ẩn modal cập nhật
        };
    }
    
    function openModalConfirmationUpdate(teamName) {
        document.getElementById('team-name-edit').innerText = teamName; 
        const modalElement = document.getElementById('modal-confirmation-edit');
        const modal = new bootstrap.Modal(modalElement);
    
        modal.show();
    
        const confirmButton = document.getElementById('btn-confirm-edit');
        confirmButton.onclick = () => {
            updateTeam();
            modal.hide();
        };
    }
    

    async function updateTeam() {

        const teamId = document.getElementById('update-team-id').value;
        const teamName = document.getElementById('update-team-name').value.trim();
  
        if (!teamId || !teamName) {
            alert('Team ID or name is missing!');
            return;
        }
  
        try {
            const response = await fetch(`http://localhost:3000/api/team/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ teamName })
            });
  
            const result = await response.json();
  
            if (response.ok) {
                openModalSuccessAction(result.message);
                fetchAllTeams(); // Refresh team list after update
            } else {
                openModalFailAction('Failed to update team.');
            }
        } catch (error) {
            console.error('Error updating team:', error);
            openModalFailAction('An error occurred while updating the team.');
        }
    }
  
  
    
    // ============== END: UPDATE TEAM ACTION ==============
  
        // Search teams based on query
        async function searchTeams(searchQuery) {
            const teamList = document.getElementById('teamList');
            teamList.innerHTML = '<span>Searching...</span>';
            try {
                const url = `http://localhost:3000/api/team?search=${encodeURIComponent(searchQuery.trim())}`;
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                renderTeams(data.teams, true); // Pass isSearch=true for search-specific messaging
            } catch (error) {
                console.error('Error searching teams:', error);
                teamList.innerHTML = `
                <div id="lottie-container"></div>
                `            
                ;
                setTimeout(() => {
                    loadLottieAnimation("lottie-container", "error-loading");
                }, 0);
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
  
        const createTeamForm = document.getElementById('createTeamForm');
    if (createTeamForm) {
        createTeamForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const teamName = document.getElementById('modal-team-name').value.trim();
            
            const userId = localStorage.getItem('userId');
            
            if (!teamName) {
                openModalFailAction('Team name is required.');
                return;
            }

            if (!userId) {
                window.location.href = 'login.html'; // Redirect to login if no user ID
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/team', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        teamName,
                        userId: parseInt(userId) // Convert to number
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    const teamId = result.teamId;
                    console.log('New team created with ID:', teamId);
                    
                    openModalSuccessAction("Create team successfully!");
                    const currentQuery = searchInput.value.trim();
                    if (currentQuery) {
                        searchTeams(currentQuery);
                    } else {
                        fetchAllTeams();
                    }
                    
                    bootstrap.Modal.getInstance(document.getElementById('reg-modal')).hide();
                    createTeamForm.reset();
                } else {
                    openModalFailAction(result.message || "Failed to create team.");
                }
            } catch (error) {
                console.error('Error creating team:', error);
                openModalFailAction("An error occurred while creating the team.");
            }
        });
    }
  
    fetchAllTeams();
});



// SHOW MODAL ACTION FAIL OR SUCCESS
  function openModalSuccessAction(message) {
    showModalActionSuccess(message);
}

function openModalFailAction(message) {
    showModalActionFail(message);
}
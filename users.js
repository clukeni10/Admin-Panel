// Dados mockados de usuários
let users = [
    { id: 1, name: 'João Silva', email: 'joao@exemplo.com', type: 'admin', status: 'active' },
    { id: 2, name: 'Maria Oliveira', email: 'maria@exemplo.com', type: 'customer', status: 'active' },
    { id: 3, name: 'Carlos Santos', email: 'carlos@exemplo.com', type: 'customer', status: 'active' },
    { id: 4, name: 'Ana Pereira', email: 'ana@exemplo.com', type: 'manager', status: 'active' },
    { id: 5, name: 'Paulo Souza', email: 'paulo@exemplo.com', type: 'customer', status: 'inactive' },
    { id: 6, name: 'Fernanda Lima', email: 'fernanda@exemplo.com', type: 'customer', status: 'active' },
    { id: 7, name: 'Ricardo Ferreira', email: 'ricardo@exemplo.com', type: 'manager', status: 'active' },
    { id: 8, name: 'Camila Costa', email: 'camila@exemplo.com', type: 'customer', status: 'active' },
    { id: 9, name: 'Roberto Almeida', email: 'roberto@exemplo.com', type: 'customer', status: 'inactive' },
    { id: 10, name: 'Juliana Martins', email: 'juliana@exemplo.com', type: 'customer', status: 'active' }
];

// Constantes de paginação
const USERS_PER_PAGE = 5;
let currentUserPage = 1;
let filteredUsers = [...users];

// Elementos DOM para usuários
const addUserBtn = document.getElementById('addUserBtn');
const saveUserBtn = document.getElementById('saveUserBtn');
const userModal = document.getElementById('userModal');
const userForm = document.getElementById('userForm');
const usersTable = document.getElementById('usersTable');
const usersPagination = document.getElementById('usersPagination');
const searchUser = document.getElementById('searchUser');

// Botões para abrir modal de usuário
addUserBtn.addEventListener('click', () => {
    document.getElementById('userModalTitle').textContent = 'Adicionar Usuário';
    document.getElementById('userId').value = '';
    resetForm('userForm');
    openModal('userModal');
});

// Salvar usuário
saveUserBtn.addEventListener('click', () => {
    const userId = document.getElementById('userId').value;
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userPassword = document.getElementById('userPassword').value;
    const userType = document.getElementById('userType').value;
    const userStatus = document.getElementById('userStatus').value;
    
    if (!userName || !userEmail || (!userId && !userPassword)) {
        showToast('Preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    if (userId) {
        // Editar usuário existente
        const index = users.findIndex(user => user.id == userId);
        if (index !== -1) {
            users[index] = {
                ...users[index],
                name: userName,
                email: userEmail,
                type: userType,
                status: userStatus
            };
            showToast('Usuário atualizado com sucesso');
        }
    } else {
        // Adicionar novo usuário
        const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
        users.push({
            id: newId,
            name: userName,
            email: userEmail,
            type: userType,
            status: userStatus
        });
        showToast('Usuário adicionado com sucesso');
    }
    
    closeModal('userModal');
    renderUsers();
});

// Renderização da tabela de usuários
function renderUsers() {
    // Aplicar filtro se houver
    filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchUser.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchUser.value.toLowerCase())
    );
    
    // Calcular paginação
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const start = (currentUserPage - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(start, end);
    
    // Renderizar tabela
    if (paginatedUsers.length === 0) {
        usersTable.innerHTML = `
            <tr>
                <td colspan="6" class="no-data-message">Nenhum usuário encontrado</td>
            </tr>
        `;
    } else {
        usersTable.innerHTML = paginatedUsers.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${translateUserType(user.type)}</td>
                <td>
                    <span class="badge ${user.status === 'active' ? 'badge-success' : 'badge-danger'}">
                        ${user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td class="actions">
                    <button class="action-btn edit-btn" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteItem(${user.id}, 'user')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // Renderizar paginação
    renderPagination(usersPagination, totalPages, currentUserPage, 'user');
}

// Função para editar usuário
function editUser(id) {
    const user = users.find(user => user.id === id);
    if (user) {
        document.getElementById('userId').value = user.id;
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPassword').value = '';
        document.getElementById('userType').value = user.type;
        document.getElementById('userStatus').value = user.status;
        document.getElementById('userModalTitle').textContent = 'Editar Usuário';
        openModal('userModal');
    }
}

// Função para excluir usuário
function deleteUser(id) {
    users = users.filter(user => user.id !== id);
    renderUsers();
    showToast('Usuário excluído com sucesso');
}

// Função para mudar página de usuários
function changeUserPage(page) {
    currentUserPage = page;
    renderUsers();
}

// Pesquisa de usuários
searchUser.addEventListener('input', () => {
    currentUserPage = 1;
    renderUsers();
});

// Expor funções para o escopo global
window.renderUsers = renderUsers;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.changeUserPage = changeUserPage;

// Função para mudar página (genérica)
function changePage(page, type) {
    if (type === 'user') {
        changeUserPage(page);
    } else if (type === 'product') {
        changeProductPage(page);
    }
}

window.changePage = changePage;
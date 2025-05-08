
// Dados mockados para exemplo
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

// Elementos DOM
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('pageTitle');


// Modais
const userModal = document.getElementById('userModal');
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const closeModalButtons = document.querySelectorAll('.close-modal');

// Botões
const addUserBtn = document.getElementById('addUserBtn');
const saveUserBtn = document.getElementById('saveUserBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Pesquisa
const searchUser = document.getElementById('searchUser');

// Formulários
const userForm = document.getElementById('userForm');

// Tabelas
const usersTable = document.getElementById('usersTable');

// Paginação
const usersPagination = document.getElementById('usersPagination');


// Botões para abrir modais
addUserBtn.addEventListener('click', () => {
    document.getElementById('userModalTitle').textContent = 'Adicionar Usuário';
    document.getElementById('userId').value = '';
    resetForm('userForm');
    openModal('userModal');
});

// Fechar modais
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        closeModal(modalId);
    });
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
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const start = (currentUserPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
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


// Função para traduzir tipo de usuário
function translateUserType(type) {
    const types = {
        'admin': 'Administrador',
        'manager': 'Gerente',
        'customer': 'Cliente'
    };
    return types[type] || type;
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

// Confirmar exclusão
confirmDeleteBtn.addEventListener('click', () => {
    const id = parseInt(document.getElementById('deleteItemId').value);
    const type = document.getElementById('deleteItemType').value;
    
    if (type === 'user') {
        users = users.filter(user => user.id !== id);
        renderUsers();
        showToast('Usuário excluído com sucesso');
    } 
    
    closeModal('deleteConfirmModal');
});

// Pesquisa de usuários
searchUser.addEventListener('input', () => {
    currentUserPage = 1;
    renderUsers();
});

// Expor funções para o escopo global
window.editUser = editUser;
window.deleteItem = deleteItem;
window.changePage = changePage;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderUsers();

});

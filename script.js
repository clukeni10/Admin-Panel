
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

let products = [
    { id: 1, name: 'Smartphone XYZ', category: 'electronics', price: 1999.00, stock: 50, description: 'Smartphone de última geração' },
    { id: 2, name: 'Notebook ABC', category: 'computers', price: 3499.00, stock: 30, description: 'Notebook para uso profissional' },
    { id: 3, name: 'Monitor 24"', category: 'computers', price: 899.00, stock: 45, description: 'Monitor Full HD' },
    { id: 4, name: 'Cadeira Gamer', category: 'furniture', price: 1249.00, stock: 20, description: 'Cadeira ergonômica para gamers' },
    { id: 5, name: 'Teclado Mecânico', category: 'computers', price: 349.00, stock: 60, description: 'Teclado mecânico RGB' },
    { id: 6, name: 'Mouse Gamer', category: 'computers', price: 149.00, stock: 75, description: 'Mouse de alta precisão' },
    { id: 7, name: 'Fone de Ouvido', category: 'electronics', price: 299.00, stock: 40, description: 'Fone com cancelamento de ruído' },
    { id: 8, name: 'Smart TV 50"', category: 'electronics', price: 2999.00, stock: 15, description: 'Smart TV 4K' },
    { id: 9, name: 'Mesa de Escritório', category: 'furniture', price: 799.00, stock: 25, description: 'Mesa para home office' },
    { id: 10, name: 'Livro de Programação', category: 'books', price: 129.00, stock: 100, description: 'Guia completo de JavaScript' }
];

// Variáveis de paginação
const ITEMS_PER_PAGE = 5;
let currentUserPage = 1;
let currentProductPage = 1;
let filteredUsers = [...users];
let filteredProducts = [...products];

// Elementos DOM
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('pageTitle');

// Modais
const userModal = document.getElementById('userModal');
const productModal = document.getElementById('productModal');
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const closeModalButtons = document.querySelectorAll('.close-modal');

// Botões
const addUserBtn = document.getElementById('addUserBtn');
const addProductBtn = document.getElementById('addProductBtn');
const saveUserBtn = document.getElementById('saveUserBtn');
const saveProductBtn = document.getElementById('saveProductBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Pesquisa
const searchUser = document.getElementById('searchUser');
const searchProduct = document.getElementById('searchProduct');

// Formulários
const userForm = document.getElementById('userForm');
const productForm = document.getElementById('productForm');

// Tabelas
const usersTable = document.getElementById('usersTable');
const productsTable = document.getElementById('productsTable');

// Paginação
const usersPagination = document.getElementById('usersPagination');
const productsPagination = document.getElementById('productsPagination');

// Preview de imagem
const productImage = document.getElementById('productImage');
const productImagePreview = document.getElementById('productImagePreview');

// Funções auxiliares
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="material-icons">${type === 'success' ? 'check_circle' : 'error'}</i>
        ${message}
    `;
    toastContainer.appendChild(toast);
    
    // Remove o toast após 3 segundos
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function resetForm(formId) {
    document.getElementById(formId).reset();
}

// Inicialização do sidebar
toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// Navegação entre seções
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Ativa o item de menu clicado
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Mostra a seção correspondente
        const sectionId = item.getAttribute('data-section');
        if (sectionId) {
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            pageTitle.textContent = item.querySelector('.menu-text').textContent;
        }
    });
});

// Botões para abrir modais
addUserBtn.addEventListener('click', () => {
    document.getElementById('userModalTitle').textContent = 'Adicionar Usuário';
    document.getElementById('userId').value = '';
    resetForm('userForm');
    openModal('userModal');
});

addProductBtn.addEventListener('click', () => {
    document.getElementById('productModalTitle').textContent = 'Adicionar Produto';
    document.getElementById('productId').value = '';
    resetForm('productForm');
    productImagePreview.innerHTML = '<i class="material-icons">image</i>';
    openModal('productModal');
});

// Fechar modais
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        closeModal(modalId);
    });
});

// Preview de imagem do produto
productImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            productImagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
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

// Salvar produto
saveProductBtn.addEventListener('click', () => {
    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productName').value;
    const productCategory = document.getElementById('productCategory').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productStock = parseInt(document.getElementById('productStock').value);
    const productDescription = document.getElementById('productDescription').value;
    
    if (!productName || !productCategory || isNaN(productPrice) || isNaN(productStock)) {
        showToast('Preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    if (productId) {
        // Editar produto existente
        const index = products.findIndex(product => product.id == productId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name: productName,
                category: productCategory,
                price: productPrice,
                stock: productStock,
                description: productDescription
            };
            showToast('Produto atualizado com sucesso');
        }
    } else {
        // Adicionar novo produto
        const newId = products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
        products.push({
            id: newId,
            name: productName,
            category: productCategory,
            price: productPrice,
            stock: productStock,
            description: productDescription
        });
        showToast('Produto adicionado com sucesso');
    }
    
    closeModal('productModal');
    renderProducts();
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

// Renderização da tabela de produtos
function renderProducts() {
    // Aplicar filtro se houver
    filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchProduct.value.toLowerCase()) ||
        product.category.toLowerCase().includes(searchProduct.value.toLowerCase())
    );
    
    // Calcular paginação
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const start = (currentProductPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(start, end);
    
    // Renderizar tabela
    if (paginatedProducts.length === 0) {
        productsTable.innerHTML = `
            <tr>
                <td colspan="6" class="no-data-message">Nenhum produto encontrado</td>
            </tr>
        `;
    } else {
        productsTable.innerHTML = paginatedProducts.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${translateCategory(product.category)}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.stock}</td>
                <td class="actions">
                    <button class="action-btn edit-btn" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteItem(${product.id}, 'product')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // Renderizar paginação
    renderPagination(productsPagination, totalPages, currentProductPage, 'product');
}

// Renderização da paginação
function renderPagination(container, totalPages, currentPage, type) {
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Botão anterior
    paginationHTML += `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1}, '${type}')">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Números das páginas
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            paginationHTML += `
                <button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i}, '${type}')">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<button disabled>...</button>`;
        }
    }
    
    // Botão próximo
    paginationHTML += `
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1}, '${type}')">
            <i class="fas fa-chevron-right "></i>
        </button>
    `;
    
    container.innerHTML = paginationHTML;
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

// Função para traduzir categoria
function translateCategory(category) {
    const categories = {
        'electronics': 'Eletrônicos',
        'computers': 'Informática',
        'furniture': 'Móveis',
        'clothing': 'Vestuário',
        'books': 'Livros'
    };
    return categories[category] || category;
}

// Função para mudar página
function changePage(page, type) {
    if (type === 'user') {
        currentUserPage = page;
        renderUsers();
    } else if (type === 'product') {
        currentProductPage = page;
        renderProducts();
    }
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

// Função para editar produto
function editProduct(id) {
    const product = products.find(product => product.id === id);
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productModalTitle').textContent = 'Editar Produto';
        productImagePreview.innerHTML = '<i class="material-icons">image</i>';
        openModal('productModal');
    }
}

// Função para preparar exclusão de item
function deleteItem(id, type) {
    document.getElementById('deleteItemId').value = id;
    document.getElementById('deleteItemType').value = type;
    openModal('deleteConfirmModal');
}

// Confirmar exclusão
confirmDeleteBtn.addEventListener('click', () => {
    const id = parseInt(document.getElementById('deleteItemId').value);
    const type = document.getElementById('deleteItemType').value;
    
    if (type === 'user') {
        users = users.filter(user => user.id !== id);
        renderUsers();
        showToast('Usuário excluído com sucesso');
    } else if (type === 'product') {
        products = products.filter(product => product.id !== id);
        renderProducts();
        showToast('Produto excluído com sucesso');
    }
    
    closeModal('deleteConfirmModal');
});

// Pesquisa de usuários
searchUser.addEventListener('input', () => {
    currentUserPage = 1;
    renderUsers();
});

// Pesquisa de produtos
searchProduct.addEventListener('input', () => {
    currentProductPage = 1;
    renderProducts();
});

// Expor funções para o escopo global
window.editUser = editUser;
window.editProduct = editProduct;
window.deleteItem = deleteItem;
window.changePage = changePage;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderUsers();
    renderProducts();
});

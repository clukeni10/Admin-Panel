// Elementos DOM gerais
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('pageTitle');

// Modais
const closeModalButtons = document.querySelectorAll('.close-modal');
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Variáveis globais para armazenar o ID e tipo do item a ser excluído
let deleteItemId = '';
let deleteItemType = '';

// Funções de utilidade
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
        <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>

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

// Função para renderizar paginação
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

// Função para preparar exclusão de item
function deleteItem(id, type) {
    deleteItemId = id;
    deleteItemType = type;
    openModal('deleteConfirmModal');
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

// Fechar modais
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        closeModal(modalId);
    });
});

// Confirmar exclusão
confirmDeleteBtn.addEventListener('click', () => {
    if (deleteItemType === 'user') {
        deleteUser(parseInt(deleteItemId));
    } else if (deleteItemType === 'product') {
        deleteProduct(parseInt(deleteItemId));
    }
    
    closeModal('deleteConfirmModal');
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa as tabelas de usuários e produtos
    renderUsers();
    renderProducts();
});

// Expor funções para o escopo global
window.openModal = openModal;
window.closeModal = closeModal;
window.resetForm = resetForm;
window.formatCurrency = formatCurrency;
window.showToast = showToast;
window.renderPagination = renderPagination;
window.translateUserType = translateUserType;
window.translateCategory = translateCategory;
window.deleteItem = deleteItem;
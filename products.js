// Dados mockados de produtos
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
  
  // Constantes de paginação
  const PRODUCTS_PER_PAGE = 5;
  let currentProductPage = 1;
  let filteredProducts = [...products];
  
  // Elementos DOM para produtos
  const addProductBtn = document.getElementById('addProductBtn');
  const saveProductBtn = document.getElementById('saveProductBtn');
  const productModal = document.getElementById('productModal');
  const productForm = document.getElementById('productForm');
  const productsTable = document.getElementById('productsTable');
  const productsPagination = document.getElementById('productsPagination');
  const searchProduct = document.getElementById('searchProduct');
  const productImage = document.getElementById('productImage');
  const productImagePreview = document.getElementById('productImagePreview');
  
  // Botões para abrir modal de produto
  addProductBtn.addEventListener('click', () => {
      document.getElementById('productModalTitle').textContent = 'Adicionar Produto';
      document.getElementById('productId').value = '';
      resetForm('productForm');
      productImagePreview.innerHTML = '<i class="fas fa-image"></i>';
      openModal('productModal');
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
  
  // Renderização da tabela de produtos
  function renderProducts() {
      // Aplicar filtro se houver
      filteredProducts = products.filter(product => 
          product.name.toLowerCase().includes(searchProduct.value.toLowerCase()) ||
          product.category.toLowerCase().includes(searchProduct.value.toLowerCase())
      );
      
      // Calcular paginação
      const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
      const start = (currentProductPage - 1) * PRODUCTS_PER_PAGE;
      const end = start + PRODUCTS_PER_PAGE;
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
          productImagePreview.innerHTML = '<i class="fas fa-image"></i>';
          openModal('productModal');
      }
  }
  
  // Função para excluir produto
  function deleteProduct(id) {
      products = products.filter(product => product.id !== id);
      renderProducts();
      showToast('Produto excluído com sucesso');
  }
  
  // Função para mudar página de produtos
  function changeProductPage(page) {
      currentProductPage = page;
      renderProducts();
  }
  
  // Pesquisa de produtos
  searchProduct.addEventListener('input', () => {
      currentProductPage = 1;
      renderProducts();
  });
  
  // Expor funções para o escopo global
  window.renderProducts = renderProducts;
  window.editProduct = editProduct;
  window.deleteProduct = deleteProduct;
  window.changeProductPage = changeProductPage;
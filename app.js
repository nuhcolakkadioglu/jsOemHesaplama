//Storage Controller
const StorageController = (function () {

})();

//Product Controller
const ProductController = (function () {

    //private alanlar
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: [],
        selectedProduct: null,
        totalPrice: 0
    }

    //public alan
    return {
        getProducts: function () {
            return data.products;
        },

        getData: function () {
            return data;
        },
        getCurrentProduct: function () {
            return data.selectedProduct;
        }
        ,
        addProduct: function (name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;

            } else {
                id = 1;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
        getTotal: function () {
            let total = 0;
            data.products.forEach(item => {
                total += item.price;
            });
            data.totalPrice = total;
            return data.totalPrice;

        },

        getProductById: function (id) {
            let product = null;
            data.products.forEach(item => {
                if (item.id == id) {
                    product = item;
                }
            })
            return product;
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },

        updateProduct: function (name, price) {
            let product = null;

            data.products.forEach(item => {
                if (item.id == data.selectedProduct.id) {
                    item.name = name;
                    item.price = parseFloat(price);
                    product = item;
                }
            });

            return product;
        }
    }
    createProductList

})();

//UI Controller
const UIController = (function () {

    const selectors = {
        productList: '#item-list',
        addButton: '.addBtn',
        productName: '#ProductName',
        productPrice: '#ProductPrice',
        productCart: '#productCart',
        totalTl: '#total-tl',
        totalUsd: '#total-usd',
        updateBtn: '.updateBtn',
        deleteBtn: '.deleteBtn',
        cancelBtn: '.cancelBtn',
        productListItems :'#item-list tr'

    }

    return {
        createProductList: function (products) {
            let html = '';

            products.forEach(item => {
                html += `
                <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td class="text-right">
                 
                        <i class="fas fa-edit edit-product"></i>
                        </td>
                 
            </tr>`;

            })


            document.querySelector(selectors.productList).innerHTML = html;
        },

        getSelectors: function () {
            return selectors;
        },

        addProduct: function (item) {
            document.querySelector(selectors.productCart).style.display = 'block';
            var item = `
           <tr>
           <td>${item.id}</td>
           <td>${item.name}</td>
           <td>${item.price}</td>
           <td class="text-right">
           
                   <i class="fas fa-edit edit-product"></i>
            </td>
       </tr>
            
           `;
            document.querySelector(selectors.productList).innerHTML += item;

        },

        clearInput: function () {
            document.querySelector(selectors.productName).value = '';
            document.querySelector(selectors.productPrice).value = '';
        },

        clearWarnings :function(){
          const items = document.querySelectorAll(selectors.productListItems);
          items.forEach(item=>{
                if(item.classList.contains('bg-warning')){
                    item.classList.remove('bg-warning');
                }
          });
        },

        hideCart: function () {
            document.querySelector(selectors.productCart).style.display = 'none';
        },

        showTotal: function (total) {
            document.querySelector(selectors.totalUsd).textContent = total;
            document.querySelector(selectors.totalTl).textContent = total * 8.4;

        },
        addProductToForm: function () {
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(selectors.productName).value = selectedProduct.name;
            document.querySelector(selectors.productPrice).value = selectedProduct.price;
        },
        addingState: function (item) {
            
            UIController.clearWarnings();

            UIController.clearInput();
            document.querySelector(selectors.addButton).style.display = 'inline';
            document.querySelector(selectors.updateBtn).style.display = 'none';
            document.querySelector(selectors.deleteBtn).style.display = 'none';
            document.querySelector(selectors.cancelBtn).style.display = 'none';
        },
        editState: function (tr) {
            
            document.querySelector(selectors.addButton).style.display = 'none';
            document.querySelector(selectors.updateBtn).style.display = 'inline';
            document.querySelector(selectors.deleteBtn).style.display = 'inline';
            document.querySelector(selectors.cancelBtn).style.display = 'inline';
        },
        updateProduct:function(prd){
            let updatedItem = null;

            let items = document.querySelectorAll(selectors.productListItems);
            items.forEach(item=>{
                if(item.classList.contains('bg-warning')){
                   item.children[1].textContent = prd.name;
                   item.children[2].textContent = prd.price+' $';
                   updatedItem = item;
                }
            });

            return updatedItem;
        }

    }

})();


//App Controller
const App = (function (ProductCtrl, UICtrl) {

    const UISelectors = UICtrl.getSelectors();
    const loadEventListeners = function () {
        //ürün ekleme
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

        //düzenleme click
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);

        //düzenleme submit 
        document.querySelector(UISelectors.updateBtn).addEventListener('click', editProductSubmit);

        //iptal butonu click
        document.querySelector(UISelectors.cancelBtn).addEventListener('click', canceProductClick);


    };

    //iptal buton click fonksiyon

    const canceProductClick = function(e){
        UICtrl.addingState();
        UICtrl.clearWarnings();

        e.preventDefault();
    }

    //ürün ekleme submit
    const productAddSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            //ürün ekleme
            const newProduct = ProductCtrl.addProduct(productName, productPrice);
            UIController.addProduct(newProduct);

            //toplam ürün fiyatı

            const total = ProductCtrl.getTotal();
            UICtrl.showTotal(total);


            //inputları temizle
            UIController.clearInput();


        } else {

        }

        e.preventDefault();
    };

    //ürün düzenleme click
    const productEditClick = function (e) {

        if (e.target.classList.contains('edit-product')) {
            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            const product = ProductCtrl.getProductById(id);
            ProductCtrl.setCurrentProduct(product);

            //ara yüze ekleme
            UICtrl.addProductToForm();

            UICtrl.editState(e.target.parentNode.parentNode);
        }


        e.preventDefault();
    };

    //ürün düzenleme submit 
    editProductSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        if (productName !== '' && productPrice !== '') {
            //güncelle
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

            //arayüzde güncelle
           let item = UICtrl.updateProduct(updatedProduct);
           const total = ProductCtrl.getTotal();
           UICtrl.showTotal(total);
           UICtrl.addingState();
           
        }
        e.preventDefault();
    }


    return {
        init: function () {
            console.log('proje start');
            UICtrl.addingState();
            const product = ProductCtrl.getProducts();
            if (product.length == 0) {
                UICtrl.hideCart();
            } else {
                UICtrl.createProductList(product);

            }

            loadEventListeners();


        }
    }


})(ProductController, UIController);

App.init();
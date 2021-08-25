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
        getCurrentProduct : function(){
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
        setCurrentProduct: function(product){
            data.selectedProduct = product;
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
        totalUsd: '#total-usd'
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

        hideCart: function () {
            document.querySelector(selectors.productCart).style.display = 'none';
        },

        showTotal: function (total) {
            document.querySelector(selectors.totalUsd).textContent = total;
            document.querySelector(selectors.totalTl).textContent = total * 8.4;

        },
        addProductToForm:function(){
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(selectors.productName).value = selectedProduct.name;
            document.querySelector(selectors.productPrice).value = selectedProduct.price;
        }
    }

})();


//App Controller
const App = (function (ProductCtrl, UICtrl) {

    const UISelectors = UIController.getSelectors();
    const loadEventListeners = function () {
        //ürün ekleme
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

        //düzenleme 
        document.querySelector(UISelectors.productList).addEventListener('click', productEditSubmit);

    };

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

    //ürün düzenleme submit
    const productEditSubmit = function (e) {

        if (e.target.classList.contains('edit-product')) {
            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            const product = ProductCtrl.getProductById(id);
            ProductCtrl.setCurrentProduct(product);

            //ara yüze ekleme
            UICtrl.addProductToForm();
        }


        e.preventDefault();
    };


    return {
        init: function () {
            console.log('proje start');
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
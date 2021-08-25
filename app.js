//Storage Controller
const StorageController = (function(){

})();

//Product Controller
const ProductController=(function(){

    //private alanlar
    const Product = function(id,name,price){
        this.id = id;
        this.name = name;
        this.price  = price;
    }

    const data ={
        products:[],
        selectedProduct :null,
        totalPrice :0
    }

    //public alan
    return {
        getProducts:function(){
            return data.products;
        },

        getData : function(){
            return data;
        },
        addProduct:function(name,price){
            let id;
            if(data.products.length>0){
                id = data.products[data.products.length-1].id+1;
               
            }else{
                id = 1; 
            }

            const newProduct = new Product(id,name,parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        }
    }
     createProductList   

})();

//UI Controller
const UIController = (function(){

    const selectors={
        productList :'#item-list',
        addButton: '.addBtn',
        productName :'#ProductName',
        productPrice: '#ProductPrice',
        productCart :'#productCart'
    }

    return {
        createProductList :function(products){
            let html ='';

            products.forEach(item=>{
                html += `
                <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td class="text-right">
                 <button type="submit" class="btn btn-warning btn-sm">
                        <i class="fas fa-edit"></i>
                 </button></td>
            </tr>`;

            })
           

           document.querySelector(selectors.productList).innerHTML = html;
        },

        getSelectors :function(){
            return selectors;
        },

        addProduct:function(item){
            document.querySelector(selectors.productCart).style.display='block';
           var item =`
           <tr>
           <td>${item.id}</td>
           <td>${item.name}</td>
           <td>${item.price}</td>
           <td class="text-right">
            <button type="submit" class="btn btn-warning btn-sm">
                   <i class="fas fa-edit"></i>
            </button></td>
       </tr>
            
           `; 
           document.querySelector(selectors.productList).innerHTML += item;

        },

        clearInput : function(){
            document.querySelector(selectors.productName).value ='';
            document.querySelector(selectors.productPrice).value ='';
        },

        hideCart : function(){
            document.querySelector(selectors.productCart).style.display='none';
        }
    }

})();


//App Controller
const App = (function(ProductCtrl,UICtrl){

    const UISelectors = UIController.getSelectors();
    const loadEventListeners = function(){
        //ürün ekleme
        document.querySelector(UISelectors.addButton).addEventListener('click',productAddSubmit);
    };
    const productAddSubmit = function(e){
            
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName!=='' && productPrice !==''){
            //ürün ekleme
          const newProduct =  ProductCtrl.addProduct(productName,productPrice);
         UIController.addProduct(newProduct);
         UIController.clearInput();
         

        }else{

        }
        
        e.preventDefault();
    };


    return {
        init:function(){
            console.log('proje start');
            const product = ProductCtrl.getProducts();
            if(product.length==0){
                UICtrl.hideCart();
            }else{
                UICtrl.createProductList(product);
           
            }

            loadEventListeners();

           
        }
    }


})(ProductController,UIController);

App.init();
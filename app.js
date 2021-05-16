
const ItemCtrl = (function(){
  const Item = function(id, name, kalorien){
    this.id= id;
    this.name= name;
    this.kalorien= kalorien
  }

  const data={
    item:[
   /*    {id:0, name: "steak", kalorien: 1220},
      {id:1, name: "steak", kalorien: 1220},
      {id:2, name: "steak", kalorien: 1220} */
    ],
    currentItem : null,
    totalKalorien: 0
  }
  return{
    getData: data,
    inputAddieren : function(name, kalorien){
      const neueId = data.item.length;
      const neueItem = new Item(neueId, name, parseInt(kalorien));

      data.item.push(neueItem);
      return neueItem;
    },
    deleteItem : function(id){
      const ids = data.item.map((item)=>{
        return item.id
      });
      const index = ids.indexOf(id);
      data.item.splice(index,1);
    },
    LoschAllItem : function(){
      data.item = [];
      data.totalKalorien= 0;
      return data
    }
  ,
    aktuelleItem : function(id){
      data.item.forEach((item)=>{
        if(item.id == id){
          data.currentItem = item;
        }
      })
     return data.currentItem;
    },
    updateItem : function(neueItem){
      let gefuden =null;
      data.item.forEach((item)=>{
        if(data.currentItem.id === item.id){
          item.name = neueItem.name;
        item.kalorien = parseInt(neueItem.kalorien);
        gefuden= item;
        }
      })
      return gefuden;
    },
  
    logCurrent: function(){
      return data.currentItem;
    },
    getItems: function(){
      return  data.item;
    }
      
    ,
    totalKalorie: function(items){
      let kalorien= 0;
      items.forEach((item)=>{
        kalorien+= item.kalorien;
      })
      data.totalKalorien = kalorien;
      return data.totalKalorien;
    }
  }
})()


const UICtrl =(function(){
  const UISelectors ={
    list : '#item-list',
    addBtn : ".add-btn",
    mahlzeitInput : "#meal",
    kalorienInput : "#kalorien" ,
    totalKalorien : ".total-kalorien",
    updateBtn :".update-btn",
    deleteBtn : ".delete-btn",
    backBtn : ".back-btn",
    loeschAll : '.clear-btn'
  }
  return{
    showData: function(items){
      let html = "";
      items.forEach((item)=>{
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name} :</strong><em>${item.kalorien} Kalorien</em>
        <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i></a></li>`;
      })
      document.querySelector(UISelectors.list).innerHTML= html;
    },
    getItemInput : function() {
      return{
        name : document.querySelector(UISelectors.mahlzeitInput).value,
       kalorien :document.querySelector(UISelectors.kalorienInput).value
      }   
    },
    UIaddInput: function(neueItem){
      document.querySelector(UISelectors.list).style.display = "block";

      const li = document.createElement('li');
      li.className = "collection-item";
      li.id= `item-${neueItem.id}`;
      li.innerHTML= `<strong>${neueItem.name}:</strong><em> ${neueItem.kalorien} Kalorien</em>
      <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i></a>`;
    
  
      document.querySelector(UISelectors.list).append(li);
    },
    InputEntleeren : function(){
      document.querySelector(UISelectors.mahlzeitInput).value= "";
       document.querySelector(UISelectors.kalorienInput).value= "";
    },
    topBorderVerstecken: function(){
      document.querySelector(UISelectors.list).style.display = "none";
    },
    setTotal: function(total){
        document.querySelector(UISelectors.totalKalorien).textContent = total;
    },
    btnAnfangsZustand: function(){
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    btnNeuerZustand: function(){
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    }
    ,
     inputZustandleeren: function(){
       UICtrl.InputEntleeren();
       UICtrl.btnAnfangsZustand();
     },
     neueInputValue : function(){
      document.querySelector(UISelectors.mahlzeitInput).value= ItemCtrl.logCurrent().name;
      document.querySelector(UISelectors.kalorienInput).value= ItemCtrl.logCurrent().kalorien;
     },
     updateList: function(item){
      let listItems = document.querySelectorAll('li');
      listItems = Array.from(listItems);
      console.log(listItems);
      listItems.forEach((listItem)=>{
        let itemID = listItem.getAttribute('id');
        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML =  `<strong>${item.name} :</strong><em>${item.kalorien} Kalorien</em> 
          <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i></a>`;
        }
      })
      console.log(listItems);
     },
     deleteItemList : function(id){
       const itemId = `#item-${id}`;
       document.querySelector(itemId).remove();
     },
     loeschList: function(){
       let list =document.querySelectorAll(".collection-item");
       list = Array.from(list); 
       list.forEach((item)=>{
         item.remove(); 
       })
     }
    ,
    getSelectors:function(){
      return UISelectors;
    }
  }
})()

const App = (function(ItemCtrl, UICtrl){
  const selectors = UICtrl.getSelectors();


  const loadEvents = function(){
    document.querySelector(selectors.addBtn).addEventListener('click', itemAddieren);
    document.addEventListener('keypress', (e)=>{
      if(e.keyCode == 13 || e.which == 13){
        e.preventDefault();
        return false
      }
    })
    document.querySelector(selectors.list).addEventListener('click', itemBearbeitenClick);

    document.querySelector(selectors.updateBtn).addEventListener('click', itemBearbeiten);

    document.querySelector(selectors.backBtn).addEventListener('click', zueruckClick);


    document.querySelector(selectors.deleteBtn).addEventListener('click', loschItem);
    
    document.querySelector(selectors.loeschAll).addEventListener('click', loeschAll);

  }

     const itemAddieren = function(e){ 
    const input =UICtrl.getItemInput();

    if(input.name !== "" && input.kalorien !== ""){

      const neueItem =  ItemCtrl.inputAddieren(input.name, input.kalorien);
      UICtrl.UIaddInput(neueItem);

      const total =ItemCtrl.totalKalorie(ItemCtrl.getItems());
      
      UICtrl.setTotal(total);

      UICtrl.InputEntleeren();
    }
    e.preventDefault();
  }

  const itemBearbeitenClick = function(e){
    if(e.target.parentElement.parentElement.parentElement.classList.contains("collection")){
        const idTag = e.target.parentElement.parentElement.id;
        const id = idTag.split("-")[1];
        const akutell = ItemCtrl.aktuelleItem(id);
       // UICtrl.neueInputValue(aktuell);
        UICtrl.neueInputValue();
        ItemCtrl.logCurrent();
        UICtrl.btnNeuerZustand();
    }

    e.preventDefault();
  }


  const itemBearbeiten = function(e){
    const input = UICtrl.getItemInput();
    const updateInput = ItemCtrl.updateItem(input);
    UICtrl.updateList(updateInput);
    const total =ItemCtrl.totalKalorie(ItemCtrl.getItems()); 
    UICtrl.setTotal(total);
    UICtrl.InputEntleeren();
    UICtrl.btnAnfangsZustand();
    e.preventDefault();
  }

  const zueruckClick = function(e){
    UICtrl.InputEntleeren();
    UICtrl.btnAnfangsZustand();
    e.preventDefault();
  }

  const loschItem = function(e){
    const aktuellItem = ItemCtrl.logCurrent();
    ItemCtrl.deleteItem(aktuellItem.id);
    UICtrl.deleteItemList(aktuellItem.id);
    const total =ItemCtrl.totalKalorie(ItemCtrl.getItems());
    UICtrl.setTotal(total);
    UICtrl.InputEntleeren();
    UICtrl.btnAnfangsZustand();
    e.preventDefault();
  }

const loeschAll = function(e){
  ItemCtrl.LoschAllItem();
  console.log('item',ItemCtrl.LoschAllItem());
  UICtrl.loeschList();
  const total =ItemCtrl.totalKalorie(ItemCtrl.LoschAllItem().item);
  UICtrl.setTotal(total);
  console.log(ItemCtrl.getItems());
  console.log(total);

  UICtrl.topBorderVerstecken();

  UICtrl.btnAnfangsZustand();
  UICtrl.InputEntleeren();

  e.preventDefault();
}
  return{
    init : function(){
      UICtrl.inputZustandleeren();
      const items = ItemCtrl.getItems();
      if(items.length > 0 ){
        UICtrl.showData(items);
      }else{
        UICtrl.topBorderVerstecken();
      }
      const total =ItemCtrl.totalKalorie(ItemCtrl.getItems());
      UICtrl.setTotal(total);

      loadEvents();
    }
  }
})(ItemCtrl, UICtrl)

App.init();

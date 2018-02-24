function MenuItem(icon, handler, group) {
  var mi = this;
  this.icon = icon;
  this.handler = handler;
  this.tag = document.createElement('div');
  this.tag.className = 'menu-item';
  this.tag.innerHTML = decodeURIComponent(this.icon);
  this.tag.addEventListener('click', function(e) {
    initMap.colorClassName = group.className;
    this.handler.call(this.tag);
  }.bind(this), false);
}

function Menu(items, Theme){
  this.items = items || [];
  this.open = function() {
    theme(items);
  }
}

var clickedX = 0;
var clickedY = 0;

var housesMenu = houses.icons.keys().map(function(key) {
  return new MenuItem(houses.icons[key], function() {
    selectIcon(this);
    closeMenus();
  }, houses);
});

var wallsMenu = walls.icons.keys().map(function(key) {
  return new MenuItem(walls.icons[key], function() {
    selectIcon(this);
    closeMenus();
  }, walls);
});

var stairsMenu = stairs.icons.keys().map(function(key) {
  return new MenuItem(stairs.icons[key], function() {
    console.log(this);
    selectIcon(this);
    closeMenus();
  }, stairs);
});
var placeablesMenu = placeables.icons.keys().map(function(key) {
  return new MenuItem(placeables.icons[key], function() {
    console.log(this);
    selectIcon(this);
    closeMenus();
  }, placeables);
});


var floorsMenu = floors.icons.keys().map(function(key) {
  return new MenuItem(floors.icons[key], function() {
    selectIcon(this);
    closeMenus();
  }, floors);
});

var allMenu = housesMenu.concat(wallsMenu, stairsMenu, floorsMenu, placeablesMenu);

document.body.addEventListener('contextmenu', function(e) {
  closeMenus();
  clickedX = e.x;
  clickedY = e.y;
  console.log(allMenu);
  radialMenu(allMenu, e.x, e.y);
});

function selectIcon(element) {
  console.log(encodeURIComponent(element.innerHTML));
  initMap.currentIcon = encodeURIComponent(element.innerHTML);
}

function closeMenus() {
  var menus = document.getElementsByClassName('menu-container');
  for(var i = 0; i < menus.length; i += 1) {
    menus[i].parentNode.removeChild(menus[i]);
  }
}

function radialMenu(items, x, y) {
  var r = 128;
  var itemSize = 32;
  var step = 2*Math.PI / items.length;

  var container = document.createElement('div');
  var w = r *2 + itemSize;
  container.style.width = w + "px";
  container.style.height = w + "px";
  container.style.position = "absolute";
  container.style.top = y - w/2 + "px";
  container.style.left = x - w/2 + "px";
  container.className = "menu-container";
  document.body.appendChild(container);
  var ix,iy;
  for(var i = 0; i < items.length; i += 1) {
    ix = r * Math.cos(i * step);
    iy = r * Math.sin(i * step);
    items[i].tag.style.top = iy + w/2 -16 + "px";
    items[i].tag.style.left = ix + w/2 -16 + "px";
    container.appendChild(items[i].tag);
  }
}

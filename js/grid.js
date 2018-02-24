function initMap() {
  var body = document.getElementById('map-container');
  initMap.container = body;
  var w = 64;
  var h = 64;
  var list, grid;
  if(localStorage.lastSavedMap) {
    grid = JSON.parse(localStorage.lastSavedMap);
    list = grid.keys();
  }

  var total = list ? list.length : 256;
  var icon;
  for(var i = 0; i < total; i += 1) {
    if(list) icon = grid[list[i]];
    body.appendChild(new Tile(icon, getClass(icon)).tag);
  }
}

function getIndex(x, y) {
  return (y + 1) * x;
}

function collectGrid() {
  var frame = initMap.container;
  var w = frame.children[0].offsetWidth;
  var h = frame.children[0].offsetHeight;
  var fw = frame.offsetWidth;
  var fh = frame.offsetHeight;
  var x = (fw - fw % w) / w;
  var y = (fh - fh % h) / h;

  var grid = {};
  var index = -1;
  for(var i = 0; i < y; i += 1) {
    for(var j = 0; j < x; j += 1) {
      index += 1;
      grid[j + ":" + i] = encodeURIComponent( frame.children[index].innerHTML );
    }
  }
  window.localStorage.lastSavedMap = JSON.stringify(grid);
}

function Tile(icon, className) {
  icon = icon || walls.icons["diagonal-1"];
  className = className ? " " + className : "";
  this.width = 64;
  this.height = 64;
  this.tag = document.createElement('div');
  this.tag.className = 'map-tile' + className;
  this.tag.innerHTML = decodeURIComponent(icon);
  this.tag.addEventListener('mouseover', drawTile, false);
}

function drawTile(e) {
  if(!initMap.currentIcon || !initMap.drawing) return;
  this.innerHTML = decodeURIComponent(initMap.currentIcon);
  this.className = "map-tile " + initMap.colorClassName
}

var houses = {
  className: "houses",
  icons: {
    "greek": "%E2%9F%B0",
    "greek-thin": "%E2%A4%8A"
  }
};

var floors = {
  className: "floors",
  icons: {
    "checkered": "%E2%96%A9"
  }
};

var walls = {
  className: "walls",
  icons: {
    "diagonal-1": "%E2%96%A8",
    "diagonal-2": "%E2%96%A7"
  }
};

var stairs = {
  className: "stairs",
  icons: {
    "left-right": "&#9637;",
    "up-down": "&#9636;"
  }
};

var placeables = {
  className: "placeables",
  icons: {
    "fountain": "%E2%9B%B2"
  }
};

function getClass(entity) {
  if(houses.icons.hasValue(entity)) return houses.className;
  if(floors.icons.hasValue(entity)) return floors.className;
  if(walls.icons.hasValue(entity)) return walls.className;
  if(placeables.icons.hasValue(entity)) return placeables.className;
  if(stairs.icons.hasValue(entity)) return stairs.className;
  return "";
}
Object.prototype.keys = function() {
  return Object.keys(this).filter(function(key) {
    return typeof this[key] !== 'function';
  });
};

Object.prototype.values = function() {
  var that = this;
  return Object.keys(this).filter(function(key) {
    return typeof this[key] !== 'function';
  }).map(function(key) {
    return that[key];
  });
};

Object.prototype.append = function() {
  var obj;
  for(var i = 0; i < arguments.length; i += 1) {
    obj = arguments[i];
    if(!obj) return;
    for(var key in obj)  {
      if(typeof this[key] !== 'function') this[key] = obj[key];
    }
  }
  return this;
};
Object.prototype.any = function() {
  var keys = this.keys();
  return this[keys[Math.floor(Math.random() * keys.length)]];
};

Object.prototype.hasValue = function(value) {
  for(var key in this) {
    if(typeof this[key] === 'function') continue;
    if(this[key] === value) return key;
  }
  return false;
};

document.body.addEventListener('mousedown', function(e){
  if(e.button === 2) return;
  initMap.drawing = true;
  if(e.target.classList.contains("map-tile")) drawTile.call(e.target, e);
}, false);

document.body.addEventListener('mouseup', function(e){
  initMap.drawing = false;
}, false);

window.addEventListener('keyup', function(e) {
  var escape = 27;
  if(e.keyCode === escape) {
    closeMenus();
    initMap.currentIcon = null;
  }
}, false);
initMap();

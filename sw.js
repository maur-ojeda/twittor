//imports
importScripts("js/sw-utils.js");

// Diferentes tipos de cache a utilizar
const STATIC_CACHE = "static-v2";
const DYNAMIC_CACHE = "dynamic-v1";
//assets que nunca cambiaran
const INMUTABLE_CACHE = "inmutable-v1";

// assets a cargar en los diferentes cache
const APP_SHELL = [
  //"/",
  "index.html",
  "css/style.css",
  "img/favicon.ico",
  "img/avatars/hulk.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/spiderman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "js/app.js",
  "js/sw-utils.js"
];

const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js"
];

// instalacion
self.addEventListener("install", event => {
  //instalacion de chache estatico
  const cacheStatic = caches
    .open(STATIC_CACHE)
    .then(cache => cache.addAll(APP_SHELL));
  //instalacion de cache inmutable
  const cacheInmutable = caches
    .open(INMUTABLE_CACHE)
    .then(cache => cache.addAll(APP_SHELL_INMUTABLE));
  event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});
//Al cambiar service workers actualizar el cache existente
self.addEventListener("activate", event => {
  //comparamos diferencias entre el cache existente
  const respuesta = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }
    });
  });
  event.waitUntil(respuesta);
});

self.addEventListener("fetch", event => {
  // se revisa si esiste la request
  const respuesta = caches.match(event.request).then(res => {
    if (res) {
      return res;
      //deberia responder solo lo que le hemos instalado en static e inmutable
    } else {
      // si la respuesta no se encuentra dispara undefined
      console.log(event.request.url);
      return fetch(event.request).then(newRes => {
        return actualizaCacheDinamico(DYNAMIC_CACHE, event.request, newRes);
      });
    }
  });

  event.respondWith(respuesta);

//  event.waitUntil();
});

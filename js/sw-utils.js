/**
 * guardar en el cache dinamico
 */
function actualizaCacheDinamico(dynamicCache, req, res) {
  //Si la respueta tiene data, hay que almacenarla en el cache
  if (res.ok) {
    // se abre el cache correspondiente
    return caches.open(dynamicCache).then(cache => {
      //clono la respuesta recibida
      cache.put(req, res.clone());
      return res.clone();
    });
  } else {
    //si regresa algo aqui es que fallo el cache y la red
    return res;
  }
}

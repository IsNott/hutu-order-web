import { get, post } from "@/request/request";

export const orderAPI = {
  getCatalogByShop(shopId) {
    return get(`/bizMenuCatalog/listByShop/${shopId}`)
  },
  getMenuByShop(shopId, catalogId) {
    return get(`/bizMenu/listByShopCatalogId/${shopId}`)
  },
  
  queryMyPackage(data) {
    return get('/bizPackage/queryMyPackage', data)
  },
  queryMySeachHistory(id) {
    return get('/bizMenu/queryMySeachHistory/' + id)
  },
  queryRecommendMenu(shopId) {
    return get('/bizMenu/queryRecommendMenu/' + shopId)
  },
  queryMenu(data){
    return post('/bizMenu/query', data)
  },
  saveSearchHistory(data){
    return post('/bizMenu/saveSearchHistory', data)
  },
  clearSearchHistory(id) {
    return get('/bizMenu/clearSearchHistory/' + id)
  },
}

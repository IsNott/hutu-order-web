import { get, post } from "@/request/request";

export const orderAPI = {
  getCatalogByShop(shopId) {
    return get(`/bizMenuCatalog/listByShop/${shopId}`)
  },
  getMenuByShop(shopId, catalogId) {
    return get(`/bizMenu/listByShopCatalogId/${shopId}`)
  }
}

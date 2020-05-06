/**
 * 高德地图搜索
 */
import JcMapSearchBase from '../../base/JcMapSearch'
import { SearchOptions } from '../config'

class JcMapSearch extends JcMapSearchBase {
  /**
  * 构造
  * @param {*} options
  * @param {Object} options.debug 配置 设法开启debug 模式，默认true
  * @param {JcMap} options.map JcMap地图对象
  */
  constructor(options = {}) {
    super(options)
    this.placeSearch = new this.map.AMap.PlaceSearch(SearchOptions.PlaceSearchOptions)
  }

  /**
   * 搜索
   * @param {String} keywords 搜索关键字
   */
  async search(keywords) {
    let results = []

    if (keywords) {
      results = await new Promise((resolve) => {
        this.placeSearch.search(keywords, (status, result) => {
          let list = []

          if (status == 'complete') {
            if (result.poiList.pois && result.poiList.pois.length) {
              result.poiList.pois.forEach(item => {
                list.push({ id: item.id, name: item.name, center: [item.location.lng, item.location.lat] })
              })
            }
          }
          resolve(list)
        })
      })
    }

    return results
  }

  /**
   * 地图自适应 显示搜索内容
   * @param {Array} center 坐标点 [lng,lat]
   */
  fitView(center) {
    this.map.map.setZoomAndCenter(17, center)
  }
}

export default JcMapSearch

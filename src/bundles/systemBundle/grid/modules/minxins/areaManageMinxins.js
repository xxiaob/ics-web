/**
 * 区域编辑
 */
import { JcMapEditor } from '@/map'
import { areaSave } from '@/api/area'
import { MAP_SIGN_TYPE } from '@/constant/CONST'
import { signEditDataFormat } from '@/libs/apiFormat'

let myJcMapEditor //承载编辑体

let myJcMap //地图对象

export default {
  data() {
    return {
      editShow: false,
      startEdit: false,
      areaId: ''
    }
  },
  methods: {
    initMapEditor(map, data) {
      myJcMap = map
      this.editShow = true
      this.areaId = data.id

      this.getSign(myJcMap, this.areaId).then(sign => {
        sign.fitView()
        sign.hide()
        myJcMapEditor = new JcMapEditor({ map: myJcMap, sign, icon: data.icon, name: data.name })
        myJcMapEditor.on('change', () => {
          this.startEdit = true
        })
      })
    },
    endMapEditor() {
      this.statusCheck(() => {
        this.editShow = false
        if (myJcMapEditor) {
          myJcMapEditor.destroy()
          myJcMapEditor = null
        }
        this.areaId = null
      })
    },
    checkWork(cb) {
      if (this.editShow) {
        this.$message.error('有网格正在编辑中，请先取消编辑')
      } else {
        cb()
      }
    },
    addArea(type) {
      if (type == 1) {
        myJcMapEditor.addArea(MAP_SIGN_TYPE.Polygon)
      } else if (type == 2) {
        myJcMapEditor.addArea(MAP_SIGN_TYPE.Circle)
      } else if (type == 3) {
        myJcMapEditor.addArea(MAP_SIGN_TYPE.Polyline)
      }
    },
    cancel() {
      this.statusCheck(() => {
        this.getSign(myJcMap, this.areaId).then(sign => {
          this.endMapEditor()
          sign.show()
          myJcMap.fitView()
        })
      })
    },
    areaSave() {
      if (this.startEdit) {
        this.$confirm('确认保存当前设置', '提示', { type: 'warning' }).then(() => {
          let params = { areaId: this.areaId, drawCoordinateType: 1, griddingUptType: 2 }

          Object.assign(params, this.getData())
          areaSave(params).then(() => {
            this.startEdit = false
            this.endMapEditor()
            this.refreshSign(myJcMap, params.areaId)
          })
        }).catch(() => { })
      } else {
        this.$message.error('您未更改数据')
      }
    },
    getData() {
      return signEditDataFormat(myJcMapEditor.getData())
    },
    statusCheck(cb) {
      if (this.startEdit) {
        this.$confirm('您正在编辑中，确认取消编辑', '提示', { type: 'warning' }).then(() => {
          this.startEdit = false
          cb()
        }).catch(() => { })
      } else {
        cb()
      }
    },
    reset() {
      this.statusCheck(() => {
        myJcMapEditor.reset()
      })
    }
  }
}

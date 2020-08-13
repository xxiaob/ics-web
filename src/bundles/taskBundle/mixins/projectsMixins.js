import { projectsTreeList } from '@/api/projects'
import { PROJECT_TYPES } from '@/constant/Dictionaries'

export default {
  data() {
    return {
      projectList: [],
      projectObj: {},
      EmergencySupport: []
    }
  },
  methods: {
    formatProject(row, column, cellValue) {
      return this.projectObj[cellValue]
    },
    async getProjects() {
      const res = await projectsTreeList()

      this.projectList = res
      this.projectObj = this.formatProjectTreeToObj(res)
    },
    formatProjectTreeToObj(child) {
      let objs = {}

      if (child && child.length) {
        child.forEach(item => {
          if (item.sonProjects && item.sonProjects.length) {
            objs = Object.assign(objs, this.formatProjectTreeToObj(item.sonProjects))
          }
          objs[item.id] = item.name

          //应急项目
          if (item.type == PROJECT_TYPES.EmergencySupport) {
            this.EmergencySupport.push(item)
          }
        })
      }
      return objs
    }
  }
}

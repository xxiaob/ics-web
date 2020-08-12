import { projectsTreeList } from '@/api/projects'

export default {
  data() {
    return {
      projectList: [],
      projectObj: {}
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
        })
      }
      return objs
    }
  }
}

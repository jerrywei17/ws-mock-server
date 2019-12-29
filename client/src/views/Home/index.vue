<template>
  <div class="home-container">
    <el-row>
      <el-col :offset="4" :span="16">
        <el-table :data="projects" stripe>
          <el-table-column label="名稱">
            <template slot-scope="scope">
              <el-button type="text" @click="$router.push({path: `/project/${scope.row._id}`})">{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="id" prop="_id" ></el-table-column>
          <el-table-column label="描述" prop="description">
          </el-table-column>
          <el-table-column label="設置">
            <template slot-scope="scope">
              <el-button type="text" @click.stop="$store.dispatch('deleteProject', scope.row._id)">刪除</el-button>
              <el-button type="text" @click.stop="editProject(scope.row)">編輯</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row class="p-t-lg">
      <el-button type="primary" size="mediumn" @click="addProject">新增</el-button>
    </el-row>
    <el-dialog
      append-to-body
      :title="`${dialog.mode === 'add'? '新增' : '編輯'}專案`"
      :visible.sync="dialog.visible"
      @closed="reset">
      <el-form :model="projectInfo">
        <el-form-item label="名称">
          <el-input v-model="projectInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="projectInfo.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { createComponent, ref, computed, reactive } from '@vue/composition-api'
import { createProject, updateProject } from '@/service'
import { chunk } from 'lodash'

type EditProject = {
  _id:string,
  name:string,
  description:string
}

export default createComponent({
  setup (props, { root }) {
    const projects: Ref = computed(() => root.$store.state.projects)
    const projectChunks = computed(() => chunk(projects.value, 4))

    const submit = () => {
      if(dialog.mode === 'add'){
        createProject(projectInfo.value).then(res => {
          root.$store.commit('addProject', res)
          visible.value = false
        })
      } else {
        updateProject(projectId.value, projectInfo.value).then(res => {
          root.$store.commit('updateProject', res)
          dialog.visible = false
        })
      }
    }

    const visible = ref(false)
    const projectInfo = ref({
      name: '',
      description: ''
    })
    const reset = () => {
      projectInfo.value = {
        name: '',
        description: ''
      }
    }

    const dialog = reactive({
      visible: false,
      mode: ''
    })

    const mode = ref()
    const addProject = () => {
      dialog.mode = 'add'
      dialog.visible = true
    }
    const projectId = ref('')
    const editProject = ({_id, name, description}: EditProject) => {
      dialog.mode = 'edit'
      dialog.visible = true
      projectId.value = _id
      projectInfo.value = {
        name,
        description
      }
    }

    return {
      projects,
      submit,
      visible,
      reset,
      dialog,
      projectInfo,
      addProject,
      editProject
    }
  }
})
</script>

<style lang="scss" scoped>
.home-container  {
  padding: 20px;
  text-align: center;
}
.el-card {
  position: relative;
  top: 0;
  transition: top .3s ease;
  &:hover {
    top: -10px;
  }
  cursor: pointer;
}
.card-heaer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

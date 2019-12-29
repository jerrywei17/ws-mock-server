<template>
  <div class="project-container">
    <h1 class="title">{{project.name}}</h1>
    <el-row>
      <el-col :offset="4" :span="16">
        <el-table :data="events" stripe>
          <el-table-column label="名稱" prop="name">
          </el-table-column>
          <el-table-column label="內容" prop="content" >
            <template slot-scope="scope">
              <div v-if="scope.row.content&&scope.row.content.length<30">
                {{scope.row.content}}
              </div>
              <el-popover
                v-else
                placement="bottom"
                width="600"
                trigger="hover"
                :content="scope.row.content">
                <div slot="reference">...</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="狀態">
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.enabled"
                @input="changeStatus($event, scope.row._id)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="設置">
            <template slot-scope="scope">
              <el-button type="text" @click.stop="$store.dispatch('deleteMockEvent', scope.row)">刪除</el-button>
              <el-button type="text" @click.stop="editEvent(scope.row)">編輯</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row class="p-t-lg">
      <el-button type="primary" size="mediumn" @click="addEvent">新增</el-button>
    </el-row>
    <el-dialog
      append-to-body
      :title="`${dialog.mode === 'add'? '新增' : '編輯'}事件`"
      :visible.sync="dialog.visible"
      @closed="reset">
      <el-form :model="eventInfo">
        <el-form-item label="名称">
          <el-input v-model="eventInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="內容">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            rows="10"
            v-model="eventInfo.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitEvent">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { createComponent, ref, computed, reactive } from '@vue/composition-api'
import { createMockEvent, updateMockEvent } from '@/service'
type EditEvent = {
  _id:string,
  name:string,
  content:string,
  enabled: boolean
}

export default createComponent({
  setup (props, { root }) {
    let id: string = root.$route.params.id
    const events:Ref = ref([])
    root.$store.dispatch('fetchProjectMockEvent', id).then((res: Array<Object>) => {
      events.value = res
    })
    const submitEvent = () => {
      if(dialog.mode === 'add'){
        createMockEvent(id ,eventInfo.value).then(res => {
          root.$store.commit('addMockEvent', res)
          dialog.visible = false
        })
      } else {
        updateMockEvent(eventId.value, eventInfo.value).then(res => {
          root.$store.commit('updateMockEvent', res)
          dialog.visible = false
        })
      }
    }

    const changeStatus = (val: boolean, id: string) => {
      updateMockEvent(id, {enabled: val}).then(res => {
        root.$store.commit('updateMockEvent', res)
      })
    }

    const dialog = reactive({
      visible: false,
      mode: ''
    })
    const eventInfo = ref({
      name: '',
      content: '',
      enabled: false
    })
    const reset = () => {
      eventInfo.value = {
        name: '',
        content: '',
        enabled: false
      }
    }
    const project = computed(() => root.$store.state.projects.find((p:Project) => p._id === id) || {})

    const mode = ref()
    const addEvent = () => {
      dialog.mode = 'add'
      dialog.visible = true
    }
    const eventId = ref('')
    const editEvent = ({_id, name, content, enabled}: EditEvent) => {
      dialog.mode = 'edit'
      dialog.visible = true
      eventId.value = _id
      eventInfo.value = {
        name,
        content,
        enabled
      }
    }

    return {
      project,
      events,
      submitEvent,
      dialog,
      reset,
      eventInfo,
      addEvent,
      editEvent,
      changeStatus
    }
  }
})

</script>

<style lang="scss" scoped>
.project-container {
  text-align: center;
}
.title {
  height: 100px;
  line-height: 100px;
  font-weight: bold;
  font-size: 20px;
}
</style>

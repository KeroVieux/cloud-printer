<template>
    <div>
        <Modal
                  v-model="editing"
                  :loading="saving"
                  title="编辑图文">
            <div class="fix p-l-10 p-r-10">
                <div class="upload-preview tc m-b-20 l">
                    <figure>
                        <img :src="`${thumbnail}?imageView2/1/w/100/h/100/interlace/0/q/100`" class="rounded bd-blue m-r-5" v-for="thumbnail in thumbnails"/>
                    </figure>
                </div>
                <QiniuUpload :multiple="true" @complete="uploadComplete" ref="qiniuUpload" class="l">
                    <a></a>
                </QiniuUpload>
            </div>
            <div class="m-b-10"></div>
            <Form :model="editingPost" ref="editingForm" :label-width="80" :rules="editingRules">
              <Form-item label="状态" prop="status">
                <Input v-model="editingPost.status" placeholder="请输入">
                </Input>
              </Form-item>
              <Form-item label="图文内容" prop="content">
                <Input v-model="editingPost.content" type="textarea" :autosize="{minRows: 4,maxRows: 10}" placeholder="请输入...">
                </Input>
              </Form-item>

              <Form-item>
                <Button class="r" type="primary" @click="handleSubmit('editingForm')">提交</Button>
              </Form-item>
            </Form>
            <div slot="footer"></div>
          </Modal>
        <div class="ivu-article">
            <h1>文章列表</h1>
            <div class="anchor p-t-20 p-b-10">
                <h2>概述</h2>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab, cupiditate doloribus, esse, expedita in
                ipsa itaque iure laudantium non nulla perferendis porro quaerat quos sed sunt voluptas. Dolore,
                ullam!</p>
            <blockquote>注意：非 template/render 模式下，需使用 <code>i-table</code>。</blockquote>
            <!--<div class="fix">
                <div class="upload-preview tc m-b-20 l">
                    <figure>
                        <img :src="thumbnail" class="rounded bd-blue m-r-5" v-for="thumbnail in thumbnails"/>
                    </figure>
                </div>
                <QiniuUpload :multiple="true" @complete="uploadComplete" ref="qiniuUpload" class="l">
                    <a></a>
                </QiniuUpload>
            </div>-->
            <div>
                <div class="hr"></div>
                <Form :model="formItem" ref="formInline" :label-width="80" inline>
                    <Form-item label="输入框">
                        <Input v-model="formItem.input" placeholder="请输入">
                        </Input>
                    </Form-item>
                    <Form-item label="选择器">
                        <Select v-model="formItem.select" placeholder="请选择">
                            <Option value="beijing">北京市</Option>
                            <Option value="shanghai">上海市</Option>
                            <Option value="shenzhen">深圳市</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="日期控件">
                        <Row>
                            <Col span="11">
                            <Date-picker type="date" placeholder="选择日期" v-model="formItem.date"></Date-picker>
                            </Col>
                            <Col span="2" style="text-align: center">
                            -</Col>
                            <Col span="11">
                            <Time-picker type="time" placeholder="选择时间" v-model="formItem.time"></Time-picker>
                            </Col>
                        </Row>
                    </Form-item>
                    <Form-item label="单选框">
                        <Radio-group v-model="formItem.radio">
                            <Radio label="male">男</Radio>
                            <Radio label="female">女</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item label="多选框">
                        <Checkbox-group v-model="formItem.checkbox">
                            <Checkbox label="吃饭"></Checkbox>
                            <Checkbox label="睡觉"></Checkbox>
                            <Checkbox label="跑步"></Checkbox>
                            <Checkbox label="看电影"></Checkbox>
                        </Checkbox-group>
                    </Form-item>
                </Form>
                <div class="tr">
                    <Button type="ghost" style="margin-left: 8px">取消</Button>
                    <Button type="primary">筛选</Button>
                </div>
                <div class="hr"></div>
                <div class="tr m-b-15">
                    <Button type="primary" @click="add">新增</Button>
                </div>
            </div>
            <Table height="500" border :columns="columns2" :data="postsList" class="w-100 m-b-15"></Table>
            <div class="fix">
                <Page :total="count" :page-size="pageSize" @on-change="changePage" class="r"></Page>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
  import QiniuUpload from '../common/qiniuUpload.vue'
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'

  export default{
    components: {
      QiniuUpload,
    },
    data() {
      return {
        currentUserData: null,
        pageSize: 10,
        count: 0,
        thumbnails: [],
        editing: false,
        saving: false,
        editingPost: {},
        editingRules: {
          content: { required: true, max: 500, message: '最多500个文字', trigger: 'blur' },
        },
        formItem: {
          input: '',
          select: '',
          radio: 'male',
          checkbox: [],
          date: '',
          time: '',
          textarea: '',
        },
        columns2: [
          {
            title: 'objectId',
            key: 'objectId',
            fixed: 'left',
            width: 200,
          },
          {
            title: '状态',
            key: 'formatStatus',
            width: 100,
          },
          {
            title: '用户名',
            key: 'username',
            width: 100,
          },
          {
            title: '内容',
            key: 'content',
            width: 300,
          },
          {
            title: '图片张数',
            key: 'picNum',
            width: 120,
            sortable: true,
          },
          {
            title: '最后更新',
            key: 'formatUpdatedAt',
            width: 150,
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 150,
            render(row, column, index) {
              return `<i-button type="text" size="small" @click="show(${index})">查看</i-button><i-button type="text" size="small" @click="edit(${index})">编辑</i-button><i-button type="text" size="small" @click="delOne(${index})">删除</i-button>`
            },
          },
        ],
        postsList: [],
      }
    },
    methods: {
      add() {
        this.editing = true
        this.thumbnails = []
        this.editingPost = {
          content: null,
          status: '1',
        }
      },
      changePage(page) {
        const posts = this.queryPosts()
        posts.descending('createdAt').limit(this.pageSize).skip(page * this.pageSize - this.pageSize).find()
          .then((res) => {
            this.postsList = _.map(res, (item) => {
              const obj = item.toJSON()
              console.log(obj)
              obj.username = obj.createdBy.username
              if (obj.status === 1) {
                obj.formatStatus = '正常'
              } else {
                obj.formatStatus = '禁用'
              }
              console.log(obj.formatStatus)
              obj.status = _.toNumber(obj.status)
              obj.picNum = obj.files.length
              obj.content = obj.content ? obj.content : '无'
              obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
              return obj
            })
          })
          .catch((err) => {
            console.log('err', err)
            this.$Message.error('出错啦')
          })
      },
      delOne(index) {
        this.$Modal.confirm({
          title: '确定删除吗？',
          content: '删除以后将不可恢复！',
          onOk: () => {
            console.log(this.postsList[index].objectId)
            const dealId = this.postsList[index].objectId
            const todo = AV.Object.createWithoutData('Posts', dealId)
            todo.destroy().then((success) => {
              console.log(success)
              this.$Message.info('删除成功！')
              this.postsList.splice(index, 1)
              console.log(this.postsList.toJSON())
            }, (error) => {
              console.log(error)
            })
          },
        })
      },
      show(index) {
        this.$Modal.info({
          title: '图文详情',
          content: `
            <div><span class="c-g9">用户名：</span>${this.postsList[index].username}</div>
            <div><span class="c-g9">留言时间：</span>${this.postsList[index].formatUpdatedAt || '空'}</div>
            <div><span class="c-g9">图文状态：</span>${this.postsList[index].formatStatus}</div>
            <div><span class="c-g9">文章内容：</span>${this.postsList[index].content || '空'}</div>
          <div><span class="c-g9">图片张数：</span>${this.postsList[index].picNum || '空'}</div>
          <div><span class="c-g9">图片详情：</span><div v-for="item in ${this.postsList[index].files}"><img src="item"></div></div>
          `,
        })
      },
      edit(index) {
        this.editing = true
        this.editingPost = this.postsList[index]
        console.log('this.editingPost', this.editingPost)
        this.thumbnails = this.postsList[index].files
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.editingPost && this.editingPost.objectId) {
              this.saving = true
              const modelPost = this.modelUpdate('Posts', this.editingPost.objectId)
              modelPost.save({
                files: this.thumbnails,
                status: this.editingPost.status,
                content: this.editingPost.content,
                createdBy: this.currentUserData,
                createdById: this.currentUserData.objectId,
              }).then((res) => {
                const obj = res.toJSON()
                console.log('修改', obj)
                this.$Message.success('操作成功')
                this.editing = false
                this.saving = false
                obj.picNum = this.thumbnails.length
                obj.username = obj.createdBy.username
                obj.formatStatus = this.formatStatus(obj.status)
                obj.formatUpdatedAt = this.dateFormat(new Date(), 'L')
                this.postsList = _.map(this.postsList, (item) => {
                  if (item.objectId === obj.objectId) {
                    item = obj
                  }
                  return item
                })
              }).catch((err) => {
                console.log('err', err)
                this.$Message.error('出错啦')
              })
            } else {
              this.saving = true
              const modelPost = this.modelPosts()
              modelPost.save({
                files: this.thumbnails,
                status: _.toNumber(this.editingPost.status),
                content: this.editingPost.content,
                createdBy: this.currentUserData,
                createdById: this.currentUserData.objectId,
              }).then((res) => {
                const obj = res.toJSON()
                console.log('新增', obj)
                this.editing = false
                this.saving = false
                obj.picNum = this.thumbnails.length
                obj.username = obj.createdBy.username
                obj.formatStatus = this.formatStatus(obj.status)
                obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
                this.postsList = [obj, ...this.postsList]
                this.$Message.success('操作成功')
              }).catch((err) => {
                console.log('err', err)
                this.$Message.error('出错啦')
              })
            }
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      uploadComplete(status, result) {
        if (status === 200) {
          this.thumbnails.push(`http://oo6bhdayj.bkt.clouddn.com/${result.key}`)
          console.log(this.thumbnails)
        } else {
          console.log('出错', status)
        }
      },
    },
    created() {
      const currentUserData = this.currentUser()
      if (currentUserData) {
        this.currentUserData = currentUserData
        const posts = this.queryPosts()
        posts.count().then((res) => {
          this.count = res
          console.log('this.count', this.count)
        })
        posts.descending('createdAt').limit(this.pageSize).find().then((res) => {
          this.postsList = _.map(res, (item) => {
            const obj = item.toJSON()
            console.log(obj)
            obj.username = obj.createdBy.username
            if (obj.status === 1) {
              obj.formatStatus = '正常'
            } else {
              obj.formatStatus = '禁用'
            }
            console.log(obj.formatStatus)
            obj.status = _.toNumber(obj.status)
            obj.picNum = obj.files.length
            obj.content = obj.content ? obj.content : '无'
            obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
            return obj
          })
        })
          .catch((err) => {
            console.log('err', err)
            this.$Message.error('出错啦')
          })
      }
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>

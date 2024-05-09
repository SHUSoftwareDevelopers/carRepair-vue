<script setup>
    const activities = [
      {
        content: 'Event start',
        timestamp: '2018-04-15',
      },
      {
        content: 'Approved',
        timestamp: '2018-04-13',
      },
      {
        content: 'Success',
        timestamp: '2018-04-11',
      },
    ]
</script>

<template>
    <el-timeline style="max-width: 600px">
      <el-timeline-item timestamp="2018/4/12" placement="top">
        <el-card>
          <h4>生成维修委托书</h4>
          <p>Tom committed 2018/4/12 20:46</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2018/4/3" placement="top">
        <el-card>
          <h4>车间维修任务数</h4>
          <p>Tom committed 2018/4/3 20:46</p>
          <br/><br/>
          <el-timeline style="max-width: 600px">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2018/4/2" placement="top">
        <el-card>
          <h4>审核确定维修结束</h4>
          <p>Tom committed 2018/4/2 20:46</p>
        </el-card>
        


      </el-timeline-item>

      <el-timeline-item timestamp="2018/4/2" placement="top">
        <el-card>
          <h4>等待支付维修费用</h4>
          <p>Tom committed 2018/4/2 20:46</p>
        </el-card>
      </el-timeline-item>

      <el-timeline-item timestamp="2018/4/2" placement="top">
        <el-card>
          <h4>维修流程结束√</h4>
          <p>Tom committed 2018/4/2 20:46</p>
        </el-card>
      </el-timeline-item>


    </el-timeline>

</template>

<style lang="scss" scoped>

</style>
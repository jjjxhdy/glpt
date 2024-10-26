<template>
  <div class="datapagediv">
    <div class="miandatapage">
      <el-row>
        <el-col :span="8" style="padding-right: 10px">
          <el-card class="box-card">
            <div class="user">
              <!-- <img src="../assets/logo.png alt=""> -->
              <div class="userinfo">
                <p class="name">数据总览</p>
                <p class="access">当前时间：{{ currentDateTime }}</p>
              </div>
            </div>
            <div class="login-info"></div>
          </el-card>
          <el-card style="margin-top: 20px; height: 550px">
            <p>数据实时统计中心</p>
            <div class="num">
              <el-card
                v-for="item in countData"
                :key="item.name"
                :body-style="{ display: 'flex', padding: 0 }"
              >
                <i
                  class="icon"
                  :class="`el-icon-${item.icon}`"
                  :style="{ background: item.color }"
                ></i>
                <div class="detail">
                  <p class="price">{{ item.value }}个</p>
                  <p class="desc">{{ item.name }}</p>
                </div>
              </el-card>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16" style="padding-left: 10px">
          <el-card style="height: 400px">
            <!-- 折线图 -->
            <div ref="echarts2" style="height: 400px"></div>
          </el-card>
          <div class="graph">
            <!-- 柱状图 -->
            <el-card style="height: 400px">
              <div ref="echarts1" style="height: 400px"></div>
            </el-card>
            <!-- 饼图 -->
            <el-card style="height: 400px">
              <div ref="echarts3" style="height: 400px"></div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
export default {
  data() {
    return {
      selectedOption: '',
      tableData: [],
      echarts1: null,
      echarts2: null,
      echarts3: null,
      chart1data: [],
      chart3data: [],
      chart2data: [],
      dialogVisible: false,
      isButtonDisabled: true, // 初始禁用按钮
      currentDateTime: new Date().toLocaleString(),
      countData: [
        {
          name: '客户总数量',
          value: 0,
          icon: 'user',
          color: '#2ec7c9',
        },
        {
          name: '工单未评价数量',
          value: 0,
          icon: 'star-on',
          color: '#ffb980',
        },
        {
          name: '工程师总数量',
          value: 0,
          icon: 'success',
          color: '#2ec7c9',
        },
        {
          name: '工单未处理总数量',
          value: 0,
          icon: 'setting',
          color: '#5ab1ef',
        },

        {
          name: '管理员总数量',
          value: 0,
          icon: 'star-on',
          color: '#ffb980',
        },
        {
          name: '换件总数量',
          value: 0,
          icon: 's-goods',
          color: '#5ab1ef',
        },
      ],
    };
  },
  created() {
    this.refreshDateTime();
    // 每秒钟刷新一次日期时间
    this.timer = setInterval(() => {
      this.refreshDateTime();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    this.gethomedata();
  },
  methods: {
    refreshDateTime() {
      this.currentDateTime = new Date().toLocaleString();
    },
    async gethomedata() {
      // 每种用户类型数量查询
      this.apijs
        .usernumber()
        .then((res) => {
          // console.log(res);
          if (res.code == 200) {
            this.countData[0].value = res.data[0].count;
            this.countData[2].value = res.data[1].count;
            this.countData[4].value = res.data[2].count;
          }
        })
        .catch((err) => {});
      // 换件数量查询
      this.apijs
        .partsnumber()
        .then((res) => {
          // console.log('换件数量查询', res);
          if (res.code == 200) {
            this.countData[5].value = res.data;
          }
        })
        .catch((err) => {});
      //每种工单状态数量
      this.apijs
        .orderstate()
        .then((res) => {
          // console.log('每种工单状态数量', res);
          if (res.code == 200) {
            let arewr = 0;
            res.data.forEach((item) => {
              arewr = arewr + item.count;
              if (item.state == 0) {
                this.countData[3].value = item.count;
              }
            });
            this.countData[1].value = arewr;
          }
        })
        .catch((err) => {});
      //每种等级工程师数量统计
      await this.apijs
        .usere_number()
        .then((res) => {
          // console.log('每种等级工程师数量', res);
          if (res.code == 200) {
          }
          let numlist = [
            { value: 0, name: '初级', power: 0 },
            { value: 0, name: '中级', power: 1 },
            { value: 0, name: '高级', power: 2 },
          ];
          res.data.forEach((item) => {
            numlist.forEach((e) => {
              if (item.power == e.power) {
                e.value = item.count;
              }
            });
          });
          this.chart3data = numlist;
        })
        .catch((err) => {});
      //每种等级工单数量
      await this.apijs
        .orderlevel()
        .then((res) => {
          // console.log('每种等级工单数量', res);
          if (res.code == 200) {
            let ordernum = [
              {
                name: '0-4h（三级）',
                level: 2,
                value: 0,
              },
              {
                name: '0-8h（二级）',
                level: 1,
                value: 0,
              },
              {
                name: '0-12h（一级）',
                level: 0, 
                value: 0,
              },
            ];
            res.data.forEach((item) => {
              let found = ordernum.find((elem) => elem.level === item.level);
              if (found) {
                found.value = item.count;
              }
            });
            this.chart2data = ordernum;
            // console.log(this.chart2data, 22);
          }
        })
        .catch((err) => {});
      //每种工单类型数量统计
      await this.apijs
        .getallorders()
        .then((res) => {
          // console.log('每种工单类型数量统计', res);
          if (res.code == 200) {
            const typeCount = { 计算机: 0, 打印机: 0, 监控设备: 0 };
            res.data.forEach((item) => {
              if (typeCount[item.type]) {
                typeCount[item.type] += 1;
              } else {
                typeCount[item.type] = 1;
              }
            });
            const typeData = Object.entries(typeCount).map(([type, count]) => ({
              name: type,
              value: count,
            }));
            this.chart1data = typeData;
            console.log(this.chart1data, 'this.chart1data');
          }
        })
        .catch((err) => {});
      this.initChart();
    },
    initChart() {
      this.echarts1 = echarts.init(this.$refs.echarts1);
      const eachrts1Option = {
        title: {
          text: '故障分布',
        },
        tooltip: {
          trigger: 'item',
        },
        xAxis: {
          type: 'category',
          data: this.chart1data.map((item) => item.name),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: this.chart1data, 
            type: 'bar',
            barWidth: '40%',
            color: ['#36b4ec' ]
          },
        ],
      };
      this.echarts1.setOption(eachrts1Option);
      this.echarts2 = echarts.init(this.$refs.echarts2);
      const eachrts2Option = {
        title: {
          text: '工单等级分布',
        },
        xAxis: {
          type: 'category',
          data: this.chart2data.map((item) => item.name),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: this.chart2data.map((item) => item.value),
            type: 'line',
            color: '#38d3cf'
          },
        ],
      };
      this.echarts2.setOption(eachrts2Option);
      this.echarts3 = echarts.init(this.$refs.echarts3);
      const eachrts3Option = {
        title: {
          text: '工程师等级分布',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            data: this.chart3data,
            type: 'pie',
            color: ['#2ec7c9', '#5ab1ef', '#ffb980']
          },
        ],
      };
      this.echarts3.setOption(eachrts3Option);
    },
  },
};
</script>
<style lang="less" scoped>
.datapagediv {
  width: 100%;
  // height: 100%;
}

.miandatapage {
  // padding: 20px;
  padding-top: 40px;
}

.user {
  // padding-bottom: 20px;
  // margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .buttcc {
    width: 20%;
  }

  img {
    margin-right: 40px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }

  .userinfo {
    .name {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .access {
      color: #999999;
      margin-top: 20px;
    }
  }
}

.login-info {
  p {
    line-height: 28px;
    font-size: 14px;
    color: #999999;

    span {
      color: #666666;
      margin-left: 60px;
    }
  }
}

.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 40px 0 20px 0;

  .icon {
    width: 80px;
    height: 80px;
    font-size: 30px;
    text-align: center;
    line-height: 80px;
    color: #fff;
  }

  .detail {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .price {
      font-size: 30px;
      margin: 10px 0;
      line-height: 30px;
      height: 40px;
    }

    .desc {
      font-size: 14px;
      color: #999;
      text-align: center;
    }
  }

  .el-card {
    width: 48%;
    margin-bottom: 50px;
  }
}

.graph {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

  .el-card {
    width: 48%;
  }
}
</style>

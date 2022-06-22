<template>
  <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="visible" width="400px" append-to-body>
    <div>
      <el-form label-width="120px" :model="filterForm" ref="filterForm" :inline="true" class="mode-form-line1">
        请选择延期结束时间：
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0">
          <el-date-picker type="date" v-model="filterForm.startTime" :clearable="false" default-time="00:00:00" :disabled="true"></el-date-picker>
          至
          <el-date-picker type="date" :picker-options="{
          disabledDate: disableEndTime
        }" style="margin-left:15px" v-model="filterForm.delayDateTime" :clearable="false" default-time="00:00:00" :disabled="false"></el-date-picker>
        </div>
        <div style="height:30px;width:100%;margin-top:20px;color:red">{{checkDateMsg}}</div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { statCardDelay } from "@/service/mycustomer";
import gtTimeRange from "@/components/gt-time-range";
import moment from "moment";
export default {
  data() {
    return {
      id: "",
      visible: false,
      filterForm: {
        userId: "",
        delayDate: "",
        startTime: "",
        oldDelayDate: "",
        delayDateTime: ""
      }
    };
  },
  computed: {
    checkDate: function() {
      if (
        this.filterForm.delayDateTime <
        new Date().getTime() - 24 * 60 * 60 * 1000
      ) {
        //小于当前日期
        return 1;
      } else if (this.filterForm.delayDateTime < this.filterForm.oldDelayDate) {
        //小于之前有效期
        return 2;
      } else {
        return 3;
      }
    },
    checkDateMsg: function() {
      switch (this.checkDate) {
        case 1:
          return "提示：延期的结束时间小于当前日期请重新选择日期！";
          break;
        case 2:
          return "提示：延期的结束时间小于礼品卡当前有效期，确定修改吗？";
          break;
        default:
          break;
      }
    }
  },
  components: {
    gtTimeRange
  },
  methods: {
    init(id, obj) {
      this.filterForm.id = id;
      this.filterForm.oldDelayDate = new Date(obj.endTime).getTime();
      this.filterForm.delayDateTime = new Date(obj.endTime).getTime();
      this.filterForm.startTime = new Date(obj.startTime).getTime();
      this.filterForm.userId = obj.customerId;
      this.visible = true;
    },

    async save() {
      if (this.checkDate == 1) {
        return false;
      }
      console.log(this.filterForm);
      this.filterForm.delayDate =
        new Date(this.filterForm.delayDateTime).getTime() +
        (24 * 60 * 60 * 1000 - 1000);
      const { data } = await statCardDelay(this.filterForm);
      if (data.code == 0) {
        this.$emit('refreshDataList')
        this.visible = false
      }
    },
    cancel() {
      this.visible = false;
    },
    disableEndTime(currentTime) {
      if (new Date().getTime() - 24 * 60 * 60 * 1000 >= currentTime.getTime()) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

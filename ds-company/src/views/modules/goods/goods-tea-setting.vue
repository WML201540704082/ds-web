<template>
  <section class="page-tea-add-or-edit">
    <el-card>
      <gt-subtitle title="基本信息" style="display: block;" />
      <el-form
        ref="tea-form"
        :rules="dataFormRules"
        label-width="150px"
        :model="tea"
        :validate-on-rule-change="false"
      >
        <el-form-item class="tea-header" label="商品图片" prop="pic">
          <gt-image-upload
            :comp="12"
            :realistStr="'staffHeader'"
            :names="0"
            :max="1"
            tip="建议尺寸600px*600px"
            :reallist="tea.pic"
            :cb="value => tea.pic = value"
          />
        </el-form-item>
        <el-form-item label="商品名称" prop="name" class="gt-input-tip large">
          <el-input v-model="tea.name" :maxlength="20" placeholder="最多支持20个汉字">
            <span slot="prefix">*名称限制20个汉字以内</span>
          </el-input>
        </el-form-item>
        <el-form-item label="选择分类" prop="category">
          <el-select v-model="category" value-key="id" placeholder="请选择商品分类" clearable>
            <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
          <span class="spanLeft">
            <el-button type="primary" @click="goMaterialTemplate">前往新建分类</el-button>
          </span>
        </el-form-item>
        <el-form-item label="第三方编码" prop="code">
          <el-input v-model="tea.code" placeholder="最多30个数字或字母"/>
        </el-form-item>
        <el-form-item label="终端排序" prop="sequence">
          <el-input v-model="tea.sequence" placeholder="输入值为整数,最大值为9999"  :maxlength="4" />
        </el-form-item>
        <el-form-item label="商品标记" prop="mark">
          <el-radio-group v-model="tea.mark">
            <el-radio label="EMPTY">无</el-radio>
            <el-radio label="HOT">hot</el-radio>
            <el-radio label="NEW">new</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品简介" prop="description" class="gt-input-tips">
          <el-input
            type="text"
            size="small"
            v-model="tea.description"
            maxlength="14"
            placeholder="最多支持14个汉字"
            show-word-limit
          />
        </el-form-item>
        <!-- 基本信息 -->
        <gt-subtitle title="基本信息" style="display: block;" />
        <el-form-item label="单一售价">
          <el-switch
            v-model="status"
            active-text
            active-value="ENABLE"
            inactive-value="LEAVE"
            @change="changeActive"
          ></el-switch>
        </el-form-item>
        <el-form-item label="销售价" prop="salePrice" v-if="status == 'ENABLE'">
          <el-input v-model="tea.salePrice" :maxlength="6"></el-input>
        </el-form-item>
        <el-form-item v-else>
          <el-table :data="specs " style="width: 100%">
            <el-table-column label="规格" width="180">
              <template slot-scope="scope">
                <el-input  v-model="scope.row.name" size="mini" ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="价格/元" width="180">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.salePrice" :min="0"  :max="9999.99" :controls="false" :precision="2" size="mini"  placeholder="请输入数字"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="addColum">添加一列</el-button>
        </el-form-item>
        <el-form-item label="销售单位" prop="unit">
          <el-radio-group v-model="tea.unit">
            <el-radio label="CUP">杯</el-radio>
            <el-radio label="PORTION">份</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 售卖信息 -->
        <gt-subtitle title="售卖信息" style="display: block;" />
        <el-form-item label="商品口味">
          <el-switch v-model="tast" active-text active-value="ENABLE" inactive-value="LEAVE"></el-switch>
        </el-form-item>
        <el-form-item label v-if="tast== 'ENABLE'">
          <div v-for="(d,index) in tastes" :key="index" :index="index">
            <goods-tea-feeds
              ref="childRules"
              :taste="d"
              @deleteindex="delet(index)"
              @changename="(value) => changeContent(value, index)"
              @changeList="(data)=>changeList(data,index)"
            ></goods-tea-feeds>
          </div>
          <el-button type="primary" @click="addTastes">添加口味分类</el-button>
        </el-form-item>

        <el-form-item label="选择加料" prop="feedTable">
          <el-select
            v-model="tea.feedTableId"
            placeholder="请选择加料"
            clearable
            @change="changeTableId(tea.feedTableId)"
          >
            <!-- <el-option label="全部" value></el-option> -->
            <el-option v-for="item in feedList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <span class="spanLeft">已选择加料模板配料:</span>
          <span v-for="item in feedDetail" :key="item.id">{{item.name}}.</span>
          <span class="spanLeft">
            <el-button type="primary" @click="goMaterial">前往新建加料</el-button>
          </span>
        </el-form-item>
        <el-form-item label="商品标签">
          <el-switch v-model="info" active-text active-value="ENABLE" inactive-value="LEAVE"></el-switch>
          <div v-if="info == 'ENABLE'">
            <el-input
              v-model="txt"
              :maxlength="5"
              placeholder="输入商标标签,最多5个汉字"
              @keyup.native.enter="addTag()"
            ></el-input>
            <el-button type="primary" @click="addTag()">添加</el-button>
          </div>
          <el-form-item v-if="info == 'ENABLE'">
            <span class="tea-tag" v-for="(item,index) in infoList" :key="item.id">
              {{item}}
              <span class="taa-icon" @click="removeTag(index)">×</span>
            </span>
          </el-form-item>
        </el-form-item>

        <!-- 菜品详情 -->
        <!-- <gt-subtitle title="菜品详情" style="display: block;" /> -->
        <!-- <el-form-item label="商品信息">
          <el-switch v-model="detail" active-text active-value="ENABLE" inactive-value="LEAVE"></el-switch>
          <el-card style="margin-top: 10px" class="com-goods-edit" v-if="detail=='ENABLE'">
            <div v-for="(item,index) in infos" :key="index" :index="index">
              <goods-tea-infos
                :infos="item"
                :tag="index"
                @deleteDetail="deleteDetail(index)"
                @changePic="(value) => changepic(value,index)"
                @changeDetail="(data)=>changeDetail(data,index)"
              ></goods-tea-infos>
            </div>
            <el-form-item>
              <div style="color:#c0c0c0">最多上传20组,描述文字最多150字</div>
              <el-button type="primary" @click="addGroup">添加图文</el-button>
            </el-form-item>
          </el-card>
        </el-form-item> -->
      </el-form>
    </el-card>

    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" :loading="loading" @click.native="add" txt="确定" />
    </div>
  </section>
</template>
<script>
import gtSubtitle from "@/components/gt-sub-title";
import gtImageUpload from "@/components/gt-image-upload";
// import { remarkType } from "@/utils/dict";
import { mapState } from "vuex";
import gtArticleForm from "@/components/gt-article-form";
import goodsTeaFeeds from "./components/goods-tea-feeds";
import goodsTeaInfos from "./components/goods-tea-infos";
import { editTea, createTea } from "@/service/goods";
import * as api from "@/service/goods";

export default {
  name: "goods-tea-setting",
  components: {
    gtSubtitle,
    gtImageUpload,
    gtArticleForm,
    goodsTeaFeeds,
    goodsTeaInfos,
  },
  data() {
    const isSelect = (rule, value, callback) => {
      console.log(value);
      if (value == 0) {
        return callback(new Error("请正确选择分类"));
      } else {
        callback();
      }
    };

    return {
      category: null, //分类
      tastes: [], //口味
      infos: [], //详情
      //规格
      specs: [],
      storeList: [], //分类表
      feedList: [], //加料表
      feedDetail: [], //配料
      tea: {
        pic: null,
        name: "", //商品名称
        code: "", //编码
        sequence: "", //排序
        mark: "", //标记
        description: "",
        className: "", //选择分类名称
        classId: null,
        salePrice: "", //销售单价salePrice
        unit: "CUP", //单位
        feedTable: { feeds: [] }, //加料
        feedTableId: null,
      },
      status: "ENABLE", //状态开关
      tast: "ENABLE",
      info: "ENABLE",
      detail: "ENABLE",
      txt: "",
      infoList: [], //标签列表
      newInfoList: [],

      dataFormRules: {
        pic: [{ required: true, message: "请选择图片" }],
        name: [{ required: true, message: "请填写商品名称" }],
        category: [{ required: true, validator: isSelect, trigger: "change" }],
        code: [
          {
            pattern: /^[0-9a-zA-Z]{1,30}$/,
            message: "最长30个数字或字母",
            trigger: "blur",
          },
        ],
        salePrice: [
          {
            required: true,
            message: "请保留小数点后两位",
            pattern: /^\d+(\.\d{0,2})?$/,
            trigger: "blur",
          },
        ],
        unit: [{ required: true, message: "请选择销售单位" }],
        sequence: [
          {
            pattern: /^[1-9]+[0-9]*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        // specSaleprice:[
        //   {type:"price",required: true, message: "请保留小数点后两位",pattern: /^\d+(\.\d{0,2})?$/,trigger: "blur",}
        // ]
      },
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.loading.global,
    }),
  },
  async created() {
    this.getTeaCategory();
    this.getTeaFeeds();

    const { id } = this.$route.query;
    const { data } = await api.detailTea(id);
    if (id && data.code === 0) {
      this.tea = data.data;
      this.category = data.data.className;
      if (data.data.feedTable) {
        this.feedDetail = data.data.feedTable.feeds;
      }
      if(data.data.sequence == 0){
        this.tea.sequence = ""
      }
      //标签
      if (data.data.tags != "") {
        this.infoList = data.data.tags;
        this.infoList = this.infoList.split(",");
        // this.info = "ENABLE";
      }

      //售价
      if (this.tea.salePrice == 0 || this.tea.salePrice == null) {
        this.status = "LEAVE";
        this.specs = data.data.specs.map(item=>{item.salePrice=item.salePrice/100;return item;});
        this.tea.salePrice = 0
      } else {
        this.status = "ENABLE";
        this.tea.salePrice = this.priceNum(data.data.salePrice);
      }

      //口味值
      if (data.data.tastes.length > 0) {
        this.tast = "ENABLE";
        this.tastes = data.data.tastes;
      }

      // 详情
      this.detail = "ENABLE";
      this.infos = data.data.infos;
    }
  },
  methods: {
    // 获取商品分类
    async getTeaCategory() {
      const { data } = await api.getTeaCategory();
      if (data && data.data) {
        this.storeList = data.data;
      }
    },

    // 获取配料模板
    async getTeaFeeds() {
      const { data } = await api.getTeaFeeds();
      if (data && data.data) {
        this.feedList = data.data;
        console.log(this.feedList);
      }
    },

    async changeTableId(id) {
      const { data } = await api.getTeaFeedsdetail(id);
      if (data && data.data) {
        this.feedDetail = data.data.feeds;
        console.log(this.feedDetail);
      }
      if (!id) {
        this.feedDetail = [];
      }
    },

    //茶饮分类
    goMaterialTemplate() {
      this.$router.push({
        name: "goods-goods-tea-category",
      });
    },

    //加料管理
    goMaterial() {
      this.$router.push({
        name: "goods-materialTemplateManagement-material-template",
      });
    },

    addColum() {
      this.specs.push({ name: null, salePrice: null });
    },

    changeActive() {
      this.tea.salePrice = "";
    },
    //添加
    async add() {
      const { id } = this.$route.query;
      this.$refs["tea-form"].validate(async (valid) => {
        if (this.category == null) {
          this.$message.error("请选择分类");
          return false;
        }
        if (
          this.tastes.map((item) => item.name).indexOf("") != -1 ||
          this.tastes.map((item) => item.name).indexOf(null) != -1
        ) {
          this.$message.error("请填写口味名称");
          return false;
        }
        if(this.tastes.map(item=>item.valueNames).indexOf("") !=-1 ||
          this.tastes.map((item)=>item.valueNames).indexOf(null) != -1){
          this.$message.error("请填写口味值");
          return false
        }
        var arr = this.tastes.map(item=>item.values).map(item=>item.length==0)
        if(arr.indexOf(true) !=-1){
          this.$message.error("请填写口味值");
          return false
        }
        if(this.status == "LEAVE"){
          if(this.specs.length==0||this.specs.map(item=>item.name).indexOf(null)!=-1||
          this.specs.map(item=>item.name).indexOf("")!=-1){
            this.$message.error("请填写规格");
            return false
          }
        }
        if (valid) {
          console.log("校验成功");
          this.newInfoList = JSON.parse(JSON.stringify(this.infoList));
          this.newInfoList = this.newInfoList.toString();
          // this.tea.salePrice = this.tea.salePrice * 100;
          this.specs = this.specs.map(item=>{item.salePrice=item.salePrice*100;
          return item;})
          const query = {
            id: id,
            pic: this.tea.pic, //图片
            name: this.tea.name, //名称
            code: this.tea.code, //编码
            description: this.tea.description, //描述
            className: this.category.name ? this.category.name : this.category, //分类名称
            classId: this.category.id ? this.category.id : this.tea.classId, //分类id
            sequence: this.tea.sequence, //排序
            mark: this.tea.mark, //标记
            salePrice:this.tea.salePrice != 0 ? ((this.tea.salePrice)/0.01).toString() : null, //销售价
            unit: this.tea.unit, //单位
            specs: this.tea.salePrice == 0 ? this.specs : null, //规格
            tastes: this.tast == "ENABLE" ? this.tastes : [], //口味值
            feedTable: this.tea.feedTable, //配料模板
            feedTableId: this.tea.feedTableId,
            tags: this.info == "ENABLE" ? this.newInfoList : "", //标签string
            infos: this.infos,
          };
          const { data } = id ? await editTea(query) : await createTea(query);
          if (data.code === 0) {
            this.$router.push({ name: "goods-goods-tea" });
          } else {
            this.$message.warning(data.msg);
          }
        }
      });
    },

    //商品标签添加
    addTag: function () {
      if (this.in_array(this.txt, this.infoList)) {
        this.$message.error("标签已经存在！不可重复");
      } else {
        if (this.infoList.length < 3 && this.txt.trim() != "") {
          this.infoList.push(this.txt);
          this.txt = "";
        } else if (this.txt.trim() == "") {
          this.$message.error("输入标签不可为空");
        } else {
          this.$message.error("一个商品最多支持3个标签");
        }
      }
    },
    removeTag: function (index) {
      this.infoList.splice(index, 1);
    },
    in_array: function (search, array) {
      for (var i in array) {
        if (array[i].tag == search) {
          return true;
        }
      }
      return false;
    },

    //删除口味标签
    delet(val) {
      this.tastes.splice(val, 1);
    },

    deleteDetail(val) {
      this.infos.splice(val, 1);
    },

    //添加口味分类
    addTastes() {
      // this.tastes.push({});
      this.tastes.push({ name: null, valueNames: null });
      console.log(this.tastes);
    },

    //口味名称
    changeContent(value, index) {
      this.tastes[index].name = value;
      console.log(value, index);
    },

    //口味值
    changeList(data, index) {
      this.tastes[index].valueNames = data.map((item) => item.name).join(",");
    },

    //描述图片
    changepic(value, index) {
      this.infos[index].pic = value;
    },

    //描述文本
    changeDetail(data, index) {
      this.infos[index].description = data;
    },

    // 添加一组
    addGroup() {
      if (this.infos.length < 20) {
        this.infos.push({ description: null, pic: null });
      } else {
        this.$message.error("最多添加20组");
      }
    },
  },
};
</script>
<style lang="scss">
.tea-tag {
  width: 100px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border: 1px solid #dcdfe6;
  margin: 0 10px;
  padding: 3px 12px;
}
.taa-icon {
  position: relative;
  top: -3px;
  right: -3px;
  cursor: pointer;
}
.gt-input-tips {
  width: 500px;
}
.gt-input-tip.large {
  .el-input__inner {
    width: 300px;
  }
  .el-input__prefix {
    left: 310px;
  }
}
.spanLeft {
  margin-left: 20px;
}
.spanRight {
  margin-right: 20px;
}
</style>
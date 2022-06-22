<template>
  <section>
    <el-button v-show="!ifExporting" @click="exportExcel()" style="margin-bottom: 10px;">{{btnText}}</el-button>
    <el-button v-show="ifExporting" loading style="margin-bottom: 10px;">导出中...</el-button>
  </section>
</template>
<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    name: 'gt-export-button',
    props:{
      tag:{
        type:String,
        default:""
      },
      tagtitle:{
        type: String,
        default: ""
      },
      btnText:{
        type:String,
        default:"导出"
      },
      params:{
        type:Object,
        default:null
      }
    },
    data(){
      return{
        ifExporting:false
      }
    },
    methods:{
      exportExcel () {
        let wb = XLSX.utils.table_to_book(document.querySelector('#'+this.tag));
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.tagtitle+'.xlsx');
        } catch (e)
        {
          if (typeof console !== 'undefined')
            console.log(e, wbout)
        }
        return wbout
      },
    },
  }
</script>

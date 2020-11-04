const demo = `
export default {
  name: "InsuranceEdit",
  components: {
    DateRange,
    FileUploadCard,
    DictSelect,
    CodeGenerator,
    PersonSelector,
    DelRedButton,
    InsuranceSelector,
    TableCellForColorName,
  },
  data() {
    return {
      loading: false,
      personSelectorVisible: false,
      insuranceSelectorVisible: false,
      vehicleInsuranceEntity: {
        businessInsuranceFee: "", // 保费
        billCode: "",
        insuranceType: this.$route.query.renew === "1" ? "1" : "",
        compulsoryInsuranceAmount: "",
      },
      vehicleInsuranceDetailEntities: [],
      rules: {
        insuranceType: [{ required: true, message: "请选择保险类型", trigger: "change" }],
        registDate: [{ required: true, message: "请选择登记日期", trigger: "blur" }],
        policyHolder: [{ required: true, message: "请填写投保人姓名", trigger: "blur" }],
        policyHoldered: [{ required: true, message: "请填写被投保人姓名", trigger: "blur" }],
        compulsoryInsuranceId: [{ required: true, message: "请选择保险公司", trigger: "change" }],
        compulsoryInsuranceStartDate: [{ required: true, message: "请选择投保期间", trigger: "change" }],
        compulsoryInsuranceBillCode: [
          { required: true, message: "请填写保险单号", trigger: "blur" },
          {
            pattern: /^[A-Z0-9]+$/,
            message: "请输入输入数字或大写字母",
            trigger: "blur",
          },
        ],
        compulsoryInsuranceAmount: [
          {
            validator: rules.FormValidate.Form().isPriceLimit,
            trigger: "blur",
          },
        ],
        compulsoryInsuranceFee: [
          { required: true, message: "请输入保费", trigger: "blur" },
          {
            validator: rules.FormValidate.Form().isPriceLimit,
            trigger: "blur",
          },
          // {
          //   pattern: /^0\\.([1-9]|\\d[1-9])$|^[1-9]\\d{0,7}\\.\\d{0,2}$|^[1-9]\\d{0,7}$/,
          //   message: "保费在0.01~99999999.99之间",
          //   trigger: "blur",
          // },
        ],
        vehicleTaxAmount: [
          { required: true, message: "请输入金额", trigger: "blur" },
          {
            validator: rules.FormValidate.Form().isPriceLimit,
            trigger: "blur",
          },
        ],
        businessInsuranceId: [{ required: true, message: "请选择保险公司名称", trigger: "change" }],
        businessInsuranceStartDate: [{ required: true, message: "请选择投保期间", trigger: "change" }],
        businessInsuranceBillCode: [
          { required: true, message: "请填写保险单号", trigger: "blur" },
          {
            pattern: /^[A-Z0-9]+$/,
            message: "请输入输入数字或大写字母",
            trigger: "blur",
          },
        ],
        queryKeyword: [
          // {
          //   required: true,
          //   message: "请填写vin",
          //   validator: rules.FormValidate.Form().isVin,
          //   trigger: "blur",
          // },
          { required: true, message: "请输入vin或车牌号", trigger: "change" },
          // { min: 1, max: 17, message: "长度在 1 到 17 个字符", trigger: "change" },
        ],
        policyHolderedCardNo: [
          {
            validator: rules.FormValidate.Form().validateID,
            trigger: "blur",
          },
        ],
      },
      activeNames: [],
      form: {
        queryType: "0",
        queryKeyword: "",
      },
      sums: [],
    };
  },
  watch: {
    //使用这个可以监听data中指定数据的变化,然后触发watch中对应的function的处理
    vehicleInsuranceDetailEntities: function (newVal, oldVal) {
      if (newVal.length === 0) {
        this.vehicleInsuranceEntity.businessInsuranceFee = "";
      }
    },
    activeNames(val) {
      console.log("点击", this.activeNames);
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async doQuery() {
      if (this.form.queryKeyword === "") {
        this.$message("请输入vin或车牌号");
        return;
      }
      const params = {};
      if (this.form.queryType === "1") {
        params.vin = this.form.queryKeyword;
      } else {
        params.carNo = this.form.queryKeyword;
      }
      const res = await findCarInfoByVinOrCarNo(params);

      if (res.data.code === 200 && res.data.data.vin !== null) {
        delete res.data.data.billCode;
        this.vehicleInsuranceEntity = { ...this.vehicleInsuranceEntity, ...res.data.data };
        if (this.$route.query.renew === "1") {
          this.vehicleInsuranceEntity.insuranceType = "1";
        }
      } else {
        this.$message("查无此车");
        // this.form = {};
        this.vehicleInsuranceEntity.carNo = "";
        this.vehicleInsuranceEntity.carBrand = "";
        this.vehicleInsuranceEntity.carType = "";
        this.vehicleInsuranceEntity.carColor = "";
        this.vehicleInsuranceEntity.vin = "";
        this.vehicleInsuranceEntity.engineNo = "";
        this.vehicleInsuranceEntity.useNature = "";
        this.vehicleInsuranceEntity.vihcileTypeVal = "";
        this.vehicleInsuranceEntity.customerName = "";
        this.vehicleInsuranceEntity.customerCardNo = "";
      }
      this.vehicleInsuranceEntity.insuranceType = this.$route.query.renew === "1" ? "1" : "";
    },
    async getInfo() {
      if (this.$route.query.id) {
        const res = await findVehicleInsuranceById(this.$route.query.id);
        if (res.data.code === 200) {
          // 处理选中标记
          if (res.data.data.vehicleInsuranceEntity.businessInsuranceFlag === 1) {
            // 商业险标记
            this.activeNames.push("3");
          }
          if (res.data.data.vehicleInsuranceEntity.compulsoryInsuranceFlag === 1) {
            // 交强险标记
            this.activeNames.push("1");
          }
          if (res.data.data.vehicleInsuranceEntity.vehicleTaxFlag === 1) {
            // 车船税标记
            this.activeNames.push("2");
          }
          // 处理图片
          res.data.data.vehicleInsuranceEntity.picsArray = new SafeArray(res.data.data.vehicleInsuranceEntity.pics);

          this.vehicleInsuranceDetailEntities = res.data.data.vehicleInsuranceDetailEntities;

          if (this.$route.query.renew === "1") {
            res.data.data.vehicleInsuranceEntity.compulsoryInsuranceStartDate = "";
            res.data.data.vehicleInsuranceEntity.compulsoryInsuranceEndDate = "";
            res.data.data.vehicleInsuranceEntity.compulsoryInsuranceBillCode = "";
            res.data.data.vehicleInsuranceEntity.compulsoryInsuranceAmount = undefined;
            res.data.data.vehicleInsuranceEntity.compulsoryInsuranceFee = undefined;
            res.data.data.vehicleInsuranceEntity.vehicleTaxAmount = undefined;
            res.data.data.vehicleInsuranceEntity.businessInsuranceStartDate = "";
            res.data.data.vehicleInsuranceEntity.businessInsuranceEndDate = "";
            res.data.data.vehicleInsuranceEntity.businessInsuranceBillCode = "";
            res.data.data.vehicleInsuranceEntity.businessInsuranceFee = "";
            res.data.data.vehicleInsuranceEntity.insuranceType = "1";
            this.vehicleInsuranceDetailEntities = [];
          }

          if (this.$route.query.renew === "1") {
          }

          this.vehicleInsuranceEntity = res.data.data.vehicleInsuranceEntity;
        } else {
          this.$message.error(res.data.msg);
        }
      }
    },

    handleAdd() {
      if (this.vehicleInsuranceEntity.businessInsuranceId) {
        this.insuranceSelectorVisible = true;
      } else {
        this.$message.warning("请先选择保险公司名称!");
        this.insuranceSelectorVisible = false;
      }
    },
    handleInsuranceType(ev) {
      /*
        id: "579913046215106560"
        insuranceCode: ""
        insuranceName: "1"
        premiumPrice: 12
       */

      ev.forEach(obj => {
        this.vehicleInsuranceDetailEntities.push({
          insuranceName: obj.insuranceName,
          saleAmount: obj.premiumPrice,
          amount: obj.coveragePrice,
        });
      });
    },
    del(index) {
      this.vehicleInsuranceDetailEntities.splice(index, 1);
    },
    async submit(status) {
      console.log("保存");
      this.$refs.mainForm.validate(async valid => {
        if (valid) {
          // 转换选中状态
          if (this.activeNames.indexOf("1") > -1) {
            this.vehicleInsuranceEntity.compulsoryInsuranceFlag = 1;
          } else {
            this.vehicleInsuranceEntity.compulsoryInsuranceFlag = 0;
            this.vehicleInsuranceEntity.compulsoryInsuranceId = "";
            this.vehicleInsuranceEntity.compulsoryInsuranceBillCode = "";
            this.vehicleInsuranceEntity.compulsoryInsuranceAmount = "";
            this.vehicleInsuranceEntity.compulsoryInsuranceEndDate = "";
            this.vehicleInsuranceEntity.compulsoryInsuranceFee = "";
            this.vehicleInsuranceEntity.compulsoryInsuranceName = "";
            this.vehicleInsuranceEntity.compulsoryInsuranceStartDate = "";
          }
          if (this.activeNames.indexOf("2") > -1) {
            this.vehicleInsuranceEntity.vehicleTaxFlag = 1;
          } else {
            this.vehicleInsuranceEntity.vehicleTaxFlag = 0;
          }
          if (this.activeNames.indexOf("3") > -1) {
            this.vehicleInsuranceEntity.businessInsuranceFlag = 1;
            if (this.vehicleInsuranceDetailEntities.length === 0) {
              this.$message.warning("请至少选择一项险种");
              return;
            }
          } else {
            this.vehicleInsuranceEntity.businessInsuranceFlag = 0;
            this.vehicleInsuranceEntity.businessInsuranceId = "";
          }
          // 处理图片
          this.vehicleInsuranceEntity.pics = this.vehicleInsuranceEntity?.picsArray?.join(",");
          // 处理续保
          if (this.$route.query.renew === "1") {
            this.vehicleInsuranceEntity.id = null;
          }
          this.loading = true;
          const res = await saveOrUpdateVehicleInsurance({
            vehicleInsuranceDetailEntities: this.vehicleInsuranceDetailEntities,
            vehicleInsuranceEntity: this.vehicleInsuranceEntity,
          });
          if (res.data.code === 200) {
            this.$message.success("操作成功");
            this.handleGoBack();
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        }
      });
    },
    beforeUpload(ev) {
      return beforeUploadCommon(ev, this);
    },
    // 返回按钮
    handleGoBack(n = 1) {
      if (!Number.isInteger(n)) {
        n = 1;
      }
      this.$store.commit("TopTab/popPathFromActiveTab", { n });
      this.$destroy();
    },

    openPersonSelector() {
      this.personSelectorVisible = true;
    },
    handlePersonSelect(ev) {
      if (ev && ev.length) {
        this.vehicleInsuranceEntity.operatorName = ev[0].staffName;
        this.vehicleInsuranceEntity.operatorId = ev[0].staffId;
      }
    },

    // 异步获取车主数据
    querySearchAsync(queryString, cb) {
      if (queryString) {
        queryVehicleManageViewDim(queryString).then(({ data }) => {
          cb(data.data.filter(item => !!item)); // 可能存在 null 需要过滤
        });
      } else {
        cb([]);
      }
    },

    handleKeyWordSelect(ev) {
      // 0 车牌号 , 1 vin
      if (this.form.queryType === "0") {
        this.form.queryKeyword = ev.carNo;
      } else if (this.form.queryType === "1") {
        this.form.queryKeyword = ev.vin;
      }
    },

    saleAmountInput(row, ev) {
      const arr = [];
      for (let i = 0; i < this.vehicleInsuranceDetailEntities.length; i++) {
        arr.push(this.vehicleInsuranceDetailEntities[i].saleAmount);
      }

      this.vehicleInsuranceEntity.businessInsuranceFee = arr.reduce((prev, curr) => {
        return prev + curr;
      });
    },
  },
};
`;

export default demo;

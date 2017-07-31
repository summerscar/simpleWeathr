var vm=new Vue({
    el: '#app',
    data: {
        canvas: '',
        context: '',
        canvasA: '',
        contextA: '',
        canvasB: '',
        contextB: '',
        w:'',
        ratio:'',
        key:'8e48d6e8554344098bba28329a8735e5',
        city:'南京',
        cityId:'CN101190101',
        weather_now:{},
        weather_basic:{},
        weather_daily_forecast:[],
        weather_suggestion:{},
        weather_hourly_forecast:[],
        /*   weather_aqi:{"city": {
         "aqi": "0",
         "co": "无数据",
         "no2": "无数据",
         "o3": "无数据",
         "pm10": "无数据",
         "pm25": "无数据",
         "qlty": "无数据",
         "so2": "无数据"
         }},*/
        weather_aqi:{},
        interval:4.5,
        canvasRight_h:'',
        deg:0,
        fullscreenLoading: false,
        dialogTableVisible: false,
        dialogFormVisible: false,
        input: '',
        radio: 'CN101190101',
        formData: [],
        getCityList:[],
        scroll:'',
        scrollHeight:'',
        addShow:false


        /*    maxAvg:null,
         minAvg:null,
         intervalMax1:null,
         intervalMax2:null,
         intervalMax3:null*/
    },
    methods: {
        /* show: function () {
         console.log('api');
         console.log(this.weather_aqi);
         console.log('now');
         console.log(this.weather_now);
         console.log('basic');
         console.log(this.weather_basic);
         console.log('daily_forecast');
         console.log(this.weather_daily_forecast);
         console.log('weather_suggestion');
         console.log(this.weather_suggestion);
         console.log('hourly_forecast');
         console.log(this.weather_hourly_forecast);
         console.log(this.canvasRight_h);
         console.log(this.sunPercent);
         console.log();
         this.fullscreenLoading = true;
         setTimeout(() => {
         this.fullscreenLoading = false;
         }, 3000);

         },*/
        menu:function () {
            this.scroll = document.body.scrollTop;
            if(parseFloat(this.scroll/this.scrollHeight)*100>10){
                this.addShow=true;

            }
            else {
                this.addShow=false;
            }
        },
        getCity: _.debounce(function () {
                axios.get('./cityList.json')
                    .then(function(response){
                        this.getCityList=[];
                        if(this.input==''){return}
                        for(var item in response.data) {
                            if(response.data[item].cityZh.indexOf(this.input)==0||response.data[item].cityEn.indexOf(this.input.toLowerCase())==0){

                                this.getCityList.push({"city":response.data[item].cityZh,"cityId":response.data[item].id,"provinceZh":response.data[item].provinceZh});
                                //console.log(this.cityList[item].cityZh);
                            }
                        }
                        this.getCityList.splice(3,this.getCityList.length-3);

                    }.bind(this))
                    .catch(function(err){
                        console.log(err);
                        this.open1();
                    }.bind(this));

            },
            300
        ),
        addListCity:function (index) {
            if(this.formData.length>=3){
                this.getCityList=[];
                this.open3();
                this.input='';
                return
            }
            else {
                for(var m in this.formData){
                    if(this.formData[m].formCity==this.getCityList[index].city){
                        this.getCityList=[];
                        this.open4();
                        this.input='';

                        return
                    }
                }
                axios.get('https://api.heweather.com/v5/search', {
                    params: {
                        key: this.key,
                        city: this.getCityList[index].cityId
                    }
                })
                    .then(function (response) {
                        if(response.data.HeWeather5[0].status!='ok'){
                            this.getCityList=[];
                            this.open();
                            this.input='';

                        }
                        else {
                            this.formData.push({'formCity':response.data.HeWeather5[0].basic.city,'active':response.data.HeWeather5[0].basic.id});
                            this.getCityList=[];
                            this.input='';

                        }
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                        this.open1();
                    }.bind(this));

            }
        },
        showDialog:function () {
            this.dialogFormVisible = true;
            this.radio=this.cityId;
        },
        refresh:function () {
            localStorage.clear();
            location.reload();
        },
        addData:function () {
            if(this.formData.length>=3){
                this.getCityList=[];
                this.open3();
                this.input='';
                return
            }
            else {
                for(var m in this.formData){
                    if(this.formData[m].formCity==this.input){
                        this.getCityList=[];
                        this.open4();
                        this.input='';
                        return
                    }
                }
                axios.get('https://api.heweather.com/v5/search', {
                    params: {
                        key: this.key,
                        city: this.input
                    }
                })
                    .then(function (response) {
                        if(response.data.HeWeather5[0].status!='ok'){
                            this.getCityList=[];
                            this.open();
                            this.input='';
                        }
                        else {
                            this.formData.push({'formCity':response.data.HeWeather5[0].basic.city,'active':response.data.HeWeather5[0].basic.id});
                            this.getCityList=[];
                            this.input='';
                        }
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                        this.open1();
                    }.bind(this));

            }
        },
        delData:function (n) {
            if(this.formData[n].active==this.radio){
                this.open2();
            }
            else {
                this.formData.splice(n,1);
                this.cityId=this.radio;
                this.setCity();
            }
        },
        open:function(){
            this.$message.error('呃..这个..不存在的吧..');
        },
        open1:function(){
            this.$message.error('获取出了点问题..');
        },
        open2:function(){
            this.$message.error('不能删除默认城市');
        },
        open3:function(){
            this.$message.error('最多只能添加三条哟');
        },
        open4:function(){
            this.$message.error('这个..重复了吧..');
        },
        setCity:function () {
            localStorage.formData = JSON.stringify(this.formData);
            //加载效果
            if(this.weather_basic.id==this.radio){return}
            this.fullscreenLoading = true;
            setTimeout(function () {
                this.fullscreenLoading = false;

            }.bind(this), 800);

            this.cityId=this.radio;
            localStorage.cityId=this.cityId;

            axios.get('https://free-api.heweather.com/v5/weather', {
                params: {
                    key: this.key,
                    city: this.cityId
                }
            })
                .then(function (response) {
                    if(response.data.HeWeather5[0].status!='ok'){
                        this.open1();
                        return
                    }
                    this.city=response.data.HeWeather5[0].basic.city;
                    localStorage.city=this.city;
                    if(response.data.HeWeather5[0].aqi!=undefined){
                        this.weather_aqi = response.data.HeWeather5[0].aqi;

                    }else {
                        this.weather_aqi={"city": {
                            "aqi": "0",
                            "co": "无数据",
                            "no2": "无数据",
                            "o3": "无数据",
                            "pm10": "无数据",
                            "pm25": "无数据",
                            "qlty": "无数据",
                            "so2": "无数据"
                        }}
                    }
                    this.weather_now = response.data.HeWeather5[0].now;
                    this.weather_basic = response.data.HeWeather5[0].basic;
                    this.weather_daily_forecast = response.data.HeWeather5[0].daily_forecast;
                    if(response.data.HeWeather5[0].suggestion!=undefined){
                        this.weather_suggestion = response.data.HeWeather5[0].suggestion;}
                    else {
                        this.weather_suggestion={
                            "comf": {"brf": "无数据", "txt": "无数据"},
                            "cw": { "brf": "无数据","txt": "无数据"},
                            "drsg": {"brf": "无数据", "txt": "无数据"},
                            "flu": {"brf": "无数据", "txt": "无数据"},
                            "sport": {"brf": "无数据", "txt": "无数据"},
                            "trav": {"brf": "无数据", "txt": "无数据"},
                            "uv": {"brf": "无数据", "txt": "无数据"}
                        }
                    }
                    this.weather_hourly_forecast = response.data.HeWeather5[0].hourly_forecast;
                    //  保存city

                    this.context.clearRect(-2000,-2000,5000,5000);
                    //绘制max
                    this.context.beginPath();
                    this.context.moveTo(this.ratio*this.w*0.125,50*this.ratio-this.intervalMax1*this.ratio*this.interval);
                    this.context.quadraticCurveTo(this.ratio*this.w*0.3125,50*this.ratio-this.intervalMax2*this.ratio*this.interval, this.ratio*this.w*0.5,50*this.ratio-this.intervalMax2*this.ratio*this.interval);
                    this.context.quadraticCurveTo(this.ratio*this.w*0.6875,50*this.ratio-this.intervalMax2*this.ratio*this.interval,this.ratio*this.w*0.875,50*this.ratio-this.intervalMax3*this.ratio*this.interval);
                    this.context.stroke();
                    //绘制min
                    this.context.beginPath();
                    this.context.moveTo(this.ratio*this.w*0.125,150*this.ratio-this.intervalMin1*this.ratio*this.interval);
                    this.context.quadraticCurveTo(this.ratio*this.w*0.3125,150*this.ratio-this.intervalMin2*this.ratio*this.interval,this.ratio*this.w*0.5,150*this.ratio-this.intervalMin2*this.ratio*this.interval);
                    this.context.quadraticCurveTo(this.ratio*this.w*0.6875,150*this.ratio-this.intervalMin2*this.ratio*this.interval,this.ratio*this.w*0.875,150*this.ratio-this.intervalMin3*this.ratio*this.interval);
                    this.context.stroke();
                    //绘制文字
                    var gradient=this.context.createLinearGradient(0,0,this.w,0);
                    gradient.addColorStop("0","white");
                    gradient.addColorStop("1.0","white");
                    this.context.font=12*this.ratio+"px Arial";
                    this.context.textAlign="center";
                    this.context.fillStyle=gradient;
                    this.context.fillText(this.weather_daily_forecast[0].tmp.max+"°",this.ratio*this.w*0.125,50*this.ratio-this.intervalMax1*this.ratio*this.interval+40);
                    this.context.fillText(this.weather_daily_forecast[1].tmp.max+"°",this.ratio*this.w*0.5,50*this.ratio-this.intervalMax2*this.ratio*this.interval+40);
                    this.context.fillText(this.weather_daily_forecast[2].tmp.max+"°",this.ratio*this.w*0.875,50*this.ratio-this.intervalMax3*this.ratio*this.interval+40);



                    this.context.fillText(this.weather_daily_forecast[0].tmp.min+"°",this.ratio*this.w*0.125,150*this.ratio-this.intervalMin1*this.ratio*this.interval+35);
                    this.context.fillText(this.weather_daily_forecast[1].tmp.min+"°",this.ratio*this.w*0.5,150*this.ratio-this.intervalMin2*this.ratio*this.interval+35);
                    this.context.fillText(this.weather_daily_forecast[2].tmp.min+"°",this.ratio*this.w*0.875,150*this.ratio-this.intervalMin3*this.ratio*this.interval+35);


                    //日出日落

                    this.contextB.clearRect(-2000,-2000,5000,5000);

                    this.contextB.save();
                    this.contextB.setLineDash([10*this.ratio, 8*this.ratio]);
                    this.contextB.beginPath();
                    this.contextB.arc(0,0,130*this.ratio,0,Math.PI);
                    this.contextB.stroke();
                    this.contextB.restore();

                    //绘制太阳
                    this.contextB.save();
                    this.contextB.rotate(this.sunPercent*180*Math.PI/180);
                    this.contextB.beginPath();
                    this.contextB.arc(130*this.ratio,0,15*this.ratio,0,2*Math.PI);
                    this.contextB.stroke();
                    this.contextB.restore();
                    //日落日出文字
                    this.contextB.save();
                    this.contextB.textBaseline="bottom";
                    this.contextB.rotate(180*Math.PI/180);
                    this.contextB.font=12*this.ratio+"px Microsoft Yahei";
                    this.contextB.fillStyle=gradient;
                    this.contextB.fillText("日出"+this.weather_daily_forecast[0].astro.sr,-115*this.ratio,-5*this.ratio);
                    this.contextB.textAlign="right";
                    this.contextB.fillText("日落"+this.weather_daily_forecast[0].astro.ss,115*this.ratio,-5*this.ratio);
                    this.contextB.restore();


                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                    this.open1();

                }.bind(this));




        }

    },filters: {
        getTime: function (value) {
            var n=value.split(" ");
            return n[1];
        },
        getNumber:function (value) {
            return parseInt(value)
        }
    },
    /*   watch: {
     input: function (val) {
     this.getCity();
     },

     },*/
    computed: {

        maxAvg: function () {
            var maxavg=parseInt(this.weather_daily_forecast[0].tmp.max)+parseInt(this.weather_daily_forecast[1].tmp.max)+parseInt(this.weather_daily_forecast[2].tmp.max);
            return  parseInt(maxavg/3)
        },
        minAvg:function () {
            var minavg=parseInt(this.weather_daily_forecast[0].tmp.min)+parseInt(this.weather_daily_forecast[1].tmp.min)+parseInt(this.weather_daily_forecast[2].tmp.min);
            return  parseInt(minavg/3)
        },
        intervalMax1:function(){return parseInt(this.weather_daily_forecast[0].tmp.max)-this.maxAvg},
        intervalMax2:function(){return parseInt(this.weather_daily_forecast[1].tmp.max)-this.maxAvg},
        intervalMax3:function(){return parseInt(this.weather_daily_forecast[2].tmp.max)-this.maxAvg},
        intervalMin1:function(){return parseInt(this.weather_daily_forecast[0].tmp.min)-this.minAvg},
        intervalMin2:function(){return parseInt(this.weather_daily_forecast[1].tmp.min)-this.minAvg},
        intervalMin3:function(){return parseInt(this.weather_daily_forecast[2].tmp.min)-this.minAvg},
        imgOne:function(){return "./img/"+this.weather_daily_forecast[0].cond.code_d+".png"},
        imgTwo:function(){return "./img/"+this.weather_daily_forecast[1].cond.code_d+".png"},
        imgThree:function(){return "./img/"+this.weather_daily_forecast[2].cond.code_d+".png"},
        aqiPercent:function () {return parseInt(this.weather_aqi.city.aqi)/300*100},
        sunPercent:function () {
            var n=this.weather_daily_forecast[0].astro.ss.split(":");
            var m=this.weather_daily_forecast[0].astro.sr.split(":");
            var sum=parseInt(n[0])-parseInt(m[0]);
            var oDate = new Date();
            var nowHour=parseInt(oDate.getHours());
            /*   if(nowHour<=parseInt(m[0])){
             return 0
             }
             else if(nowHour>=parseInt(n[0])){
             return 1}
             else */
            return (nowHour-parseInt(m[0]))/sum
        },
        intervalDeg:function () {

            return parseInt(this.weather_now.wind.spd)/3
        }


    },
    beforeMount:function () {
        /*this.fullscreenLoading = true;
         setTimeout(function () {
         this.fullscreenLoading = false;

         }.bind(this), 1000);*/
    },
    mounted:function () {
        // localStorage.clear();

        window.addEventListener('scroll', this.menu);
        if( localStorage.formData){
            this.formData=JSON.parse(localStorage.formData)
        }
        if( localStorage.city&&localStorage.cityId){
            this.city=localStorage.city;
            this.radio=localStorage.cityId;
            this.cityId= localStorage.cityId;
        }
        if(this.formData.length==0){
            this.formData.push({'formCity':this.city,'active':this.cityId});
        }
        axios.get('https://free-api.heweather.com/v5/weather', {
            params: {
                key: this.key,
                city: this.cityId
            }
        })
            .then(function (response) {
                if(response.data.HeWeather5[0].status!='ok'){
                    this.open1();
                    return
                }
                if(response.data.HeWeather5[0].aqi!=undefined){
                    this.weather_aqi = response.data.HeWeather5[0].aqi;}
                else {
                    this.weather_aqi={"city": {
                        "aqi": "0",
                        "co": "无数据",
                        "no2": "无数据",
                        "o3": "无数据",
                        "pm10": "无数据",
                        "pm25": "无数据",
                        "qlty": "无数据",
                        "so2": "无数据"
                    }}
                }
                this.weather_now = response.data.HeWeather5[0].now;
                this.weather_basic = response.data.HeWeather5[0].basic;
                this.weather_daily_forecast = response.data.HeWeather5[0].daily_forecast;
                if(response.data.HeWeather5[0].suggestion!=undefined){
                    this.weather_suggestion = response.data.HeWeather5[0].suggestion;}
                else {
                    this.weather_suggestion={
                        "comf": {"brf": "无数据", "txt": "无数据"},
                        "cw": { "brf": "无数据","txt": "无数据"},
                        "drsg": {"brf": "无数据", "txt": "无数据"},
                        "flu": {"brf": "无数据", "txt": "无数据"},
                        "sport": {"brf": "无数据", "txt": "无数据"},
                        "trav": {"brf": "无数据", "txt": "无数据"},
                        "uv": {"brf": "无数据", "txt": "无数据"}
                    }
                }
                this.weather_hourly_forecast = response.data.HeWeather5[0].hourly_forecast;
                //延时初始化canvas
                setTimeout(function () {
                    this.scrollHeight=document.body.scrollHeight;
                    //svg初始化
                    document.getElementsByTagName('path')[0].attributes.stroke.nodeValue="#ffffff";
                    document.getElementsByTagName('path')[1].attributes.stroke.nodeValue="#ffffff";
                    document.getElementsByTagName('path')[0].style.opacity=0.25;
                    document.getElementsByTagName('path')[1].style.opacity=1;



                    var w=window.innerWidth
                        || document.documentElement.clientWidth
                        || document.body.clientWidth;
                    this.w=w;
                    this.canvas = document.getElementById('canvas');
                    this.context= this.canvas.getContext('2d');
                    this.canvasRight_h = document.getElementById('canvasRight').offsetHeight;
                    this.canvasA = document.getElementById('canvasA');
                    this.contextA= this.canvasA.getContext('2d');
                    this.canvasB = document.getElementById('canvasB');
                    this.contextB= this.canvasB.getContext('2d');
                    //缓入
                    this.canvas.style.opacity='1';
                    this.canvasA.style.opacity='1';
                    this.canvasB.style.opacity='1';
                    // 屏幕的设备像素比
                    var devicePixelRatio = window.devicePixelRatio || 1;

                    // 浏览器在渲染canvas之前存储画布信息的像素比
                    var backingStoreRatio = this.context.webkitBackingStorePixelRatio ||
                        this.context.mozBackingStorePixelRatio ||
                        this.context.msBackingStorePixelRatio ||
                        this.context.oBackingStorePixelRatio ||
                        this.context.backingStorePixelRatio || 1;

                    // canvas的实际渲染倍率
                    var ratio = devicePixelRatio / backingStoreRatio;
                    this.ratio=ratio;
                    this.canvas.style.width = this.w+'px';
                    this.canvas.style.height = '200px';
                    this.canvas.width = this.w * this.ratio;
                    this.canvas.height = 200 * this.ratio;

                    this.canvasA.style.width = this.w/2+'px';
                    this.canvasA.style.height =  this.canvasRight_h;
                    this.canvasA.width = this.w/2 * this.ratio;
                    this.canvasA.height = this.canvasRight_h *this.ratio;

                    this.canvasB.style.width = this.w+'px';
                    this.canvasB.style.height = '160px';
                    this.canvasB.width = this.w * this.ratio;
                    this.canvasB.height = 160 * this.ratio;


                    //绘制初始化

                    this.context.lineWidth=1.5*this.ratio;
                    this.context.strokeStyle='#ffffff';

                    //绘制max
                    this.context.beginPath();
                    this.context.moveTo(this.ratio*this.w*0.125,50*this.ratio-this.intervalMax1*this.ratio*this.interval);
                    this.context.quadraticCurveTo(this.ratio*this.w*0.3125,50*this.ratio-this.intervalMax2*this.ratio*this.interval, this.ratio*this.w*0.5,50*this.ratio-this.intervalMax2*this.ratio*this.interval);
                    this.context.quadraticCurveTo(this.ratio*this.w*0.6875,50*this.ratio-this.intervalMax2*this.ratio*this.interval,this.ratio*this.w*0.875,50*this.ratio-this.intervalMax3*this.ratio*this.interval);
                    this.context.stroke();
                    //绘制min
                    this.context.beginPath();
                    this.context.moveTo(this.ratio*this.w*0.125,150*this.ratio-this.intervalMin1*this.ratio*this.interval);
                    this.context.quadraticCurveTo(this.ratio*this.w*0.3125,150*this.ratio-this.intervalMin2*this.ratio*this.interval,this.ratio*this.w*0.5,150*this.ratio-this.intervalMin2*this.ratio*this.interval);
                    this.context.quadraticCurveTo(this.ratio*this.w*0.6875,150*this.ratio-this.intervalMin2*this.ratio*this.interval,this.ratio*this.w*0.875,150*this.ratio-this.intervalMin3*this.ratio*this.interval);
                    this.context.stroke();
                    //绘制文字
                    var gradient=this.context.createLinearGradient(0,0,this.w,0);
                    gradient.addColorStop("0","white");
                    gradient.addColorStop("1.0","white");
                    this.context.font=12*this.ratio+"px Arial";
                    this.context.textAlign="center";
                    this.context.fillStyle=gradient;
                    this.context.fillText(this.weather_daily_forecast[0].tmp.max+"°",this.ratio*this.w*0.125,50*this.ratio-this.intervalMax1*this.ratio*this.interval+40);
                    this.context.fillText(this.weather_daily_forecast[1].tmp.max+"°",this.ratio*this.w*0.5,50*this.ratio-this.intervalMax2*this.ratio*this.interval+40);
                    this.context.fillText(this.weather_daily_forecast[2].tmp.max+"°",this.ratio*this.w*0.875,50*this.ratio-this.intervalMax3*this.ratio*this.interval+40);



                    this.context.fillText(this.weather_daily_forecast[0].tmp.min+"°",this.ratio*this.w*0.125,150*this.ratio-this.intervalMin1*this.ratio*this.interval+35);
                    this.context.fillText(this.weather_daily_forecast[1].tmp.min+"°",this.ratio*this.w*0.5,150*this.ratio-this.intervalMin2*this.ratio*this.interval+35);
                    this.context.fillText(this.weather_daily_forecast[2].tmp.min+"°",this.ratio*this.w*0.875,150*this.ratio-this.intervalMin3*this.ratio*this.interval+35);


                    //日出日落
                    this.contextB.lineWidth=1.5*this.ratio;
                    this.contextB.strokeStyle='#ffffff';
                    this.contextB.translate(this.w/2*this.ratio,160*this.ratio);
                    this.contextB.rotate(180*Math.PI/180);

                    this.contextB.save();
                    this.contextB.setLineDash([10*this.ratio, 8*this.ratio]);
                    this.contextB.beginPath();
                    this.contextB.arc(0,0,130*this.ratio,0,Math.PI);
                    this.contextB.stroke();
                    this.contextB.restore();

                    //绘制太阳
                    this.contextB.save();
                    this.contextB.rotate(this.sunPercent*180*Math.PI/180);
                    this.contextB.beginPath();
                    this.contextB.arc(130*this.ratio,0,15*this.ratio,0,2*Math.PI);
                    this.contextB.stroke();
                    this.contextB.restore();
                    //日落日出文字
                    this.contextB.save();
                    this.contextB.textBaseline="bottom";
                    this.contextB.rotate(180*Math.PI/180);
                    this.contextB.font=12*this.ratio+"px Microsoft Yahei";
                    this.contextB.fillStyle=gradient;
                    this.contextB.fillText("日出"+this.weather_daily_forecast[0].astro.sr,-115*this.ratio,-5*this.ratio);
                    this.contextB.textAlign="right";
                    this.contextB.fillText("日落"+this.weather_daily_forecast[0].astro.ss,115*this.ratio,-5*this.ratio);
                    this.contextB.restore();

                    //风车canvas


                    setInterval(function () {

                            this.contextA.clearRect(-1000,-1000,2000,2000);
                            this.contextA.lineWidth=1.5*this.ratio;
                            this.contextA.strokeStyle='#ffffff';
                            this.contextA.fillStyle='#ffffff';

                            // 第一个风车架
                            this.contextA.save();
                            this.contextA.beginPath();
                            this.contextA.moveTo(this.w*5/48*this.ratio,this.canvasRight_h*this.ratio);
                            this.contextA.lineTo(this.w*7/48*this.ratio,this.canvasRight_h*4/12*this.ratio);
                            this.contextA.lineTo(this.w*9/48*this.ratio,this.canvasRight_h*this.ratio);
                            this.contextA.stroke();
                            this.contextA.restore();
                            //第二个风车架
                            this.contextA.save();
                            this.contextA.beginPath();
                            this.contextA.moveTo(this.w*14/48*this.ratio,this.canvasRight_h*this.ratio);
                            this.contextA.lineTo(this.w*15/48*this.ratio,this.canvasRight_h*2/3*this.ratio);
                            this.contextA.lineTo(this.w*16/48*this.ratio,this.canvasRight_h*this.ratio);
                            this.contextA.stroke();
                            this.contextA.restore();
                            //第一个风车
                            this.contextA.save();
                            this.contextA.translate(this.w*7/48*this.ratio,this.canvasRight_h*4/12*this.ratio);
                            this.contextA.rotate(this.deg*Math.PI/180);
                            this.contextA.beginPath();
                            this.contextA.arc(0,-8*this.ratio,5*this.ratio,5/12*Math.PI,7/12*Math.PI);
                            this.contextA.lineTo(0,-(this.canvasRight_h*1/4*this.ratio));
                            this.contextA.closePath();
                            this.contextA.stroke();
                            this.contextA.fill();
                            this.contextA.restore();

                            this.contextA.save();
                            this.contextA.translate(this.w*7/48*this.ratio,this.canvasRight_h*4/12*this.ratio);
                            this.contextA.rotate((120+this.deg)*Math.PI/180);
                            this.contextA.beginPath();
                            this.contextA.arc(0,-8*this.ratio,5*this.ratio,5/12*Math.PI,7/12*Math.PI);
                            this.contextA.lineTo(0,-(this.canvasRight_h*1/4*this.ratio));
                            this.contextA.closePath();
                            this.contextA.stroke();
                            this.contextA.fill();
                            this.contextA.restore();

                            this.contextA.save();
                            this.contextA.translate(this.w*7/48*this.ratio,this.canvasRight_h*4/12*this.ratio);
                            this.contextA.rotate((240+this.deg)*Math.PI/180);
                            this.contextA.beginPath();
                            this.contextA.arc(0,-8*this.ratio,5*this.ratio,5/12*Math.PI,7/12*Math.PI);
                            this.contextA.lineTo(0,-(this.canvasRight_h*1/4*this.ratio));
                            this.contextA.closePath();
                            this.contextA.stroke();
                            this.contextA.fill();
                            this.contextA.restore();

                            //第二个风车
                            this.contextA.save();
                            this.contextA.translate(this.w*15/48*this.ratio,this.canvasRight_h*2/3*this.ratio);
                            this.contextA.rotate(this.deg*Math.PI/180);
                            this.contextA.beginPath();
                            this.contextA.arc(0,-8*this.ratio,5*this.ratio,5/12*Math.PI,7/12*Math.PI);
                            this.contextA.lineTo(0,-(this.canvasRight_h*1/8*this.ratio));
                            this.contextA.closePath();
                            this.contextA.stroke();
                            this.contextA.fill();
                            this.contextA.restore();

                            this.contextA.save();
                            this.contextA.translate(this.w*15/48*this.ratio,this.canvasRight_h*2/3*this.ratio);
                            this.contextA.rotate((120+this.deg)*Math.PI/180);
                            this.contextA.beginPath();
                            this.contextA.arc(0,-8*this.ratio,5*this.ratio,5/12*Math.PI,7/12*Math.PI);
                            this.contextA.lineTo(0,-(this.canvasRight_h*1/8*this.ratio));
                            this.contextA.closePath();
                            this.contextA.stroke();
                            this.contextA.fill();
                            this.contextA.restore();

                            this.contextA.save();
                            this.contextA.translate(this.w*15/48*this.ratio,this.canvasRight_h*2/3*this.ratio);
                            this.contextA.rotate((240+this.deg)*Math.PI/180);
                            this.contextA.beginPath();
                            this.contextA.arc(0,-8*this.ratio,5*this.ratio,5/12*Math.PI,7/12*Math.PI);
                            this.contextA.lineTo(0,-(this.canvasRight_h*1/8*this.ratio));
                            this.contextA.closePath();
                            this.contextA.stroke();
                            this.contextA.fill();
                            this.contextA.restore();
                            this.deg=this.deg+this.intervalDeg;
                        }.bind(this)
                        ,17)

                }.bind(this),1000)

            }.bind(this))
            .catch(function (error) {
                console.log(error);
                this.open1();

            }.bind(this));




    }

});



/**
 * Created by shenyu on 2017/5/21.
 */

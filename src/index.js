import Vue from 'vue'
import VueRouter from 'vue-router'

import './assets/theme/index.css'

Vue.prototype.$ELEMENT = {
  size: 'medium'
}

import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Badge,
  Card,
  Rate,
  Steps,
  Step,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Loading,
  MessageBox,
  Message,
  Notification
} from 'element-ui'
import App from './App.vue'

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Slider)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Badge)
Vue.use(Card)
Vue.use(Rate)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Cascader)
Vue.use(ColorPicker)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)


Vue.use(VueRouter);

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

import Home from './Pages/Home.vue'
import UserDetails from './Pages/UserDetails.vue'

import ProductList from './Pages/ProductList.vue'
import ProductCate from './Pages/ProductCate.vue'

import ShopList from './Pages/shopList.vue'
import ShopAudit from './Pages/ShopAudit.vue'
import ReplenishOrderList from './Pages/ReplenishOrderList.vue'
import WithdrawList from './Pages/WithdrawList.vue'

import ShopOrders from './Pages/ShopOrders.vue'
import ProductOrder from './Pages/ProductOrder.vue'

import GoodsStatList from './Pages/GoodsStatList.vue'
import WarehouseList from './Pages/WarehouseList.vue'
import WarehouseEdit from './Pages/WarehouseEdit.vue'
import WarehouseGoods from './Pages/WarehouseGoods.vue'

import BannerList from './Pages/BannerList.vue'
import UserAnalysis from './Pages/UserAnalysis.vue'
import ShopAnalysis from './Pages/ShopAnalysis.vue'
import ReplenishTemp from './Pages/ReplenishTemp.vue'

import RoleList from './Pages/RoleList.vue'
import RootList from './Pages/RootList.vue'

import Developing from './Pages/Developing.vue'
import NotFound from './Pages/NotFound.vue'


import SelfOrders from './Pages/SelfOrders.vue'
import ExpressOrders from './Pages/ExpressOrders.vue'

import DriverOperate from './Pages/DriverOperate.vue'
import PassengerOperate from './Pages/PassengerOperate.vue'

import MarketingAnalysis from './Pages/MarketingAnalysis.vue'
import SalesAnalysis from './Pages/SalesAnalysis.vue'
import SalesDayAnalysis from './pages/SalesDayAnalysis.vue'

import PassOperatDetail from './Pages/PassOperatDetail.vue'

import SaleOrders from './Pages/SaleOrders.vue'
import UserPic from './Pages/UserPic.vue'

const checkAuth = (to, from, next) =>{
  let loginInfo = window.sessionStorage.getItem('loginInfo');
  if(JSON.parse(loginInfo) && JSON.parse(loginInfo).data && JSON.parse(loginInfo).data.moduleList){
    let userAuthList = JSON.parse(loginInfo).data.moduleList;
    let finalArr = userAuthList.filter((item,index)=>(
      item.moduleUri == to.path
    ));
    if(finalArr.length > 0){
      next();
    }else{
      next();
      alert('您无权访问该页面，请联系管理员！');
    }
  }
};
const router = new VueRouter({
  routes: [
    { path: '*',
    component: NotFound
    },{
      path: '/',
      name: 'home',
      component: Home
    },{
			path: '/shopList',
			name: 'shoplist',
			component: ShopList,
      beforeEnter:checkAuth
		},{
			path: '/shopAudit',
			name: 'shopaudit',
			component: ShopAudit,
      beforeEnter:checkAuth
		},{
			path: '/replenishOrderList',
			name: 'replenishorderlist',
			component: ReplenishOrderList,
		},{
      path : '/withdrawList',
      name : 'withdrawList',
      component : WithdrawList,
      beforeEnter:checkAuth
    },{
      path: '/productList',
      name: 'productList',
      component: ProductList,
      beforeEnter:checkAuth
    },{
      path: '/productCate',
      name: 'productCate',
      component: ProductCate,
      beforeEnter:checkAuth
    },{
      path: '/productOrder',
      name: 'productOrder',
      component: ProductOrder,
      beforeEnter:checkAuth
    },{
      path : '/userDetails',
      name : 'userDetails',
      component : UserDetails
    },{
      path : '/goodsStatList',
      name : 'goodsStatList',
      component : GoodsStatList,
      beforeEnter:checkAuth
    },{
      path: '/warehouseList',
      name: 'warehouseList',
      component: WarehouseList,
      beforeEnter:checkAuth
    },{
      path : '/warehouseEdit',
      name : 'warehouseEdit',
      component : WarehouseEdit
    },{
      path : '/warehouseGoods',
      name : 'warehouseGoods',
      component : WarehouseGoods,
    },{
      path : '/shopOrders',
      name : 'shopOrders',
      component : ShopOrders
    },{
      path : '/developing',
      name : 'developing',
      alias : ['/goodsStatList1','/developing-a','/developing-b','/developing-c','/developing-d','/developing-f'],
      component : Developing
    },{
      path : '/bannerList',
      name : 'bannerlist',
      component : BannerList,
      beforeEnter:checkAuth
    },{
      path : '/userAnalysis',
      name : 'useranalysis',
      component : UserAnalysis,
      beforeEnter:checkAuth
    },{
      path : '/shopAnalysis',
      name : 'shopanalysis',
      component : ShopAnalysis,
      beforeEnter:checkAuth
    },{
      path : '/marketingAnalysis',
      name : 'marketinganalysis',
      component : MarketingAnalysis,
      beforeEnter:checkAuth
    },{
      path : '/salesAnalysis',
      name : 'salesanalysis',
      component : SalesAnalysis,
      beforeEnter:checkAuth
    },{
      path : '/replenishTemp',
      name : 'ueplenishtemp',
      component : ReplenishTemp,
      beforeEnter:checkAuth
    },{
      path : '/roleList',
      name : 'roleList',
      component : RoleList,
      beforeEnter:checkAuth
    },{
      path : '/rootList',
      name : 'rootList',
      component : RootList,
      beforeEnter:checkAuth
    },{
      path : '/selfOrders',
      name : 'selfOrders',
      component : SelfOrders,
      beforeEnter:checkAuth
    },{
      path : '/expressOrders',
      name : 'expressOrders',
      component : ExpressOrders,
      beforeEnter:checkAuth
    },{
      path : '/driverOperate',
      name : 'driverOperate',
      component : DriverOperate,
      beforeEnter:checkAuth
    },{
      path : '/passengerOperate',
      name : 'passengerOperate',
      component : PassengerOperate,
      beforeEnter:checkAuth
    },{
      path : '/passOperatDetail',
      name : 'passOperatDetail',
      component : PassOperatDetail
    },{
      path : '/saleOrders',
      name : 'saleOrders',
      component : SaleOrders
    },
    {
      path : '/salesDayAnalysis',
      name : 'salesDayAnalysis',
      component : SalesDayAnalysis
    },
    {
      path : '/userPic',
      name : 'userPic',
      component : UserPic
    }
  ]
});

const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

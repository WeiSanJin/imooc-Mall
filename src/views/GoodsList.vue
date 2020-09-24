<template>
  <div>
    <NavHeader></NavHeader>
    <nac-bread>
      <span slot="bread">Goods</span>
    </nac-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price 
            <svg class="icon icon-arrow-short" :class="{'sort-up':!sortFlag}" viewBox="0 0 25 32" width="100%" height="100%">
              <title>arrow-short</title>
              <path d="M24.487 18.922l-1.948-1.948-8.904 8.904v-25.878h-2.783v25.878l-8.904-8.904-1.948 1.948 12.243 12.243z" class="path1"></path>
            </svg>
          </a>
          <a
            href="javascript:void(0)"
            class="filterby stopPop"
            @click="ShowFilterPop"
          >Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a
                  href="javascript:void(0)"
                   v-bind:class="{'cur':PriceChecked=='all'}"
                   @click="PriceChecked='all'">All
                </a>
              </dd>
              <dd v-for="(price,index) in PriceFilter">
                <a
                   href="javascript:void(0)"
                   :class="{'cur':PriceChecked==index}"
                   @click="setPriceFilter(index)"
                >{{price.startPrice}} - {{price.endPrice}}
                </a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in GoodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <!--  分页插件  -->
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinte-scroll-distance="30">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <!-- 提示登录模态框 -->
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">
        请先登录，否则无法加入到购物车中！
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
      </div>
    </modal>
    <!-- 成功加入购物车模态框 -->
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok" viewBox="0 0 32 32" width="100%" height="100%">
          <path d="M22.361 10.903l-9.71 9.063-2.998-2.998c-0.208-0.209-0.546-0.209-0.754 0s-0.208 0.546 0 0.754l3.363 3.363c0.104 0.104 0.241 0.156 0.377 0.156 0.131 0 0.261-0.048 0.364-0.143l10.087-9.414c0.215-0.201 0.227-0.539 0.026-0.754s-0.539-0.226-0.754-0.026z" class="path1"></path>
          <path d="M16 30.933c-8.234 0-14.933-6.699-14.933-14.933s6.699-14.933 14.933-14.933c8.234 0 14.933 6.699 14.933 14.933s-6.699 14.933-14.933 14.933zM16 0c-8.822 0-16 7.178-16 16 0 8.823 7.178 16 16 16s16-7.177 16-16c0-8.822-7.178-16-16-16z" class="path2"></path>
        </svg>
        <span>加入购物车成功</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <NavFooter></NavFooter>
  </div>
</template>

<script>
  import './../assets/css/base.css'
  import './../assets/css/product.css'
  import NavHeader from '@/components/NavHeader.vue'
  import NavFooter from "../components/NavFooter";
  import NacBread from "../components/NacBread";
  import Modal from './../components/Modal'
  import axios from 'axios'
    export default {
      name: "GoodsList",
      data() {
        return {
          GoodsList:[],
          sortFlag:true,// 排序
          page:1,
          pageSize:8,
          busy:true,
          loading:true,
          mdShow:false,// 【请先登录】绑定属性
          mdShowCart:false,// 【成功加入购物车】绑定属性
          PriceFilter:[
            {
              startPrice: '0',
              endPrice: '100'
            },
            {
              startPrice: '100',
              endPrice: '500'
            },
            {
              startPrice: '500',
              endPrice: '1000'
            },
            {
              startPrice: '1000',
              endPrice: '2000'
            }
          ],
          PriceChecked: 'all',
          filterBy: false, //自适应弹窗价格
          overLayFlag:false//弹窗遮罩
        }
      },
      components:{
        NavHeader,
        NacBread,
        NavFooter,
        Modal
      },
      mounted: function() {
        this.getGoodsList();
      },
      methods:{
        // 获取购物车列表
        getGoodsList(flag) {
          // 默认第一页、一页8条数据、升序，点击价格升降序修改页码、价格状态
          let param = {
            page:this.page,
            pageSize:this.pageSize,
            //1：升序 -1：降序
            sort:this.sortFlag ? 1:-1,
            priceLevel:this.PriceChecked
          }
          this.loading =true;
          axios.get('/goods',{
            params:param
          }).then((result)=>{
            let res = result.data;
            this.loading = false;
            if (res.status == '0'){
              if(flag) {
                // concat:数组串联起来，进行合并
                this.GoodsList = this.GoodsList.concat((res.result.list));
                if(res.result.count == 0){
                  this.busy = true;// 滚动失效
                }else {
                  this.busy = false;
                }
              }else {
                this.GoodsList = res.result.list;
                this.busy = false;
              }
            }
            else{
              this.GoodsList = [];
            }
          })
        },
        // 点击价格排序
        sortGoods() {
          this.sortFlag = !this.sortFlag;
          this.page = 1
          this.getGoodsList();
        },
        // 点击价格列表展开
        ShowFilterPop() { 
          this.filterBy = true;
          this.overLayFlag = true;
        },
        // 点击价格列表项
        setPriceFilter(index) { 
          this.PriceChecked = index; // 设置选中当前项
          this.page = 1;
          this.getGoodsList();
          if(this.filterBy)this.closePop(); // 如果自适应弹窗开启状态则关闭弹窗遮罩
        },
        // 遮罩点击关闭
        closePop(){ 
          this.filterBy = false;
          this.overLayFlag = false;
        },
        // 分页鼠标滚动调用函数
        loadMore() {
          this.busy = true;
          setTimeout(()=>{
            this.page++;// 滚动之后下一页
            this.getGoodsList(true);// 加载商品列表
          },500)

        },
        // 加入购物车
        addCart(productId) {
          axios.post('/goods/addCart',{
            productId:productId
          }).then((res)=>{
            if (res.data.status == 0){
              this.mdShowCart = true;// 打开模态框【加入购物车成功】
              this.$store.commit("updateCartCount",1);
            }
            else{
              this.mdShow = true;// 打开模态框【请先登录，否则无法加入到购物车中】
            }
          })
        },
        // 关闭模态框
        closeModal() {
          if(this.mdShow)this.mdShow = false;
          if(this.mdShowCart)this.mdShowCart = false;
        }
      },
    }
</script>

<style>
  .list-wrap ul::after{
    clear: both;
    content: '';
    height: 0;
    display: block;
    visibility: hidden;
  }
  .load-more{
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .sort-up{
    transform: rotate(180deg);
    transition: all 0.3s ease-out;
  }
  .icon-arrow-short{
    width: 11px;
    height: 11px;
    transition: all .3s ease-out;
  }
  .btn:hover{
    background-color: #ffe5e6;
    transition: all 0.3 ease-out;
  }
</style>

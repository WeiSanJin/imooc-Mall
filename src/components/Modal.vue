<template>
    <div>
      <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
        <div class="md-modal-inner">
          <div class="md-top">
            <button class="md-close"  @click="closeModal">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <slot name="message"></slot>
            </div>
            <div class="btn-wrap">
              <slot name="btnGroup"></slot>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
    </div>
</template>

<script>
    export default{
        name: 'Modal',
        props:["mdShow"],// 用来接收父组件传给子组件的数据
        data(){
            return{
                msg:'hello vue'
            }
        },
        methods:{
          closeModal(){
            this.$emit("close");// $emit子组件调用父组件的方法并传递数据
          }
        }
    }
</script>
<template>
  <footer class="footer">
    <div class="footer__wrap">
      <div class="footer__secondary">
        <div class="footer__inner">
<!--          <div class="footer__region">
            <span>Region</span>
            <select class="footer__region__select">
              <option value="en-US">USA</option>
              <option value="zh-CN">China</option>
              <option value="in">India</option>
            </select>
          </div> -->
          <div class="footer__secondary__nav">
            <span>Copyright © 2020 weisanjin.com All Rights Reserved.</span>
           <a href="http://www.beian.miit.gov.cn/" target="_blank">闽ICP备20011534号</a>
<!--            <a href="http://us.lemall.com/us/termsofUse.html">
              Terms &amp; Conditions
            </a>
            <a href="http://us.lemall.com/us/privacyPolicy.html">
              Privacy Policy
            </a> -->
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
    export default {
        name: "NavFooter"
    }
</script>

<style scoped>
.footer__secondary__nav{
	position: inherit;
	text-align: center;
	right: 0px;
}
</style>
